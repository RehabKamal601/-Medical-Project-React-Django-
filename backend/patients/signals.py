from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Patient

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_patient_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'patient':
        Patient.objects.create(user=instance)
