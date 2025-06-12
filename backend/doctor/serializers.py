# //serializers
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Doctor, DoctorAvailability, Appointment


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'username']  # Don't allow changing username

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class DoctorRegisterSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Doctor
        fields = ['user', 'specialization', 'phone', 'bio', 'image', 'address']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor

    def update(self, instance, validated_data):
        # Update User model
        if 'user' in validated_data:
            user_data = validated_data.pop('user')
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        # Update Doctor model
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = ['id', 'doctor', 'day', 'start_time', 'end_time']
        read_only_fields = ['id']
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
