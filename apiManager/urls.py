"""apiManager URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import include
from django.urls import path
from django.urls import re_path as url
from apiManager.settings import MEDIA_URL, MEDIA_ROOT

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^', include('stategridmode.urls')),
]
if MEDIA_URL:
    from django.views.static import serve as static_view
    media_url = MEDIA_URL.strip('/')
    urlpatterns += [
        url(r'^%s/(?P<path>.*)$' % (media_url), static_view,
            {'document_root': MEDIA_ROOT}),
    ]
