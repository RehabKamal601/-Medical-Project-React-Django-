# //view
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Doctor
from .serializers import DoctorSerializer
from .serializers import DoctorRegisterSerializer
from .models import Doctor
from .models import DoctorAvailability
from .serializers import DoctorAvailabilitySerializer

from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.exceptions import NotAuthenticated


from rest_framework import generics, permissions
from rest_framework.views import APIView
from django.db.models import Count
from datetime import date
from .models import Patient




class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer



# i want when register give him token

class DoctorRegisterView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorRegisterSerializer



# class DoctorRegisterView(generics.CreateAPIView):
#     queryset = Doctor.objects.all()
#     serializer_class = DoctorRegisterSerializer

#     def perform_create(self, serializer):
#         # Create doctor + user
#         user = serializer.save()
#         self.user = user

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)

#         # Generate token for the created user
#         refresh = RefreshToken.for_user(self.user)

#         response_data = {
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#             'user': {
#                 'id': self.user.id,
#                 'username': self.user.username,
#                 'email': self.user.email,
#             }
#         }

#         headers = self.get_success_headers(serializer.data)
#         return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

class DoctorAvailabilityCreateView(generics.ListCreateAPIView):
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            doctor = self.request.user.doctor
            return DoctorAvailability.objects.filter(doctor=doctor)
        except Doctor.DoesNotExist:
            raise NotAuthenticated("No doctor profile found for this user.")

    def perform_create(self, serializer):
        try:
            doctor = self.request.user.doctor
            serializer.save(doctor=doctor)
        except Doctor.DoesNotExist:
            raise NotAuthenticated("No doctor profile found for this user.")



class AppointmentListView(generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            doctor = self.request.user.doctor
            return Appointment.objects.filter(doctor=doctor)
        except Doctor.DoesNotExist:
            raise NotAuthenticated("No doctor profile found for this user.")

class AppointmentUpdateView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            doctor = self.request.user.doctor
            return Appointment.objects.filter(doctor=doctor)
        except Doctor.DoesNotExist:
            raise NotAuthenticated("No doctor profile found for this user.")

class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer



class DoctorProfileUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorRegisterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if not user.is_authenticated:
            raise NotAuthenticated("You must be logged in.")
        try:
            return user.doctor
        except Doctor.DoesNotExist:
            raise NotAuthenticated("No doctor profile linked to this user.")

class DoctorDashboardStats(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'doctor':
            return Response({"error": "Only doctors can access this endpoint"}, status=403)
            
        # Get today's date
        today = date.today()
        
        try:
            # Get doctor's appointments
            upcoming_appointments = Appointment.objects.filter(
                doctor=request.user,
                date__gte=today
            ).count()
            
            # Get today's appointments
            todays_appointments = Appointment.objects.filter(
                doctor=request.user,
                date=today
            ).count()
            
            # Get total patients
            total_patients = Patient.objects.filter(
                appointments__doctor=request.user
            ).distinct().count()
        except:
            # If any error occurs or tables don't exist yet, return zeros
            upcoming_appointments = 0
            todays_appointments = 0
            total_patients = 0
        
        return Response({
            "doctor": {
                "name": f"Dr. {request.user.first_name} {request.user.last_name}".strip() or f"Dr. {request.user.username}",
                "title": request.user.specialization or "Doctor"
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
