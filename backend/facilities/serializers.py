# DjangoのモデルインスタンスをJSON形式に変換したり、その逆を行う

from rest_framework import serializers
from .models import Facility, Amenity, FacilityImage

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']

class FacilityImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacilityImage
        fields = ['id', 'image', 'caption']

class FacilitySerializer(serializers.ModelSerializer):
    # 読み取り専用で、関連するアメニティと画像をネスト
    amenities = AmenitySerializer(many=True, read_only=True)
    images = FacilityImageSerializer(many=True, read_only=True)

    class Meta:
        model = Facility

        # APIで公開するフィールドを定義
        fields = [
            'id',
            'facility_name',
            'capacity',
            'description',
            'short_description',
            'address',
            'num_parking',
            'map_url',
            'management_entity',
            'amenities',
            'images'
        ]