# accounts/views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import CustomUser
from .serializers import RegisterSerializer, EmailTokenObtainPairSerializer, CustomTokenObtainPairSerializer, UserSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
            
        user = serializer.save()
            
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "specialization": user.specialization if user.role == 'doctor' else None
        }, status=201)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = EmailTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            # Return role in the response for frontend routing
            return Response({
                'refresh': data.get('refresh'),
                'access': data.get('access'),
                'role': data.get('role'),
            }, status=200)
        return Response(serializer.errors, status=400)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)