from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import viewsets, status
from rest_framework.response import Response
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

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            print(f"Attempting to delete facility: {instance.facility_name} (ID: {instance.id})")
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(f"Error during facility deletion: {e}")
            return Response({'detail': f'Error during deletion: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class FacilityImageViewSet(viewsets.ModelViewSet):
    queryset = FacilityImage.objects.all()
    serializer_class = FacilityImageSerializer


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer