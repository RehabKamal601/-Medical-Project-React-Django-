# //models
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ValidationError



class Doctor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE )
    specialization = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='doctor_images/', blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)

    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    # specialization = models.CharField(max_length=100)
    # phone = models.CharField(max_length=20)
    # address = models.CharField(max_length=255, blank=True)
    # bio = models.TextField(blank=True)
    # image = models.ImageField(upload_to='doctor_images/', blank=True, null=True)


    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name}"
    


class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_of_birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    medical_history = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"


class DoctorAvailability(models.Model):
    DAYS_OF_WEEK = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]
    
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='availability')
    day = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ['doctor', 'day']
        ordering = ['day']

    def clean(self):
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError('End time must be after start time')

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)



class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='availability')
    day = models.CharField(max_length=10)  # e.g., Monday, Tuesday
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.doctor} - {self.day} {self.start_time}-{self.end_time}"


class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    patient_name = models.CharField(max_length=100)
    date = models.DateTimeField()
    status = models.CharField(max_length=10, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.patient} - {self.date} - {self.status}"
        return f"{self.patient_name} - {self.date} - {self.status}"
