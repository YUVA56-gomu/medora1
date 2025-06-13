from django.contrib import admin
from .models import Appointment, AppointmentSlot

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'date', 'time', 'status', 'appointment_type', 'created_at')
    list_filter = ('status', 'appointment_type', 'date', 'created_at')
    search_fields = ('patient__username', 'doctor__username', 'reason')
    date_hierarchy = 'date'

@admin.register(AppointmentSlot)
class AppointmentSlotAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'date', 'start_time', 'end_time', 'is_available')
    list_filter = ('is_available', 'date')
    search_fields = ('doctor__username',)