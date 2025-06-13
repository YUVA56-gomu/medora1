from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Appointment, MedicalRecord, Notification, Task, VitalSigns

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'avatar', 'phone', 'address', 'date_of_birth')
        }),
    )

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'date', 'time', 'status', 'type')
    list_filter = ('status', 'date', 'type')
    search_fields = ('patient__username', 'doctor__username', 'type')
    date_hierarchy = 'date'

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'diagnosis', 'date')
    list_filter = ('date', 'doctor')
    search_fields = ('patient__username', 'doctor__username', 'diagnosis')
    date_hierarchy = 'date'

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('user__username', 'title', 'message')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'patient', 'priority', 'status', 'due_date')
    list_filter = ('priority', 'status', 'due_date')
    search_fields = ('title', 'assigned_to__username', 'patient__username')

@admin.register(VitalSigns)
class VitalSignsAdmin(admin.ModelAdmin):
    list_display = ('patient', 'blood_pressure', 'heart_rate', 'temperature', 'recorded_at')
    list_filter = ('recorded_at', 'recorded_by')
    search_fields = ('patient__username', 'recorded_by__username')
    date_hierarchy = 'recorded_at'