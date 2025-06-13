from django.contrib import admin
from .models import Doctor,Patient, DoctorAvailability, Appointment
# Register your models here.

admin.site.register(Doctor)
admin.site.register(DoctorAvailability)
admin.site.register(Appointment)
