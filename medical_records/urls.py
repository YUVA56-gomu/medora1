from django.urls import path
from . import views

app_name = 'medical_records'

urlpatterns = [
    path('', views.medical_record_list, name='list'),
    path('create/', views.create_medical_record, name='create'),
    path('<int:record_id>/', views.medical_record_detail, name='detail'),
    path('<int:record_id>/download/', views.download_record, name='download'),
    path('vitals/', views.vitals_list, name='vitals_list'),
    path('vitals/record/', views.record_vitals, name='record_vitals'),
]