from django.contrib import admin
from .models import Task, SystemAlert

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'patient', 'priority', 'status', 'due_date', 'created_at')
    list_filter = ('priority', 'status', 'due_date', 'created_at')
    search_fields = ('title', 'description', 'assigned_to__username', 'patient__username')
    date_hierarchy = 'created_at'

@admin.register(SystemAlert)
class SystemAlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'alert_type', 'is_active', 'created_at')
    list_filter = ('alert_type', 'is_active', 'created_at')
    search_fields = ('title', 'message')