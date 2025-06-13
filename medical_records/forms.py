from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field, Submit, Row, Column
from .models import MedicalRecord, VitalSigns
from accounts.models import User

class MedicalRecordForm(forms.ModelForm):
    patient = forms.ModelChoiceField(
        queryset=User.objects.filter(role='patient'),
        empty_label="Select a patient"
    )

    class Meta:
        model = MedicalRecord
        fields = ['patient', 'diagnosis', 'symptoms', 'treatment', 'prescription', 'notes', 'visit_date', 'follow_up_date']
        widgets = {
            'visit_date': forms.DateInput(attrs={'type': 'date'}),
            'follow_up_date': forms.DateInput(attrs={'type': 'date'}),
            'symptoms': forms.Textarea(attrs={'rows': 3}),
            'treatment': forms.Textarea(attrs={'rows': 3}),
            'prescription': forms.Textarea(attrs={'rows': 3}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'patient',
            'diagnosis',
            'symptoms',
            'treatment',
            'prescription',
            Row(
                Column('visit_date', css_class='form-group col-md-6 mb-0'),
                Column('follow_up_date', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'notes',
            Submit('submit', 'Create Record', css_class='btn btn-primary')
        )

class VitalSignsForm(forms.ModelForm):
    patient = forms.ModelChoiceField(
        queryset=User.objects.filter(role='patient'),
        empty_label="Select a patient"
    )

    class Meta:
        model = VitalSigns
        fields = ['patient', 'blood_pressure_systolic', 'blood_pressure_diastolic', 
                 'heart_rate', 'temperature', 'oxygen_saturation', 'weight', 'height']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'patient',
            Row(
                Column('blood_pressure_systolic', css_class='form-group col-md-6 mb-0'),
                Column('blood_pressure_diastolic', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('heart_rate', css_class='form-group col-md-6 mb-0'),
                Column('temperature', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('oxygen_saturation', css_class='form-group col-md-6 mb-0'),
                Column('weight', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'height',
            Submit('submit', 'Record Vitals', css_class='btn btn-primary')
        )