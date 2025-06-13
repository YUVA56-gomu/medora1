from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse
from .models import MedicalRecord, VitalSigns
from .forms import MedicalRecordForm, VitalSignsForm

@login_required
def medical_record_list(request):
    if request.user.role == 'patient':
        records = MedicalRecord.objects.filter(patient=request.user)
    elif request.user.role in ['doctor', 'nurse']:
        records = MedicalRecord.objects.all()
    else:
        records = MedicalRecord.objects.all()
    
    return render(request, 'medical_records/list.html', {
        'records': records
    })

@login_required
def create_medical_record(request):
    if request.user.role not in ['doctor', 'super_admin']:
        messages.error(request, 'Only doctors can create medical records.')
        return redirect('medical_records:list')
    
    if request.method == 'POST':
        form = MedicalRecordForm(request.POST)
        if form.is_valid():
            record = form.save(commit=False)
            record.doctor = request.user
            record.save()
            messages.success(request, 'Medical record created successfully!')
            return redirect('medical_records:list')
    else:
        form = MedicalRecordForm()
    
    return render(request, 'medical_records/create.html', {'form': form})

@login_required
def medical_record_detail(request, record_id):
    record = get_object_or_404(MedicalRecord, id=record_id)
    
    # Check permissions
    if request.user.role == 'patient' and record.patient != request.user:
        messages.error(request, 'You can only view your own medical records.')
        return redirect('medical_records:list')
    
    return render(request, 'medical_records/detail.html', {
        'record': record
    })

@login_required
def record_vitals(request):
    if request.user.role not in ['nurse', 'doctor']:
        messages.error(request, 'Only nurses and doctors can record vitals.')
        return redirect('dashboard:index')
    
    if request.method == 'POST':
        form = VitalSignsForm(request.POST)
        if form.is_valid():
            vitals = form.save(commit=False)
            vitals.recorded_by = request.user
            vitals.save()
            messages.success(request, 'Vital signs recorded successfully!')
            return redirect('medical_records:vitals_list')
    else:
        form = VitalSignsForm()
    
    return render(request, 'medical_records/record_vitals.html', {'form': form})

@login_required
def vitals_list(request):
    if request.user.role == 'patient':
        vitals = VitalSigns.objects.filter(patient=request.user)
    else:
        vitals = VitalSigns.objects.all()
    
    return render(request, 'medical_records/vitals_list.html', {
        'vitals': vitals
    })

@login_required
def download_record(request, record_id):
    record = get_object_or_404(MedicalRecord, id=record_id)
    
    # Check permissions
    if request.user.role == 'patient' and record.patient != request.user:
        messages.error(request, 'You can only download your own medical records.')
        return redirect('medical_records:list')
    
    # Generate PDF or return file (simplified for demo)
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="medical_record_{record.id}.pdf"'
    
    # Here you would generate the actual PDF content
    response.write(f"Medical Record for {record.patient.get_full_name()}\n")
    response.write(f"Diagnosis: {record.diagnosis}\n")
    response.write(f"Treatment: {record.treatment}\n")
    response.write(f"Date: {record.visit_date}\n")
    
    return response