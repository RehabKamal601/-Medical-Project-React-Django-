from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty = models.CharField(max_length=100)
    is_approved = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - Doctor"

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - Patient"