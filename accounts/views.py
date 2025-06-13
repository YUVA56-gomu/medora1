from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.views import LoginView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, UpdateView
from django.contrib import messages
from django.urls import reverse_lazy
from .models import User, DoctorProfile, NurseProfile, PatientProfile
from .forms import CustomUserCreationForm, UserProfileForm

class CustomLoginView(LoginView):
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy('dashboard:index')

class RoleBasedLoginView(LoginView):
    template_name = 'accounts/role_login.html'
    redirect_authenticated_user = True

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['role'] = self.kwargs.get('role')
        context['role_display'] = dict(User.ROLE_CHOICES).get(self.kwargs.get('role'), 'User')
        
        # Demo credentials
        demo_users = {
            'super_admin': {'email': 'admin@medora.com', 'password': 'demo123'},
            'doctor': {'email': 'doctor@medora.com', 'password': 'demo123'},
            'nurse': {'email': 'nurse@medora.com', 'password': 'demo123'},
            'patient': {'email': 'patient@medora.com', 'password': 'demo123'},
        }
        context['demo_credentials'] = demo_users.get(self.kwargs.get('role'), {})
        return context

    def form_valid(self, form):
        role = self.kwargs.get('role')
        user = form.get_user()
        
        if user.role != role:
            messages.error(self.request, f'Invalid credentials for {role} role.')
            return self.form_invalid(form)
        
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('dashboard:index')

class RegisterView(CreateView):
    model = User
    form_class = CustomUserCreationForm
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('accounts:login')

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Account created successfully!')
        return response

class ProfileView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = UserProfileForm
    template_name = 'accounts/profile.html'
    success_url = reverse_lazy('accounts:profile')

    def get_object(self):
        return self.request.user

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Profile updated successfully!')
        return response