from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminDoctorViewSet,
    AdminPatientViewSet,
    AdminAppointmentViewSet,
    AdminSpecialtyViewSet,
    AdminSystemAlertViewSet,
    AdminNotificationViewSet,
    AdminActivityLogViewSet,
)

router = DefaultRouter()

router.register(r'doctors', AdminDoctorViewSet, basename='admin-doctor')
router.register(r'patients', AdminPatientViewSet, basename='admin-patient')
router.register(r'appointments', AdminAppointmentViewSet, basename='admin-appointment')
router.register(r'specialties', AdminSpecialtyViewSet, basename='admin-specialty')
router.register(r'system-alerts', AdminSystemAlertViewSet, basename='admin-system-alert')
router.register(r'notifications', AdminNotificationViewSet, basename='admin-notification')
router.register(r'activity-logs', AdminActivityLogViewSet, basename='admin-activity-log')

urlpatterns = [
    path('', include(router.urls)),
]
