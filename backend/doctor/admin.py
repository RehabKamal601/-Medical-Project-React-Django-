from django.contrib import admin
from .models import Doctor, DoctorAvailability, Appointment
# Register your models here.

admin.site.register(DoctorAvailability)
admin.site.register(Appointment)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'is_approved', 'is_blocked')
    list_filter = ('is_approved', 'is_blocked', 'specialization')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'specialization')
    raw_id_fields = ('user',)

admin.site.register(Doctor, DoctorAdmin)
