from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from accounts.models import User
from appointments.models import Appointment
from medical_records.models import MedicalRecord
from notifications.models import Notification
from .models import Task, SystemAlert

@login_required
def dashboard_index(request):
    user = request.user
    context = {
        'user': user,
        'current_date': timezone.now().date(),
    }

    if user.role == 'super_admin':
        return render(request, 'dashboard/super_admin.html', get_super_admin_context(user))
    elif user.role == 'doctor':
        return render(request, 'dashboard/doctor.html', get_doctor_context(user))
    elif user.role == 'nurse':
        return render(request, 'dashboard/nurse.html', get_nurse_context(user))
    elif user.role == 'patient':
        return render(request, 'dashboard/patient.html', get_patient_context(user))
    else:
        return redirect('accounts:login')

def get_super_admin_context(user):
    total_users = User.objects.count()
    total_doctors = User.objects.filter(role='doctor').count()
    total_nurses = User.objects.filter(role='nurse').count()
    total_patients = User.objects.filter(role='patient').count()
    total_appointments = Appointment.objects.count()
    pending_appointments = Appointment.objects.filter(status='pending').count()
    active_alerts = SystemAlert.objects.filter(is_active=True).count()

    recent_users = User.objects.order_by('-date_joined')[:5]
    recent_appointments = Appointment.objects.order_by('-created_at')[:5]
    system_alerts = SystemAlert.objects.filter(is_active=True)[:5]

    return {
        'user': user,
        'stats': {
            'total_users': total_users,
            'total_doctors': total_doctors,
            'total_nurses': total_nurses,
            'total_patients': total_patients,
            'total_appointments': total_appointments,
            'pending_appointments': pending_appointments,
            'active_alerts': active_alerts,
        },
        'recent_users': recent_users,
        'recent_appointments': recent_appointments,
        'system_alerts': system_alerts,
    }

def get_doctor_context(user):
    today = timezone.now().date()
    doctor_appointments = Appointment.objects.filter(doctor=user)
    todays_appointments = doctor_appointments.filter(date=today)
    pending_appointments = doctor_appointments.filter(status='pending')
    medical_records = MedicalRecord.objects.filter(doctor=user)

    return {
        'user': user,
        'stats': {
            'todays_appointments': todays_appointments.count(),
            'pending_appointments': pending_appointments.count(),
            'total_patients': doctor_appointments.values('patient').distinct().count(),
            'medical_records': medical_records.count(),
        },
        'todays_appointments': todays_appointments[:5],
        'pending_appointments': pending_appointments[:5],
        'recent_records': medical_records.order_by('-created_at')[:5],
    }

def get_nurse_context(user):
    today = timezone.now().date()
    nurse_tasks = Task.objects.filter(assigned_to=user)
    todays_tasks = nurse_tasks.filter(due_date=today)
    pending_tasks = nurse_tasks.filter(status='pending')
    completed_tasks = nurse_tasks.filter(status='completed')

    return {
        'user': user,
        'stats': {
            'todays_tasks': todays_tasks.count(),
            'pending_tasks': pending_tasks.count(),
            'completed_tasks': completed_tasks.count(),
            'patient_alerts': 3,  # Mock data
        },
        'todays_tasks': todays_tasks[:5],
        'pending_tasks': pending_tasks[:5],
        'recent_tasks': nurse_tasks.order_by('-created_at')[:5],
    }

def get_patient_context(user):
    patient_appointments = Appointment.objects.filter(patient=user)
    upcoming_appointments = patient_appointments.filter(
        date__gte=timezone.now().date(),
        status='approved'
    )
    medical_records = MedicalRecord.objects.filter(patient=user)
    pending_requests = patient_appointments.filter(status='pending')

    return {
        'user': user,
        'stats': {
            'upcoming_appointments': upcoming_appointments.count(),
            'medical_records': medical_records.count(),
            'pending_requests': pending_requests.count(),
            'health_score': '85%',  # Mock data
        },
        'upcoming_appointments': upcoming_appointments[:5],
        'recent_records': medical_records.order_by('-created_at')[:3],
        'pending_requests': pending_requests[:5],
    }

class DashboardView(LoginRequiredMixin, TemplateView):
    def get_template_names(self):
        role_templates = {
            'super_admin': 'dashboard/super_admin.html',
            'doctor': 'dashboard/doctor.html',
            'nurse': 'dashboard/nurse.html',
            'patient': 'dashboard/patient.html',
        }
        return [role_templates.get(self.request.user.role, 'dashboard/base.html')]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        if user.role == 'super_admin':
            context.update(get_super_admin_context(user))
        elif user.role == 'doctor':
            context.update(get_doctor_context(user))
        elif user.role == 'nurse':
            context.update(get_nurse_context(user))
        elif user.role == 'patient':
            context.update(get_patient_context(user))
            
        return context
    
from django.http import HttpResponse

def hello_view(request):
    return HttpResponse("Hello from the API!")