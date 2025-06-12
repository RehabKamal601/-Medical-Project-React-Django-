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

    def create(self, request, *args, **kwargs):
        print("Registration data:", request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doctor = serializer.save()
        print(f"Created doctor: {doctor}, User: {doctor.user.username}")

        return Response({
            'id': doctor.id,
            'user_id': doctor.user.id,
            'username': doctor.user.username,
            'specialization': doctor.specialization,
            'message': 'Doctor registered successfully'
        }, status=status.HTTP_201_CREATED)



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

class DoctorAvailabilityCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_doctor(self, request):
        try:
            print("\n=== Doctor Profile Debug ===")
            print(f"User ID: {request.user.id}")
            print(f"Username: {request.user.username}")
            print(f"Role: {request.user.role}")
            print(f"Is authenticated: {request.user.is_authenticated}")
            
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            # Verify user exists
            user = User.objects.get(id=request.user.id)
            print(f"User found: {user}, Role: {user.role}")
            
            # Create doctor profile if it doesn't exist
            doctor, created = Doctor.objects.get_or_create(
                user=request.user,
                defaults={
                    'specialization': request.user.specialization or '',
                    'phone': '',
                    'bio': '',
                    'address': ''
                }
            )
            
            if created:
                print("Created new doctor profile")
            else:
                print("Found existing doctor profile")
                
            return doctor
                
        except Doctor.DoesNotExist as e:
            print(f"Doctor profile not found for user: {request.user.username}")
            print(f"Error: {str(e)}")
            return None
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return None

    def get(self, request):
        print("\n=== Get Availability Debug ===")
        print("Authorization header:", request.headers.get('Authorization'))
        
        doctor = self.get_doctor(request)
        if not doctor:
            return Response({
                "error": "No doctor profile found for this user",
                "user_id": request.user.id,
                "username": request.user.username,
                "is_authenticated": request.user.is_authenticated
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get all availability slots for this doctor    
        availability = DoctorAvailability.objects.filter(doctor=doctor)
        print(f"Found {availability.count()} availability slots")
        
        serializer = DoctorAvailabilitySerializer(availability, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("\n=== Create Availability Debug ===")
        print("Request data:", request.data)
        
        doctor = self.get_doctor(request)
        if not doctor:
            return Response(
                {"error": "No doctor profile found for this user"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate required fields
        required_fields = ['day', 'start_time', 'end_time']
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {"error": f"Missing required field: {field}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        data = request.data.copy()
        data['doctor'] = doctor.id
        
        print("Data to be saved:", data)
        
        serializer = DoctorAvailabilitySerializer(data=data)
        if serializer.is_valid():
            availability = serializer.save()
            print(f"Created availability: {availability}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        doctor = self.get_doctor(request)
        if not doctor:
            return Response(
                {"error": "No doctor profile found for this user"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        DoctorAvailability.objects.filter(doctor=doctor).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

    # def get_object(self):
    #     user = self.request.user
    #     if not user.is_authenticated:
    #         raise NotAuthenticated("You must be logged in.")
    #     try:
    #         return user.doctor
    #     except Doctor.DoesNotExist:
    #         raise NotAuthenticated("No doctor profile linked to this user.")
    def get_object(self):
        user = self.request.user
        if not user.is_authenticated:
            raise NotAuthenticated("You must be logged in.")
        try:
            return user.doctor
        except Doctor.DoesNotExist:
            # Create a new doctor profile if it doesn't exist
            return Doctor.objects.create(user=user, specialization='', phone='', bio='', address='')


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Handle nested user data from form-data
        data = request.data.copy()
        user_data = {}
        
        # Extract user fields from form data
        user_fields = ['first_name', 'last_name', 'email']
        for field in user_fields:
            key = f'user.{field}'
            if key in request.data:
                user_data[field] = request.data[key]
        
        # Add extracted user data back to the request data
        if user_data:
            data['user'] = user_data

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

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
