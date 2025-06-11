# accounts/views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import CustomUser
from .serializers import RegisterSerializer, EmailTokenObtainPairSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        role = request.data.get('role', 'patient')

        if not username or not password:
            return Response({"detail": "اسم المستخدم وكلمة المرور مطلوبان."}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"detail": "اسم المستخدم موجود بالفعل."}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email, role=role)
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
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
