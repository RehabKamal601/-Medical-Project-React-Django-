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