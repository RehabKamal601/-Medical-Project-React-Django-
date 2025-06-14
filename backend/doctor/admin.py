from django.contrib import admin
from .models import Doctor, DoctorAvailability, Appointment
# Register your models here.

admin.site.register(Doctor)
admin.site.register(DoctorAvailability)
admin.site.register(Appointment)
