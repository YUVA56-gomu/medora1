#!/usr/bin/env python
"""
Setup script to create demo data for MEDORA Healthcare Management System
Run this after migrations: python setup_demo_data.py
"""

import os
import sys
import django
from datetime import date, timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medora_healthcare.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import DoctorProfile, NurseProfile, PatientProfile
from appointments.models import Appointment
from medical_records.models import MedicalRecord, VitalSigns
from notifications.models import Notification
from dashboard.models import Task, SystemAlert

User = get_user_model()

def create_demo_users():
    """Create demo users for each role"""
    print("Creating demo users...")
    
    # Super Admin
    admin, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@medora.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'super_admin',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin.set_password('demo123')
        admin.save()
        print(f"✓ Created Super Admin: {admin.email}")

    # Doctor
    doctor, created = User.objects.get_or_create(
        username='doctor',
        defaults={
            'email': 'doctor@medora.com',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'role': 'doctor',
        }
    )
    if created:
        doctor.set_password('demo123')
        doctor.save()
        # Create doctor profile
        DoctorProfile.objects.get_or_create(
            user=doctor,
            defaults={
                'specialization': 'General Medicine',
                'license_number': 'MD12345',
                'years_of_experience': 10,
                'consultation_fee': 150.00,
            }
        )
        print(f"✓ Created Doctor: {doctor.email}")

    # Nurse
    nurse, created = User.objects.get_or_create(
        username='nurse',
        defaults={
            'email': 'nurse@medora.com',
            'first_name': 'Mary',
            'last_name': 'Smith',
            'role': 'nurse',
        }
    )
    if created:
        nurse.set_password('demo123')
        nurse.save()
        # Create nurse profile
        NurseProfile.objects.get_or_create(
            user=nurse,
            defaults={
                'department': 'General Ward',
                'shift': 'morning',
                'license_number': 'RN67890',
            }
        )
        print(f"✓ Created Nurse: {nurse.email}")

    # Patient
    patient, created = User.objects.get_or_create(
        username='patient',
        defaults={
            'email': 'patient@medora.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'patient',
        }
    )
    if created:
        patient.set_password('demo123')
        patient.save()
        # Create patient profile
        PatientProfile.objects.get_or_create(
            user=patient,
            defaults={
                'emergency_contact_name': 'Jane Doe',
                'emergency_contact_phone': '+1234567890',
                'blood_group': 'O+',
                'allergies': 'Penicillin, Shellfish',
                'medical_history': 'Hypertension, Diabetes Type 2',
            }
        )
        print(f"✓ Created Patient: {patient.email}")

    return admin, doctor, nurse, patient

def create_demo_appointments(doctor, patient):
    """Create demo appointments"""
    print("Creating demo appointments...")
    
    appointments_data = [
        {
            'patient': patient,
            'doctor': doctor,
            'date': date.today() + timedelta(days=1),
            'time': '10:00',
            'status': 'pending',
            'appointment_type': 'General Consultation',
            'reason': 'Regular checkup and blood pressure monitoring',
        },
        {
            'patient': patient,
            'doctor': doctor,
            'date': date.today() + timedelta(days=7),
            'time': '14:30',
            'status': 'approved',
            'appointment_type': 'Follow-up',
            'reason': 'Follow-up for diabetes management',
        },
        {
            'patient': patient,
            'doctor': doctor,
            'date': date.today() - timedelta(days=30),
            'time': '09:00',
            'status': 'completed',
            'appointment_type': 'Consultation',
            'reason': 'Initial consultation for hypertension',
        },
    ]

    for apt_data in appointments_data:
        appointment, created = Appointment.objects.get_or_create(
            patient=apt_data['patient'],
            doctor=apt_data['doctor'],
            date=apt_data['date'],
            time=apt_data['time'],
            defaults=apt_data
        )
        if created:
            print(f"✓ Created appointment: {appointment}")

def create_demo_medical_records(doctor, patient):
    """Create demo medical records"""
    print("Creating demo medical records...")
    
    records_data = [
        {
            'patient': patient,
            'doctor': doctor,
            'diagnosis': 'Hypertension',
            'symptoms': 'High blood pressure, headaches, dizziness',
            'treatment': 'Lifestyle modifications, regular exercise, low sodium diet',
            'prescription': 'Lisinopril 10mg daily, monitor blood pressure weekly',
            'visit_date': date.today() - timedelta(days=30),
            'notes': 'Patient responding well to treatment. Continue current medication.',
        },
        {
            'patient': patient,
            'doctor': doctor,
            'diagnosis': 'Type 2 Diabetes',
            'symptoms': 'Increased thirst, frequent urination, fatigue',
            'treatment': 'Dietary changes, blood glucose monitoring, medication',
            'prescription': 'Metformin 500mg twice daily, blood glucose test strips',
            'visit_date': date.today() - timedelta(days=60),
            'notes': 'HbA1c levels improving. Continue current treatment plan.',
        },
    ]

    for record_data in records_data:
        record, created = MedicalRecord.objects.get_or_create(
            patient=record_data['patient'],
            doctor=record_data['doctor'],
            visit_date=record_data['visit_date'],
            defaults=record_data
        )
        if created:
            print(f"✓ Created medical record: {record}")

