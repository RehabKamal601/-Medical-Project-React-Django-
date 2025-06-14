from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet
from .views import (
    DoctorRegisterView, 
    DoctorAvailabilityCreateView,
    AppointmentListView, 
    AppointmentCreateView,
    AppointmentUpdateView,
    DoctorProfileUpdateView, 
    DoctorDashboardStats, 
    DoctorPatientsListView,
    DoctorAvailabilityListView,
    AppointmentViewSet,
    Generics_list, 
    Generics_id, 
    Appointments_list, 
    Appointment_id, 
    Reservations_list,
    ReserveAppointmentView
)


router = DefaultRouter()
router.register('doctors', DoctorViewSet)
appointment_create = AppointmentViewSet.as_view({'post': 'create'})


urlpatterns = [
    path('', include(router.urls)),
    path('register/', DoctorRegisterView.as_view(), name='doctor-register'),
    path('availability/', DoctorAvailabilityCreateView.as_view(), name='doctor-availability'),
    path('appointments/', AppointmentListView.as_view(), name='appointment-list'),
    path('appointments/create/', AppointmentCreateView.as_view(), name='appointment-create'),

    path('appointments/<int:pk>/update/', AppointmentUpdateView.as_view(), name='appointment-update'),
    path('profile/update/', DoctorProfileUpdateView.as_view(), name='doctor-profile-update'),
    path('dashboard/stats/', DoctorDashboardStats.as_view(), name='doctor-dashboard-stats'),
    path('patients/', DoctorPatientsListView.as_view(), name='doctor-patients-list'),


    # this for patient component from abelhameed mohamed
    #6.1 Generic Class Based View get, post
    path('all-doctors/', Generics_list.as_view()),

    #6.2 Generic Class Based View get, put, delete
    path('one-doctor/<int:id>', Generics_id.as_view()),

    # this for patient component from abelhameed mohamed
    #6.1 Generic Class Based View get, post
    path('all-appointments/', Appointments_list.as_view()),

    #6.2 Generic Class Based View get, put, delete
    path('one-appointment/<int:id>', Appointment_id.as_view()),

    # reserve appointment
    # path('reserve-appointment/', appointment_create, name='reserve-appointment'),
    #last try 
    path('reserve-appointment/', ReserveAppointmentView.as_view(), name='reserve-appointment'),


    path('all-reservations/', Reservations_list.as_view()),

    # #6.2 Generic Class Based View get, put, delete
    # path('<int:id>/availability', Reservation_id.as_view()),


    # # by using views 
    # path('doctors/<int:id>/availability', DoctorAvailabilityListView.as_view(), name='availability'),

    path('<int:id>/availability/', DoctorAvailabilityListView.as_view(), name='doctor-availability-by-id'),

]


