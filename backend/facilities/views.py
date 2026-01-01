from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import viewsets
from .models import Facility, Amenity, FacilityImage
from .serializers import FacilitySerializer, FacilityImageSerializer, AmenitySerializer

def index(request):
    return HttpResponse("hello, world.")


class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

class FacilityImageViewSet(viewsets.ModelViewSet):
    queryset = FacilityImage.objects.all()
    serializer_class = FacilityImageSerializer

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer

    