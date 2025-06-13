from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Welcome and Authentication
    path('', views.WelcomeView.as_view(), name='welcome'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/<str:role>/', views.RegisterView.as_view(), name='register'),
    
    # Dashboard
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    
    # Appointments
    path('appointments/', views.AppointmentListView.as_view(), name='appointments'),
    path('appointments/create/', views.AppointmentCreateView.as_view(), name='appointment_create'),
    path('appointments/<int:pk>/update/', views.AppointmentUpdateView.as_view(), name='appointment_update'),
    path('appointments/<int:pk>/approve/', views.approve_appointment, name='appointment_approve'),
    path('appointments/<int:pk>/reject/', views.reject_appointment, name='appointment_reject'),
    
    # Medical Records
    path('medical-records/', views.MedicalRecordListView.as_view(), name='medical_records'),
    path('medical-records/create/', views.MedicalRecordCreateView.as_view(), name='medical_record_create'),
    path('medical-records/<int:pk>/', views.MedicalRecordDetailView.as_view(), name='medical_record_detail'),
    
    # Tasks
    path('tasks/', views.TaskListView.as_view(), name='tasks'),
    path('tasks/create/', views.TaskCreateView.as_view(), name='task_create'),
    path('tasks/<int:pk>/update/', views.TaskUpdateView.as_view(), name='task_update'),
    path('tasks/<int:pk>/complete/', views.complete_task, name='task_complete'),
    
    # Vital Signs
    path('vitals/', views.VitalSignsListView.as_view(), name='vitals'),
    path('vitals/create/', views.VitalSignsCreateView.as_view(), name='vitals_create'),
    
    # Users (Admin only)
    path('users/', views.UserListView.as_view(), name='users'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
    
    # Profile
    path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:pk>/mark-read/', views.mark_notification_read, name='notification_mark_read'),
]