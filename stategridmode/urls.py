from django.urls import re_path as url 
from stategridmode.views import index, oneRecordAppraisal, fileAppraisal

urlpatterns = [
    url(r'^$', index, name="main"),
    url(r'^api/one-record-appraisal/$', oneRecordAppraisal.as_view(), name="one-record-appraisal"),
    url(r'^api/appraisal/file/$', fileAppraisal.as_view() , name="file-appraisal"),
]
