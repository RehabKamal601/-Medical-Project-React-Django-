# patients/admin.py
from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'age', 'gender')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'phone')
    list_filter = ('gender',)
    raw_id_fields = ('user',)