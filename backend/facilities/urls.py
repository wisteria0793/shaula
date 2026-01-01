from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import index, FacilityViewSet, FacilityImageViewSet, AmenityViewSet


# DefaultRouterを作成
router = DefaultRouter()

# ViewSetをルーターに登録
router.register(r'facilities', FacilityViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'images', FacilityImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('/index/', index, name="index")
]