def create_demo_vitals(nurse, patient):
    """Create demo vital signs"""
    print("Creating demo vital signs...")
    
    vitals_data = [
        {
            'patient': patient,
            'recorded_by': nurse,
            'blood_pressure_systolic': 120,
            'blood_pressure_diastolic': 80,
            'heart_rate': 72,
            'temperature': 98.6,
            'oxygen_saturation': 98,
            'weight': 165.5,
            'height': 70.0,
        },
        {
            'patient': patient,
            'recorded_by': nurse,
            'blood_pressure_systolic': 125,
            'blood_pressure_diastolic': 82,
            'heart_rate': 75,
            'temperature': 98.4,
            'oxygen_saturation': 97,
            'weight': 164.8,
        },
    ]

    for vital_data in vitals_data:
        vital, created = VitalSigns.objects.get_or_create(
            patient=vital_data['patient'],
            recorded_by=vital_data['recorded_by'],
            defaults=vital_data
        )
        if created:
            print(f"✓ Created vital signs: {vital}")

def create_demo_tasks(nurse, patient):
    """Create demo tasks for nurses"""
    print("Creating demo tasks...")
    
    tasks_data = [
        {
            'title': 'Check vitals for Room 201',
            'description': 'Monitor blood pressure and heart rate for John Doe',
            'assigned_to': nurse,
            'patient': patient,
            'priority': 'high',
            'status': 'pending',
            'due_date': date.today(),
        },
        {
            'title': 'Administer medication',
            'description': 'Give prescribed medication to patient in Room 201',
            'assigned_to': nurse,
            'patient': patient,
            'priority': 'medium',
            'status': 'completed',
            'due_date': date.today() - timedelta(days=1),
        },
        {
            'title': 'Patient assessment',
            'description': 'Complete daily patient assessment and update charts',
            'assigned_to': nurse,
            'priority': 'medium',
            'status': 'in_progress',
            'due_date': date.today(),
        },
    ]

    for task_data in tasks_data:
        task, created = Task.objects.get_or_create(
            title=task_data['title'],
            assigned_to=task_data['assigned_to'],
            defaults=task_data
        )
        if created:
            print(f"✓ Created task: {task}")

def create_demo_notifications(users):
    """Create demo notifications"""
    print("Creating demo notifications...")
    
    admin, doctor, nurse, patient = users
    
    notifications_data = [
        {
            'recipient': doctor,
            'title': 'New Appointment Request',
            'message': 'John Doe has requested an appointment for tomorrow at 10:00 AM',
            'notification_type': 'appointment',
        },
        {
            'recipient': nurse,
            'title': 'Task Reminder',
            'message': 'You have 2 pending tasks due today',
            'notification_type': 'task',
        },
        {
            'recipient': patient,
            'title': 'Appointment Confirmed',
            'message': 'Your appointment with Dr. Sarah Johnson has been confirmed for tomorrow',
            'notification_type': 'appointment',
        },
        {
            'recipient': admin,
            'title': 'System Update',
            'message': 'System backup completed successfully',
            'notification_type': 'info',
        },
    ]

    for notif_data in notifications_data:
        notification, created = Notification.objects.get_or_create(
            recipient=notif_data['recipient'],
            title=notif_data['title'],
            defaults=notif_data
        )
        if created:
            print(f"✓ Created notification: {notification}")

def create_demo_alerts():
    """Create demo system alerts"""
    print("Creating demo system alerts...")
    
    alerts_data = [
        {
            'title': 'Database Backup Completed',
            'message': 'Daily database backup completed successfully at 2:00 AM',
            'alert_type': 'success',
        },
        {
            'title': 'High Server Load',
            'message': 'Server CPU usage is above 80%. Consider scaling resources.',
            'alert_type': 'warning',
        },
        {
            'title': 'Security Update Available',
            'message': 'A new security update is available for the system.',
            'alert_type': 'info',
        },
    ]

    for alert_data in alerts_data:
        alert, created = SystemAlert.objects.get_or_create(
            title=alert_data['title'],
            defaults=alert_data
        )
        if created:
            print(f"✓ Created system alert: {alert}")

def main():
    """Main function to create all demo data"""
    print("🏥 Setting up MEDORA Healthcare Demo Data...")
    print("=" * 50)
    
    try:
        # Create users
        users = create_demo_users()
        admin, doctor, nurse, patient = users
        
        # Create appointments
        create_demo_appointments(doctor, patient)
        
        # Create medical records
        create_demo_medical_records(doctor, patient)
        
        # Create vital signs
        create_demo_vitals(nurse, patient)
        
        # Create tasks
        create_demo_tasks(nurse, patient)
        
        # Create notifications
        create_demo_notifications(users)
        
        # Create system alerts
        create_demo_alerts()
        
        print("\n" + "=" * 50)
        print("✅ Demo data setup completed successfully!")
        print("\n📋 Demo Login Credentials:")
        print("Super Admin: admin@medora.com / demo123")
        print("Doctor: doctor@medora.com / demo123")
        print("Nurse: nurse@medora.com / demo123")
        print("Patient: patient@medora.com / demo123")
        print("\n🚀 You can now start the Django server and test the application!")
        
    except Exception as e:
        print(f"❌ Error setting up demo data: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()