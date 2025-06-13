from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import TemplateView, ListView, CreateView, UpdateView, DetailView
from django.contrib import messages
from django.db.models import Q, Count
from django.utils import timezone
from django.http import JsonResponse
from .models import User, Appointment, MedicalRecord, Task, VitalSigns, Notification
from .forms import (CustomUserCreationForm, CustomAuthenticationForm, AppointmentForm, 
                   MedicalRecordForm, TaskForm, VitalSignsForm, UserUpdateForm)

class WelcomeView(TemplateView):
    template_name = 'healthcare/welcome.html'

class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm
    template_name = 'healthcare/login.html'
    
    def get_success_url(self):
        return '/dashboard/'

class RegisterView(CreateView):
    form_class = CustomUserCreationForm
    template_name = 'healthcare/register.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['role'] = self.kwargs.get('role')
        return context
    
    def form_valid(self, form):
        role = self.kwargs.get('role')
        if role in ['super_admin', 'doctor', 'nurse', 'patient']:
            form.instance.role = role
        response = super().form_valid(form)
        login(self.request, self.object)
        return response
    
    def get_success_url(self):
        return '/dashboard/'

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'healthcare/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # Common stats
        context['total_users'] = User.objects.count()
        context['total_appointments'] = Appointment.objects.count()
        context['pending_appointments'] = Appointment.objects.filter(status='pending').count()
        
        # Role-specific data
        if user.role == 'super_admin':
            context['recent_users'] = User.objects.order_by('-date_joined')[:5]
            context['system_stats'] = {
                'doctors': User.objects.filter(role='doctor').count(),
                'nurses': User.objects.filter(role='nurse').count(),
                'patients': User.objects.filter(role='patient').count(),
            }
        
        elif user.role == 'doctor':
            context['my_appointments'] = Appointment.objects.filter(doctor=user).order_by('-date')[:5]
            context['pending_approvals'] = Appointment.objects.filter(doctor=user, status='pending')
            context['my_patients'] = User.objects.filter(
                patient_appointments__doctor=user
            ).distinct()[:5]
        
        elif user.role == 'nurse':
            context['my_tasks'] = Task.objects.filter(assigned_to=user).order_by('-created_at')[:5]
            context['pending_tasks'] = Task.objects.filter(assigned_to=user, status='pending').count()
            context['today_tasks'] = Task.objects.filter(
                assigned_to=user, 
                due_date=timezone.now().date()
            ).count()
        
        elif user.role == 'patient':
            context['my_appointments'] = Appointment.objects.filter(patient=user).order_by('-date')[:5]
            context['my_records'] = MedicalRecord.objects.filter(patient=user).order_by('-date')[:3]
            context['upcoming_appointments'] = Appointment.objects.filter(
                patient=user, 
                status='approved',
                date__gte=timezone.now().date()
            ).count()
        
        # Notifications
        context['notifications'] = Notification.objects.filter(
            user=user, 
            is_read=False
        ).order_by('-created_at')[:5]
        
        return context

class AppointmentListView(LoginRequiredMixin, ListView):
    model = Appointment
    template_name = 'healthcare/appointments.html'
    context_object_name = 'appointments'
    paginate_by = 10
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.filter(patient=user).order_by('-date')
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user).order_by('-date')
        elif user.role in ['nurse', 'super_admin']:
            return Appointment.objects.all().order_by('-date')
        return Appointment.objects.none()

class AppointmentCreateView(LoginRequiredMixin, CreateView):
    model = Appointment
    form_class = AppointmentForm
    template_name = 'healthcare/appointment_form.html'
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs
    
    def form_valid(self, form):
        if self.request.user.role == 'patient':
            form.instance.patient = self.request.user
        messages.success(self.request, 'Appointment booked successfully!')
        return super().form_valid(form)
    
    def get_success_url(self):
        return '/appointments/'

class AppointmentUpdateView(LoginRequiredMixin, UpdateView):
    model = Appointment
    form_class = AppointmentForm
    template_name = 'healthcare/appointment_form.html'
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs
    
    def get_success_url(self):
        return '/appointments/'

@login_required
def approve_appointment(request, pk):
    appointment = get_object_or_404(Appointment, pk=pk)
    if request.user.role == 'doctor' and appointment.doctor == request.user:
        appointment.status = 'approved'
        appointment.save()
        
        # Create notification for patient
        Notification.objects.create(
            user=appointment.patient,
            title='Appointment Approved',
            message=f'Your appointment with Dr. {appointment.doctor.get_full_name()} has been approved.',
            type='success'
        )
        
        messages.success(request, 'Appointment approved successfully!')
    return redirect('appointments')

