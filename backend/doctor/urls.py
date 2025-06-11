from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet
from .views import (
    DoctorRegisterView, DoctorAvailabilityCreateView,
 AppointmentListView, AppointmentUpdateView , AppointmentCreateView , DoctorProfileUpdateView,
 DoctorListView, DoctorDetailView, DoctorAppointmentsView, PatientAppointmentsView, AppointmentCancelView, AppointmentRescheduleView
)

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)

urlpatterns = [
    path('', include(router.urls)),
     path('register/', DoctorRegisterView.as_view(), name='doctor-register'),
    path('availability/', DoctorAvailabilityCreateView.as_view(), name='doctor-availability'),
    path('appointments/', AppointmentListView.as_view(), name='appointment-list'),
    path('appointments/create/', AppointmentCreateView.as_view(), name='appointment-create'),

    path('appointments/<int:pk>/update/', AppointmentUpdateView.as_view(), name='appointment-update'),
    path('profile/update/', DoctorProfileUpdateView.as_view(), name='doctor-profile-update'),



]

urlpatterns += [
    path('list/', DoctorListView.as_view(), name='doctor-list'),
    path('detail/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('doctor/<int:doctor_id>/appointments/', DoctorAppointmentsView.as_view(), name='doctor-appointments'),
    path('patient/appointments/', PatientAppointmentsView.as_view(), name='patient-appointments'),
    path('appointments/<int:pk>/cancel/', AppointmentCancelView.as_view(), name='appointment-cancel'),
    path('appointments/<int:pk>/reschedule/', AppointmentRescheduleView.as_view(), name='appointment-reschedule'),
]
