# //models
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator

class Doctor(models.Model):
    SPECIALIZATION_CHOICES = [
        ('General', 'General'),
        ('Lungs Specialist', 'Lungs Specialist'),
        ('Dentist', 'Dentist'),
        ('Psychiatrist', 'Psychiatrist'),
        ('Covid-19', 'Covid-19'),
        ('Surgeon', 'Surgeon'),
        ('Cardiologist', 'Cardiologist'),
        # Add more specializations as needed
    ]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor')
    specialization = models.CharField(max_length=100, choices=SPECIALIZATION_CHOICES)
    phone = models.CharField(max_length=20)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='doctor_images/', blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)
    rating = models.DecimalField(
        max_digits=3,  # Total digits: 2 (e.g., 5.0, 4.5)
        decimal_places=1,  # One decimal place
        default=5.0,  # Default rating
        validators=[
            MinValueValidator(1.0),  # Minimum rating of 1
            MaxValueValidator(5.0)   # Maximum rating of 5
        ]
    )
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

    def __str__(self):
        return f"{self.doctor} - {self.day} {self.start_time}-{self.end_time}"

class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateTimeField()
    status = models.CharField(max_length=10, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.patient.user.get_full_name()} - {self.date} - {self.status}"