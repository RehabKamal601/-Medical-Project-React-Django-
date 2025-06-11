from django.db import models

# Specialties
class AdminSpecialty(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# Doctors
class AdminDoctor(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    specialty = models.ForeignKey(AdminSpecialty, on_delete=models.SET_NULL, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# Patients
class AdminPatient(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# Appointments
class AdminAppointment(models.Model):
    doctor = models.ForeignKey(AdminDoctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(AdminPatient, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.patient.name} with {self.doctor.name} on {self.date}"

# System Alerts
class AdminSystemAlert(models.Model):
    title = models.CharField(max_length=100)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

# Notifications
class AdminNotification(models.Model):
    recipient_email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"To: {self.recipient_email}"

# Admin Activity Logs
class AdminActivityLog(models.Model):
    action = models.CharField(max_length=255)
    performed_by = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.action} by {self.performed_by}"
