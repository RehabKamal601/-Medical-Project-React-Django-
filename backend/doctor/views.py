from rest_framework import viewsets
from .models import Doctor
from .serializers import DoctorSerializer
from rest_framework import generics
from .serializers import DoctorRegisterSerializer
from .models import Doctor

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer




class DoctorRegisterView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorRegisterSerializer
