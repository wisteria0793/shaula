from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# アメニティ管理
class Amenity(models.Model):
    name = models.CharField("アメニティ名", max_length=100, unique=True)

    class Meta:
        verbose_name = "アメニティ"
        verbose_name_plural = "アメニティ"

    def __str__(self):
        return self.name
    
class Facility(models.Model):
    facility_name = models.CharField("施設名", max_length=200)                      # 施設名
    prop_key = models.CharField("プロパティキー", max_length=200, blank=True)        # Beds24 Propkey
    room_key = models.CharField("ルームキー", max_length=50, blank=True)             # Beds24 roomkey
    capacity = models.IntegerField("最大宿泊人数", default=1, validators=[MinValueValidator(1), MaxValueValidator(20)])     # 最大宿泊人数  
    description = models.TextField("説明文", blank=True)                            # 説明文
    short_description = models.CharField("短い説明文", max_length=100, blank=True)   # 短い説明文
    address = models.CharField("住所", max_length=200)                              # 住所
    num_parking = models.IntegerField("駐車場台数", default=0, validators=[MinValueValidator(0), MaxValueValidator(10)])    # 駐車場
    map_url = models.URLField("Google Map URL", blank=True)                         # Google MapのURL

    # Amenityモデルと多対多の関係を定義
    amenities = models.ManyToManyField(
        Amenity,
        verbose_name="アメニティ",
        blank=True
    )

    # 施設管理形態
    class ManagementType(models.TextChoices):
        IN_HOUSE = "IH", "自社管理"
        CONTRACT = "CM", "委託管理"

    management_entity = models.CharField(
        max_length=2,
        choices=ManagementType.choices,
        default=ManagementType.IN_HOUSE,
    )

    def __str__(self):
        return self.facility_name
    

# 施設画像を管理するためのモデル
class FacilityImage(models.Model):
    facility = models.ForeignKey(
        Facility,
        verbose_name="施設",
        related_name="images",      # facility.images.all()のように逆参照できる
        on_delete=models.CASCADE    # 施設が削除されたら、画像も一緒に削除
    )

    image = models.ImageField(
        "画像",
        upload_to="facilities/images/",     # MEDIA_ROOT/facilities/images に保管される
    )

    caption = models.CharField("キャプション", max_length=50, blank=True)

    def __str__(self):
        return f"{self.facility.facility_name}の画像"
