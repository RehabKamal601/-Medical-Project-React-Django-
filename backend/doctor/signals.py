from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Doctor

User = get_user_model()

@receiver(post_save, sender=User)
def create_doctor_profile(sender, instance, created, **kwargs):
    """
    Signal handler to create a Doctor profile when a new User is created.
    Only creates the profile if it doesn't already exist and the user's role is 'doctor'.
    """
    if created and instance.role == 'doctor' and not hasattr(instance, 'doctor'):
        Doctor.objects.create(user=instance, specialization='', phone='', bio='', address='')

@receiver(post_save, sender=User)
def save_doctor_profile(sender, instance, **kwargs):
    """
    Signal handler to save the Doctor profile whenever the User is saved.
    """
    if hasattr(instance, 'doctor'):
        instance.doctor.save()