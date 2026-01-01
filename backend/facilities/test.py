from django.test import TestCase
from .models import Facility, Amenity, FacilityImage

class FacilityModelTest(TestCase):
    def test_create_facility_with_amenities(self):

        # アメニティを作成
        bath_towels = Amenity.objects.create(name="バスタオル")
        face_towels = Amenity.objects.create(name="フェイスタオル")
        shampoo = Amenity.objects.create(name="シャンプー")
        treatment = Amenity.objects.create(name="トリートメント")
        body_soap = Amenity.objects.create(name="ボディソープ")

        # 施設を作成
        facility = Facility.objects.create(
            facility_name="ゲストハウス巴.com",
            capacity=11,
            address="北海道函館市松風町1-2",
            description="当ゲストハウスは、1階にキッチンと掘り炬燵が完備され、くつろぎのひとときをお楽しみいただけます。2階には快適な寝室と清潔なシャワールームを備え、家族や友人との宿泊に最適です。 館内には、ワンピースのフィギュアをはじめ、多彩なフィギュアやポスターが飾られており、ファンの方にもお楽しみいただけるユニークな空間が広がっています。 函館駅から徒歩約10分という便利な立地に加え、施設前には最大3台まで駐車可能な駐車場を完備。観光やビジネスでのご利用に最適なアクセス環境を提供しています。 函館の魅力とともに、心地よい滞在をお楽しみください。",
            short_description="函館駅徒歩10分、広々空間でグループ旅行を楽しく！個性豊かなデザインとノスタルジックな展示が魅力の宿泊体験。",
        )

        # 施設にアメニティを追加
        facility.amenities.add(bath_towels, face_towels, shampoo, treatment, body_soap)

        # データベースから施設を再取得して確認
        retrieved_facility = Facility.objects.get(facility_name="ゲストハウス巴.com")
        self.assertEqual(retrieved_facility.capacity, 11)
        self.assertEqual(retrieved_facility.amenities.count(), 5)

    def test_create_facility_with_images(self):
        facility = Facility.objects.create(
            facility_name="ゲストハウス巴.com",
            capacity=11,
            address="北海道函館市松風町1-2"
        )

        # 画像のファイルパスの文字列を渡し、テスト
        image1 = FacilityImage.objects.create(facility=facility, image="/Users/atsuyakatougi/Desktop/Tomoe.com/DSC_0041.JPG", caption="外観")
        
        # 確認
        retrieved_facility = Facility.objects.get(facility_name="ゲストハウス巴.com")
        self.assertEqual(retrieved_facility.images.count(), 1)
        self.assertEqual(retrieved_facility.images.first().caption, "外観")

        