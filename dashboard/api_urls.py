from django.urls import path
from . import views  # or wherever your views are

urlpatterns = [
    # Example route
    path('hello/', views.hello_view, name='hello'),
]