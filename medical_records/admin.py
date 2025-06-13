from django.contrib import admin
from .models import MedicalRecord, Prescription, VitalSigns

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'diagnosis', 'visit_date', 'created_at')
    list_filter = ('visit_date', 'created_at', 'doctor')
    search_fields = ('patient__username', 'doctor__username', 'diagnosis')
    date_hierarchy = 'visit_date'

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('medication_name', 'dosage', 'frequency', 'duration')
    search_fields = ('medication_name',)

@admin.register(VitalSigns)
class VitalSignsAdmin(admin.ModelAdmin):
    list_display = ('patient', 'blood_pressure', 'heart_rate', 'temperature', 'recorded_at')
    list_filter = ('recorded_at',)
    search_fields = ('patient__username',)