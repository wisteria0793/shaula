from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import viewsets
from .models import Facility, Amenity, FacilityImage
from .serializers import FacilitySerializer, FacilityImageSerializer, AmenitySerializer, FacilityWriteSerializer

def index(request):
    return HttpResponse("hello, world.")


class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return FacilityWriteSerializer
        return self.serializer_class
    
    
class FacilityImageViewSet(viewsets.ModelViewSet):
    queryset = FacilityImage.objects.all()
    serializer_class = FacilityImageSerializer


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer

    