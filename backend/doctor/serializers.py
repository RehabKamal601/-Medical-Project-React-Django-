# # //serializers
# from rest_framework import serializers
# from django.contrib.auth import get_user_model
# from .models import Doctor, DoctorAvailability, Appointment

# User = get_user_model()


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name']
#         read_only_fields = ['id']  # Only id should be read-only


# class DoctorSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#     full_name = serializers.SerializerMethodField()

#     class Meta:
#         model = Doctor
#         fields = ['id', 'user', 'full_name', 'specialization', 'phone', 'bio', 'image', 'address']

#     def get_full_name(self, obj):
#         return f"Dr. {obj.user.first_name} {obj.user.last_name}".strip()

#     def update(self, instance, validated_data):
#         # Handle nested user data
#         if 'user' in validated_data:
#             user_data = validated_data.pop('user')
#             user = instance.user
#             for attr, value in user_data.items():
#                 setattr(user, attr, value)
#             user.save()

#         # Update Doctor model fields
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         return instance


# class DoctorRegisterSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = Doctor
#         fields = ['id', 'user', 'password', 'specialization', 'phone', 'bio', 'address']

#     def create(self, validated_data):
#         user_data = validated_data.pop('user')
#         password = validated_data.pop('password')
        
#         # Create the user
#         user = User.objects.create(
#             username=user_data['username'],
#             email=user_data.get('email', ''),
#             first_name=user_data.get('first_name', ''),
#             last_name=user_data.get('last_name', ''),
#             role='doctor'
#         )
#         user.set_password(password)
#         user.save()

#         # Create the doctor profile
#         doctor = Doctor.objects.create(
#             user=user,
#             **validated_data
#         )
#         return doctor

# class DoctorAvailabilitySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DoctorAvailability
#         fields = ['id', 'doctor', 'day', 'start_time', 'end_time']

# class AppointmentSerializer(serializers.ModelSerializer):
#     patient_name = serializers.SerializerMethodField()
#     patient_id = serializers.SerializerMethodField()
#     doctor_name = serializers.SerializerMethodField()
#     time = serializers.SerializerMethodField()

#     class Meta:
#         model = Appointment
#         fields = ['id', 'doctor', 'doctor_name', 'patient', 'patient_name', 'patient_id', 'date', 'time', 'status', 'notes']
#         read_only_fields = ['doctor_name', 'patient_name', 'patient_id', 'time']

#     def get_patient_name(self, obj):
#         return obj.patient.user.get_full_name() if obj.patient and obj.patient.user else ''

#     def get_patient_id(self, obj):
#         return obj.patient.id if obj.patient else None

#     def get_doctor_name(self, obj):
#         return str(obj.doctor) if obj.doctor else ''
        
#     def get_time(self, obj):
#         return obj.date.strftime('%H:%M') if obj.date else ''



from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, DoctorAvailability, Appointment
from django.core.exceptions import ValidationError
import json

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']
        extra_kwargs = {
            'username': {
                'validators': []  # Remove the UniqueValidator
            }
        }

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'full_name', 'specialization', 'phone', 'bio', 'image', 'address', 'rating']

    def get_full_name(self, obj):
        first_name = obj.user.first_name.strip() if obj.user.first_name else ''
        last_name = obj.user.last_name.strip() if obj.user.last_name else ''
        if first_name or last_name:
            return f"Dr. {first_name} {last_name}".strip()
        return f"Dr. {obj.user.username}"

    def validate(self, data):
        user_data = data.get('user')
        if user_data and 'username' in user_data:
            new_username = user_data['username']
            # Get the current user instance
            instance = getattr(self, 'instance', None)
            if instance:
                current_user = instance.user
                # Only check uniqueness if username is changing
                if new_username != current_user.username:
                    if User.objects.exclude(pk=current_user.pk).filter(username=new_username).exists():
                        raise serializers.ValidationError({
                            'user': {'username': ['This username is already taken.']}
                        })
        return data

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            
            # Update user fields
            for field in ['username', 'email', 'first_name', 'last_name']:
                if field in user_data:
                    value = user_data.get(field)
                    if value is not None:  # Allow empty strings but not None
                        setattr(user, field, value)
            
            try:
                user.save()
            except Exception as e:
                raise serializers.ValidationError({'user': str(e)})

        # Update Doctor model fields
        for attr, value in validated_data.items():
            if value is not None:  # Allow empty strings but not None
                setattr(instance, attr, value)
        
        try:
            instance.save()
        except Exception as e:
            raise serializers.ValidationError(str(e))

        # Refresh from database
        instance.refresh_from_db()
        instance.user.refresh_from_db()
        
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['full_name'] = self.get_full_name(instance)
        return representation

class DoctorRegisterSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'password', 'specialization', 'phone', 'bio', 'address', 'rating']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password')
        
        user = User.objects.create(
            username=user_data['username'],
            email=user_data.get('email', ''),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            role='doctor'
        )
        user.set_password(password)
        user.save()

        doctor = Doctor.objects.create(
            user=user,
            **validated_data
        )
        return doctor

class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = ['id', 'doctor', 'day', 'start_time', 'end_time']

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_id = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'doctor_name', 'patient', 'patient_name', 
                 'patient_id', 'date', 'time', 'status', 'notes']
        read_only_fields = ['doctor_name', 'patient_name', 'patient_id', 'time']

    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name() if obj.patient and obj.patient.user else ''

    def get_patient_id(self, obj):
        return obj.patient.id if obj.patient else None

    def get_doctor_name(self, obj):
        return str(obj.doctor) if obj.doctor else ''
        
    def get_time(self, obj):
        return obj.date.strftime('%H:%M') if obj.date else ''