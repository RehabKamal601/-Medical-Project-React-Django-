# patients/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Patient
from .serializers import (
    PatientSerializer, 
    PatientCreateUpdateSerializer,
    UserSerializer
)

User = get_user_model()

class PatientListView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]

class PatientCreateView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientCreateUpdateSerializer
    permission_classes = [permissions.AllowAny]

class PatientDetailView(generics.RetrieveAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if self.request.user.role == 'patient':
            return self.request.user.patient_profile
        return super().get_object()

class PatientUpdateView(generics.UpdateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if self.request.user.role == 'patient':
            return self.request.user.patient_profile
        return super().get_object()

class PatientProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response(
                {"detail": "Only patients can access this endpoint."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        patient = request.user.patient_profile
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    def patch(self, request):
        if request.user.role != 'patient':
            return Response(
                {"detail": "Only patients can access this endpoint."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        patient = request.user.patient_profile
        serializer = PatientCreateUpdateSerializer(
            patient, 
            data=request.data, 
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)