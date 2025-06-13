from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field, Submit, Row, Column
from .models import Appointment
from accounts.models import User

class AppointmentForm(forms.ModelForm):
    doctor = forms.ModelChoiceField(
        queryset=User.objects.filter(role='doctor'),
        empty_label="Select a doctor"
    )

    class Meta:
        model = Appointment
        fields = ['doctor', 'date', 'time', 'appointment_type', 'reason']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date', 'min': forms.DateInput().format_value(forms.DateInput().value_from_datadict({}, {}, 'today'))}),
            'time': forms.TimeInput(attrs={'type': 'time'}),
            'reason': forms.Textarea(attrs={'rows': 3}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'doctor',
            Row(
                Column('date', css_class='form-group col-md-6 mb-0'),
                Column('time', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            'appointment_type',
            'reason',
            Submit('submit', 'Book Appointment', css_class='btn btn-primary')
        )