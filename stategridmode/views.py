from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader,RequestContext

# Create your views here.
def index(request):
    context={'title':'图书列表'}
    return render(request, 'stategridmode/index.html', context)
   


