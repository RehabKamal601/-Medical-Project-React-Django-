from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from doctor.models import Doctor
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'login'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['login'] = serializers.CharField(required=True)
        self.fields.pop('username', None)  # Remove the username field

    def validate(self, attrs):
        # Get the login value (could be username or email)
        login = attrs.get('login')
        password = attrs.get('password')

        if not login or not password:
            raise serializers.ValidationError({
                'error': 'Both login and password are required.'
            })

        # Try to fetch user by username first, then by email
        user = User.objects.filter(username=login).first()
        if not user:
            user = User.objects.filter(email=login).first()

        if not user:
            raise serializers.ValidationError({
                'error': 'No account found with the provided login credentials.'
            })

        attrs['username'] = user.username  # Set username for parent class
        return super().validate(attrs)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError({
                'error': 'Both email and password are required.'
            })

        # Try to find the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'error': 'No account found with the provided email.'
            })

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError({
                'error': 'Invalid password.'
            })

        if not user.is_active:
            raise serializers.ValidationError({
                'error': 'This account is not active.'
            })

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        # Add custom claims
        if user.is_doctor:
            role = 'doctor'
        elif user.is_patient:
            role = 'patient'
        elif user.is_staff and user.is_superuser:
            role = 'admin'
        else:
            role = 'user'

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': role
            }
        }

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=['doctor', 'patient', 'admin'], required=True, write_only=True)
    
    # Optional fields for doctor profile
    specialization = serializers.CharField(required=False, write_only=True)
    phone = serializers.CharField(required=False, write_only=True)
    bio = serializers.CharField(required=False, write_only=True)
    address = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name',
            # Include these in fields but they're write_only
            'role', 'specialization', 'phone', 'bio', 'address'
        ]
        read_only_fields = ['is_doctor', 'is_patient', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'username': {
                'error_messages': {
                    'unique': 'This username is already taken. Please choose a different one.'
                }
            }
        }

    def validate_password(self, value):
        try:
            # This will run Django's password validators
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "The two password fields didn't match.",
                "password2": "The two password fields didn't match."
            })
        
        # Validate doctor fields if role is doctor
        if attrs['role'] == 'doctor':
            if not attrs.get('specialization'):
                raise serializers.ValidationError({
                    "specialization": "Specialization is required for doctors"
                })
            if not attrs.get('phone'):
                raise serializers.ValidationError({
                    "phone": "Phone number is required for doctors"
                })
        
        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role')
        validated_data.pop('password2')
        
        # Remove doctor-specific fields from validated_data
        doctor_data = {}
        for field in ['specialization', 'phone', 'bio', 'address']:
            if field in validated_data:
                doctor_data[field] = validated_data.pop(field)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Set role flags
        if role == 'doctor':
            user.is_doctor = True
            # Create doctor profile
            Doctor.objects.create(
                user=user,
                **doctor_data
            )
        elif role == 'patient':
            user.is_patient = True
        elif role == 'admin':
            user.is_staff = True
            user.is_superuser = True
        
        user.save()
        return user

    def to_representation(self, instance):
        """
        Override to_representation to customize the response after registration
        """
        data = super().to_representation(instance)
        # Add role information in response
        if instance.is_doctor:
            data['role'] = 'doctor'
        elif instance.is_patient:
            data['role'] = 'patient'
        elif instance.is_staff and instance.is_superuser:
            data['role'] = 'admin'
        return data
