# patients/urls.py
from django.urls import path
from .views import (
    PatientListView,
    PatientCreateView,
    PatientDetailView,
    PatientUpdateView,
    PatientProfileView
)

urlpatterns = [
    path('', PatientListView.as_view(), name='patient-list'),
    path('create/', PatientCreateView.as_view(), name='patient-create'),
    path('<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
    path('<int:pk>/update/', PatientUpdateView.as_view(), name='patient-update'),
    path('profile/', PatientProfileView.as_view(), name='patient-profile'),
]