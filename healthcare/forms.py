from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, Field
from .models import User, Appointment, MedicalRecord, Task, VitalSigns, Notification

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    phone = forms.CharField(max_length=15, required=False)
    address = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}), required=False)
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'role', 'phone', 'address', 'date_of_birth', 'password1', 'password2')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('first_name', css_class='form-group col-md-6 mb-0'),
                Column('last_name', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('username', css_class='form-group col-md-6 mb-0'),
                Column('email', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'role',
            Row(
                Column('password1', css_class='form-group col-md-6 mb-0'),
                Column('password2', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'phone',
            'date_of_birth',
            'address',
            Submit('submit', 'Register', css_class='btn btn-primary')
        )

class CustomAuthenticationForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'username',
            'password',
            Submit('submit', 'Sign In', css_class='btn btn-primary w-100')
        )

class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['doctor', 'date', 'time', 'type', 'notes']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'time': forms.TimeInput(attrs={'type': 'time'}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }
    
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        
        if user and user.role == 'patient':
            self.fields['doctor'].queryset = User.objects.filter(role='doctor', is_active=True)
        
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'doctor',
            Row(
                Column('date', css_class='form-group col-md-6 mb-0'),
                Column('time', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'type',
            'notes',
            Submit('submit', 'Book Appointment', css_class='btn btn-primary')
        )

class MedicalRecordForm(forms.ModelForm):
    class Meta:
        model = MedicalRecord
        fields = ['patient', 'diagnosis', 'treatment', 'prescription', 'notes', 'date']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'treatment': forms.Textarea(attrs={'rows': 3}),
            'prescription': forms.Textarea(attrs={'rows': 3}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }
    
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        
        if user and user.role == 'doctor':
            self.fields['patient'].queryset = User.objects.filter(role='patient', is_active=True)
        
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'patient',
            'diagnosis',
            'date',
            'treatment',
            'prescription',
            'notes',
            Submit('submit', 'Save Record', css_class='btn btn-primary')
        )

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'assigned_to', 'patient', 'priority', 'due_date']
        widgets = {
            'due_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 3}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['assigned_to'].queryset = User.objects.filter(role__in=['nurse', 'doctor'], is_active=True)
        self.fields['patient'].queryset = User.objects.filter(role='patient', is_active=True)
        
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'title',
            'description',
            Row(
                Column('assigned_to', css_class='form-group col-md-6 mb-0'),
                Column('patient', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('priority', css_class='form-group col-md-6 mb-0'),
                Column('due_date', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Submit('submit', 'Create Task', css_class='btn btn-primary')
        )

class VitalSignsForm(forms.ModelForm):
    class Meta:
        model = VitalSigns
        fields = ['patient', 'blood_pressure_systolic', 'blood_pressure_diastolic', 
                 'heart_rate', 'temperature', 'oxygen_saturation', 'weight', 'height', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 3}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['patient'].queryset = User.objects.filter(role='patient', is_active=True)
        
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'patient',
            Row(
                Column('blood_pressure_systolic', css_class='form-group col-md-6 mb-0'),
                Column('blood_pressure_diastolic', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('heart_rate', css_class='form-group col-md-4 mb-0'),
                Column('temperature', css_class='form-group col-md-4 mb-0'),
                Column('oxygen_saturation', css_class='form-group col-md-4 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('weight', css_class='form-group col-md-6 mb-0'),
                Column('height', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'notes',
            Submit('submit', 'Record Vitals', css_class='btn btn-primary')
        )

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'date_of_birth', 'avatar']
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
            'address': forms.Textarea(attrs={'rows': 3}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('first_name', css_class='form-group col-md-6 mb-0'),
                Column('last_name', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'email',
            'phone',
            'date_of_birth',
            'address',
            'avatar',
            Submit('submit', 'Update Profile', css_class='btn btn-primary')
        )