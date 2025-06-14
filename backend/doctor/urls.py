from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet
from .views import (
    DoctorRegisterView, DoctorAvailabilityCreateView,
    AppointmentListView, AppointmentUpdateView, AppointmentCreateView,
    DoctorProfileUpdateView, DoctorDashboardStats, DoctorPatientsListView
 , AppointmentUpdateView , AppointmentCreateView , DoctorProfileUpdateView
)
from .views import (Generics_list, Generics_id)
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
    path('dashboard/stats/', DoctorDashboardStats.as_view(), name='doctor-dashboard-stats'),
    path('patients/', DoctorPatientsListView.as_view(), name='doctor-patients-list'),


    # this for patient component from abelhameed mohamed
    #6.1 Generic Class Based View get, post
    path('all-doctors/', Generics_list.as_view()),

    #6.2 Generic Class Based View get, put, delete
    path('one-doctor/<int:id>', Generics_id.as_view()),

    path('doctors/<int:pk>/approve/', DoctorViewSet.as_view({'post': 'approve'}), name='doctor-approve'),
    path('doctors/<int:pk>/block/', DoctorViewSet.as_view({'post': 'block'}), name='doctor-block'),
    path('doctors/<int:pk>/unblock/', DoctorViewSet.as_view({'post': 'unblock'}), name='doctor-unblock'),



]


