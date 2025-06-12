from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

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

from .permissions import IsRoleAdmin  

# Doctor ViewSet
class AdminDoctorViewSet(viewsets.ModelViewSet):
    queryset = AdminDoctor.objects.all()
    serializer_class = AdminDoctorSerializer
    permission_classes = [IsRoleAdmin]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        doctor = self.get_object()
        doctor.is_approved = True
        doctor.is_blocked = False
        doctor.save()
        return Response({'status': 'Doctor approved'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        doctor = self.get_object()
        doctor.is_blocked = True
        doctor.is_approved = False
        doctor.save()
        return Response({'status': 'Doctor blocked'}, status=status.HTTP_200_OK)

# Patient ViewSet
class AdminPatientViewSet(viewsets.ModelViewSet):
    queryset = AdminPatient.objects.all()
    serializer_class = AdminPatientSerializer
    permission_classes = [IsRoleAdmin]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        patient = self.get_object()
        patient.is_approved = True
        patient.is_blocked = False
        patient.save()
        return Response({'status': 'Patient approved'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        patient = self.get_object()
        patient.is_blocked = True
        patient.is_approved = False
        patient.save()
        return Response({'status': 'Patient blocked'}, status=status.HTTP_200_OK)

# Appointment ViewSet
class AdminAppointmentViewSet(viewsets.ModelViewSet):
    queryset = AdminAppointment.objects.all()
    serializer_class = AdminAppointmentSerializer
    permission_classes = [IsRoleAdmin]

# Specialty ViewSet
class AdminSpecialtyViewSet(viewsets.ModelViewSet):
    queryset = AdminSpecialty.objects.all()
    serializer_class = AdminSpecialtySerializer
    permission_classes = [IsRoleAdmin]

# System Alert ViewSet
class AdminSystemAlertViewSet(viewsets.ModelViewSet):
    queryset = AdminSystemAlert.objects.all()
    serializer_class = AdminSystemAlertSerializer
    permission_classes = [IsRoleAdmin]

# Notification ViewSet
class AdminNotificationViewSet(viewsets.ModelViewSet):
    queryset = AdminNotification.objects.all()
    serializer_class = AdminNotificationSerializer
    permission_classes = [IsRoleAdmin]

# Activity Log ViewSet
class AdminActivityLogViewSet(viewsets.ModelViewSet):
    queryset = AdminActivityLog.objects.all()
    serializer_class = AdminActivityLogSerializer
    permission_classes = [IsRoleAdmin]
