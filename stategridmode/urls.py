from django.urls import re_path as url 
from stategridmode import views

urlpatterns = [
    url(r'^$', views.index),
]
