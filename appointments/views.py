from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils import timezone
from .models import Appointment
from .forms import AppointmentForm
from accounts.models import User

@login_required
def appointment_list(request):
    if request.user.role == 'patient':
        appointments = Appointment.objects.filter(patient=request.user)
    elif request.user.role in ['doctor', 'nurse']:
        appointments = Appointment.objects.filter(doctor=request.user)
    else:
        appointments = Appointment.objects.all()
    
    return render(request, 'appointments/list.html', {
        'appointments': appointments
    })

@login_required
def book_appointment(request):
    if request.user.role != 'patient':
        messages.error(request, 'Only patients can book appointments.')
        return redirect('dashboard:index')
    
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.patient = request.user
            appointment.save()
            messages.success(request, 'Appointment booked successfully!')
            return redirect('appointments:list')
    else:
        form = AppointmentForm()
    
    return render(request, 'appointments/book.html', {'form': form})

@login_required
@require_POST
def update_appointment_status(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id)
    
    if request.user.role not in ['doctor', 'super_admin']:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    new_status = request.POST.get('status')
    if new_status in dict(Appointment.STATUS_CHOICES):
        appointment.status = new_status
        appointment.save()
        return JsonResponse({'success': True, 'status': new_status})
    
    return JsonResponse({'error': 'Invalid status'}, status=400)

@login_required
def appointment_detail(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id)
    
    # Check permissions
    if request.user.role == 'patient' and appointment.patient != request.user:
        messages.error(request, 'You can only view your own appointments.')
        return redirect('appointments:list')
    elif request.user.role == 'doctor' and appointment.doctor != request.user:
        messages.error(request, 'You can only view your own appointments.')
        return redirect('appointments:list')
    
    return render(request, 'appointments/detail.html', {
        'appointment': appointment
    })