@login_required
def reject_appointment(request, pk):
    appointment = get_object_or_404(Appointment, pk=pk)
    if request.user.role == 'doctor' and appointment.doctor == request.user:
        appointment.status = 'rejected'
        appointment.save()
        
        # Create notification for patient
        Notification.objects.create(
            user=appointment.patient,
            title='Appointment Rejected',
            message=f'Your appointment with Dr. {appointment.doctor.get_full_name()} has been rejected.',
            type='warning'
        )
        
        messages.warning(request, 'Appointment rejected.')
    return redirect('appointments')

class MedicalRecordListView(LoginRequiredMixin, ListView):
    model = MedicalRecord
    template_name = 'healthcare/medical_records.html'
    context_object_name = 'records'
    paginate_by = 10
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return MedicalRecord.objects.filter(patient=user).order_by('-date')
        elif user.role == 'doctor':
            return MedicalRecord.objects.filter(doctor=user).order_by('-date')
        elif user.role in ['nurse', 'super_admin']:
            return MedicalRecord.objects.all().order_by('-date')
        return MedicalRecord.objects.none()

class MedicalRecordCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = MedicalRecord
    form_class = MedicalRecordForm
    template_name = 'healthcare/medical_record_form.html'
    
    def test_func(self):
        return self.request.user.role == 'doctor'
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs
    
    def form_valid(self, form):
        form.instance.doctor = self.request.user
        messages.success(self.request, 'Medical record created successfully!')
        return super().form_valid(form)
    
    def get_success_url(self):
        return '/medical-records/'

class MedicalRecordDetailView(LoginRequiredMixin, DetailView):
    model = MedicalRecord
    template_name = 'healthcare/medical_record_detail.html'
    context_object_name = 'record'

class TaskListView(LoginRequiredMixin, ListView):
    model = Task
    template_name = 'healthcare/tasks.html'
    context_object_name = 'tasks'
    paginate_by = 10
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['nurse', 'doctor']:
            return Task.objects.filter(assigned_to=user).order_by('-created_at')
        elif user.role == 'super_admin':
            return Task.objects.all().order_by('-created_at')
        return Task.objects.none()

class TaskCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Task
    form_class = TaskForm
    template_name = 'healthcare/task_form.html'
    
    def test_func(self):
        return self.request.user.role in ['doctor', 'nurse', 'super_admin']
    
    def form_valid(self, form):
        messages.success(self.request, 'Task created successfully!')
        return super().form_valid(form)
    
    def get_success_url(self):
        return '/tasks/'

class TaskUpdateView(LoginRequiredMixin, UpdateView):
    model = Task
    form_class = TaskForm
    template_name = 'healthcare/task_form.html'
    
    def get_success_url(self):
        return '/tasks/'

@login_required
def complete_task(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if task.assigned_to == request.user:
        task.status = 'completed'
        task.completed_at = timezone.now()
        task.save()
        messages.success(request, 'Task completed successfully!')
    return redirect('tasks')

class VitalSignsListView(LoginRequiredMixin, ListView):
    model = VitalSigns
    template_name = 'healthcare/vitals.html'
    context_object_name = 'vitals'
    paginate_by = 10
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return VitalSigns.objects.filter(patient=user).order_by('-recorded_at')
        elif user.role in ['nurse', 'doctor', 'super_admin']:
            return VitalSigns.objects.all().order_by('-recorded_at')
        return VitalSigns.objects.none()

class VitalSignsCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = VitalSigns
    form_class = VitalSignsForm
    template_name = 'healthcare/vitals_form.html'
    
    def test_func(self):
        return self.request.user.role in ['nurse', 'doctor']
    
    def form_valid(self, form):
        form.instance.recorded_by = self.request.user
        messages.success(self.request, 'Vital signs recorded successfully!')
        return super().form_valid(form)
    
    def get_success_url(self):
        return '/vitals/'

class UserListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = User
    template_name = 'healthcare/users.html'
    context_object_name = 'users'
    paginate_by = 20
    
    def test_func(self):
        return self.request.user.role == 'super_admin'

class UserDetailView(LoginRequiredMixin, UserPassesTestMixin, DetailView):
    model = User
    template_name = 'healthcare/user_detail.html'
    context_object_name = 'profile_user'
    
    def test_func(self):
        return self.request.user.role == 'super_admin'

class ProfileView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = UserUpdateForm
    template_name = 'healthcare/profile.html'
    
    def get_object(self):
        return self.request.user
    
    def get_success_url(self):
        return '/profile/'

class NotificationListView(LoginRequiredMixin, ListView):
    model = Notification
    template_name = 'healthcare/notifications.html'
    context_object_name = 'notifications'
    paginate_by = 20
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

@login_required
def mark_notification_read(request, pk):
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    notification.is_read = True
    notification.save()
    return redirect('notifications')