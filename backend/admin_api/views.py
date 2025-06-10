from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import (
    AdminDoctor,
    AdminPatient,
    AdminAppointment,
    AdminSpecialty,
    AdminSystemAlert,
    AdminNotification,
    AdminActivityLog
)
from .serializers import (
    AdminDoctorSerializer,
    AdminPatientSerializer,
    AdminAppointmentSerializer,
    AdminSpecialtySerializer,
    AdminSystemAlertSerializer,
    AdminNotificationSerializer,
    AdminActivityLogSerializer
)

# Doctor ViewSet
class AdminDoctorViewSet(viewsets.ModelViewSet):
    queryset = AdminDoctor.objects.all()
    serializer_class = AdminDoctorSerializer
    permission_classes = [IsAdminUser]

# Patient ViewSet
class AdminPatientViewSet(viewsets.ModelViewSet):
    queryset = AdminPatient.objects.all()
    serializer_class = AdminPatientSerializer
    permission_classes = [IsAdminUser]

# Appointment ViewSet
class AdminAppointmentViewSet(viewsets.ModelViewSet):
    queryset = AdminAppointment.objects.all()
    serializer_class = AdminAppointmentSerializer
    permission_classes = [IsAdminUser]

# Specialty ViewSet
class AdminSpecialtyViewSet(viewsets.ModelViewSet):
    queryset = AdminSpecialty.objects.all()
    serializer_class = AdminSpecialtySerializer
    permission_classes = [IsAdminUser]

# System Alert ViewSet
class AdminSystemAlertViewSet(viewsets.ModelViewSet):
    queryset = AdminSystemAlert.objects.all()
    serializer_class = AdminSystemAlertSerializer
    permission_classes = [IsAdminUser]

# Notification ViewSet
class AdminNotificationViewSet(viewsets.ModelViewSet):
    queryset = AdminNotification.objects.all()
    serializer_class = AdminNotificationSerializer
    permission_classes = [IsAdminUser]

# Activity Log ViewSet
class AdminActivityLogViewSet(viewsets.ModelViewSet):
    queryset = AdminActivityLog.objects.all()
    serializer_class = AdminActivityLogSerializer
    permission_classes = [IsAdminUser]
