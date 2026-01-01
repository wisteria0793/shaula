# DjangoのモデルインスタンスをJSON形式に変換したり、その逆を行う

from rest_framework import serializers
from .models import Facility, Amenity, FacilityImage

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']


class FacilityWriteSerializer(serializers.ModelSerializer):
    amenities = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Amenity.objects.all(),
        required=False
    )

    class Meta:
        model = Facility
        fields = [
            'facility_name',
            'capacity',
            'description',
            'short_description',
            'address',
            'num_parking',
            'map_url',
            'management_entity',
            'amenities',
            'prop_key',
            'room_key'
        ]

class FacilityImageSerializer(serializers.ModelSerializer):

    # facilityフィールドを追加し、書き込み時に施設IDを受け取れるように
    # facility = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), write_only=True, required=False)

    class Meta:
        model = FacilityImage
        fields = ['id', 'image', 'caption']
        # read_only_fields = ['id']

class FacilitySerializer(serializers.ModelSerializer):
    # 読み取り専用で、関連するアメニティと画像をネスト
    amenities = AmenitySerializer(many=True, read_only=True)
    # amenities = serializers.PrimaryKeyRelatedField(many=True, queryset=Amenity.objects.all(), required=False)
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
            'images',
            'prop_key',
            'room_key',
        ]