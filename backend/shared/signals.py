from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import DoctorProfile, PatientProfile

User = get_user_model()

@receiver(post_save, sender=DoctorProfile)
def handle_doctor_status_change(sender, instance, **kwargs):
    """
    Automatically updates user status when doctor profile changes
    """
    if hasattr(instance, 'user'):
        user = instance.user
        if instance.is_blocked or not instance.is_approved:
            user.is_active = False
        else:
            user.is_active = True
        user.save()

@receiver(post_save, sender=PatientProfile)
def handle_patient_status_change(sender, instance, **kwargs):
    """
    Automatically updates user status when patient profile changes
    """
    if hasattr(instance, 'user'):
        user = instance.user
        if instance.is_blocked or not instance.is_approved:
            user.is_active = False
        else:
            user.is_active = True
        user.save()

@receiver(pre_save, sender=User)
def prevent_blocked_user_login(sender, instance, **kwargs):
    """
    Prevents users from logging in if they're blocked in either profile
    """
    if instance.pk:  # Only for existing users
        original_user = User.objects.get(pk=instance.pk)
        if not original_user.is_active and instance.is_active:
            # Check if user is blocked in either profile
            if hasattr(instance, 'doctor_profile'):
                if instance.doctor_profile.is_blocked:
                    instance.is_active = False
            if hasattr(instance, 'patient_profile'):
                if instance.patient_profile.is_blocked:
                    instance.is_active = False