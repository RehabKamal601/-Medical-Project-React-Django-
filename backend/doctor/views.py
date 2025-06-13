# //view
from rest_framework import viewsets, status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from rest_framework.permissions import AllowAny
from django.db.models import Count
from datetime import date
from django.contrib.auth import get_user_model
import json

from .models import Doctor, DoctorAvailability, Appointment, Patient
from .serializers import (
    DoctorSerializer,
    DoctorRegisterSerializer,
    DoctorAvailabilitySerializer,
    AppointmentSerializer
)

User = get_user_model()

class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

class DoctorRegisterView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doctor = serializer.save()

        return Response({
            'id': doctor.id,
            'user_id': doctor.user.id,
            'username': doctor.user.username,
            'email': doctor.user.email,
            'specialization': doctor.specialization,
            'message': 'Doctor registered successfully'
        }, status=status.HTTP_201_CREATED)

class DoctorAvailabilityCreateView(APIView):
    permission_classes = [IsDoctor]

    def get_doctor(self, request):
        try:
            return request.user.doctor
        except Doctor.DoesNotExist:
            raise NotAuthenticated("No doctor profile found for this user.")

    def get(self, request):
        doctor = self.get_doctor(request)
        availability = DoctorAvailability.objects.filter(doctor=doctor)
        serializer = DoctorAvailabilitySerializer(availability, many=True)
        return Response(serializer.data)

    def post(self, request):
        doctor = self.get_doctor(request)
        data = request.data.copy()
        data['doctor'] = doctor.id
        
        serializer = DoctorAvailabilitySerializer(data=data)
        if serializer.is_valid():
            availability = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        doctor = self.get_doctor(request)
        DoctorAvailability.objects.filter(doctor=doctor).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return Appointment.objects.filter(doctor=self.request.user.doctor)

class AppointmentUpdateView(generics.UpdateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return Appointment.objects.filter(doctor=self.request.user.doctor)

class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'doctor':
            serializer.save(doctor=self.request.user.doctor)
        else:
            serializer.save()

class DoctorProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [IsDoctor]

    def get_object(self):
        try:
            return self.request.user.doctor
        except Doctor.DoesNotExist:
            raise NotAuthenticated("No doctor profile found for this user.")
            
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            # Parse the user data from the request
            user_data = None
            if 'user' in request.data:
                try:
                    if isinstance(request.data['user'], str):
                        user_data = json.loads(request.data['user'])
                    else:
                        user_data = request.data['user']
                except json.JSONDecodeError:
                    return Response(
                        {'user': 'Invalid JSON format'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Prepare doctor data
            doctor_data = {
                'specialization': request.data.get('specialization', ''),
                'phone': request.data.get('phone', ''),
                'bio': request.data.get('bio', ''),
                'address': request.data.get('address', '')
            }

            # Add image if it exists in request
            if 'image' in request.FILES:
                doctor_data['image'] = request.FILES['image']

            # Combine data for serializer
            data = {
                **doctor_data
            }
            if user_data:
                data['user'] = user_data

            print("Data being sent to serializer:", data)  # Debug print

            serializer = self.get_serializer(instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            # Refresh from database to ensure we have latest data
            instance.refresh_from_db()
            instance.user.refresh_from_db()

            return Response(serializer.data)
        except Exception as e:
            print("Error in update:", str(e))  # Debug print
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class DoctorDashboardStats(APIView):
    permission_classes = [IsDoctor]
    
    def get(self, request):
        doctor = request.user.doctor
        today = date.today()
        
        upcoming_appointments = Appointment.objects.filter(
            doctor=doctor,
            date__gte=today
        ).count()
        
        todays_appointments = Appointment.objects.filter(
            doctor=doctor,
            date=today
        ).count()
        
        total_patients = Patient.objects.filter(
            appointments__doctor=doctor
        ).distinct().count()
        
        return Response({
            "doctor": {
                "name": f"Dr. {request.user.first_name} {request.user.last_name}".strip() or f"Dr. {request.user.username}",
                "title": doctor.specialization or "Doctor"
            },
            "stats": [
                {
                    "id": 1,
                    "title": "Upcoming Appointments",
                    "value": upcoming_appointments,
                    "action": "View Schedule",
                    "theme": "appointments",
                    "path": "/doctor/appointments"
                },
                {
                    "id": 2,
                    "title": "Total Patients",
                    "value": total_patients,
                    "action": "View Patients",
                    "theme": "patients",
                    "path": "/doctor/patients"
                },
                {
                    "id": 3,
                    "title": "Today's Appointments",
                    "value": todays_appointments,
                    "action": "View Today",
                    "theme": "today",
                    "path": "/doctor/schedule"
                }
            ]
        })


# New view to handle doctor's patients
class DoctorPatientsListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer  # We'll reuse the appointment serializer 
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            doctor = self.request.user.doctor
            # Get unique patients from appointments
            return Appointment.objects.filter(doctor=doctor).select_related('patient').distinct('patient')
        except Doctor.DoesNotExist:
            raise NotAuthenticated("No doctor profile found for this user.")
        


# 6.1 generics get - post

class Generics_list(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


# 6.2 generics get - put - delete

class Generics_id(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]


# Appointments for patient components
class Appointments_list(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class Appointment_id(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]

# Reservations for patient components
class Reservations_list(generics.ListCreateAPIView):
    queryset = DoctorAvailability.objects.all()
    serializer_class = DoctorAvailabilitySerializer

class Reservation_id(generics.RetrieveUpdateDestroyAPIView):
    queryset = DoctorAvailability.objects.all()
    serializer_class = DoctorAvailabilitySerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]

# for show all avialbilty days for doctor
class DoctorAvailabilityListView(generics.ListAPIView):
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        return DoctorAvailability.objects.filter(doctor_id=doctor_id)