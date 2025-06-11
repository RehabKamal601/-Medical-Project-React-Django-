# patients/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from .models import Patient

User = get_user_model()

class PatientInline(admin.StackedInline):
    model = Patient
    can_delete = False
    verbose_name_plural = 'Patient Profile'
    fk_name = 'user'

class CustomUserAdmin(UserAdmin):
    inlines = (PatientInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_select_related = ('patient_profile',)

    def get_inline_instances(self, request, obj=None):
        if not obj or obj.role != 'patient':
            return []
        return super().get_inline_instances(request, obj)

# لا تقم بإلغاء تسجيل User إذا لم يكن مسجلاً مسبقاً
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass
admin.site.register(User, CustomUserAdmin)

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'age', 'gender')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'phone')
    list_filter = ('gender',)
    raw_id_fields = ('user',)