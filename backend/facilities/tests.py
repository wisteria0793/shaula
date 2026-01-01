import csv
import os
import json
from parameterized import parameterized
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Facility, Amenity, FacilityImage

# --- モデルの単体テスト (これは残しておきます) ---
class FacilityModelTest(TestCase):
    def test_create_facility_with_amenities(self):
        wifi = Amenity.objects.create(name="Wi-Fi")
        tv = Amenity.objects.create(name="テレビ")
        facility = Facility.objects.create(facility_name="テスト施設", capacity=4)
        facility.amenities.add(wifi, tv);
        self.assertEqual(facility.amenities.count(), 2)

    def test_create_facility_with_images(self):
        facility = Facility.objects.create(facility_name="画像テスト施設", capacity=2)
        FacilityImage.objects.create(facility=facility, image='path/to/image1.jpg')
        self.assertEqual(facility.images.count(), 1)


# --- CSVファイルを読み込むためのヘルパー関数 ---
def load_api_test_cases_from_csv(file_path):
    test_cases = []
    abs_path = os.path.join(os.path.dirname(__file__), file_path)
    with open(abs_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            test_cases.append(tuple(row.values()))
    return test_cases


# --- データ駆動APIテスト用の新しいテストクラス ---
class DataDrivenAPITest(APITestCase):

    def setUp(self):
        """各テストの前に、ターゲットとなる初期施設を1つ作成しておく"""
        self.initial_facility = Facility.objects.create(
            facility_name="初期施設",
            capacity=1,
            address="初期住所"
        )

    @parameterized.expand(
        load_api_test_cases_from_csv('test_data/facilities_test_data.csv')
    )
    def test_api_from_csv(self, test_name, method, target_id_placeholder, payload_json, expected_status_code, expected_response_contains_json):
        """
        CSVから読み込んだデータでAPIをテストする
        """
        print(f"Running test: {test_name}") # どのテストケースが実行されているか表示

        url = ''
        target_id = None

        # ターゲットIDの解決
        if target_id_placeholder == 'TARGET_ID':
            target_id = self.initial_facility.pk
        
        # URLの決定
        if method in ['POST']:
            url = reverse('facility-list')
        elif method in ['GET', 'PATCH', 'DELETE']:
            if not target_id:
                self.fail(f"Test '{test_name}' requires a target_id, but it's not set.")
            url = reverse('facility-detail', kwargs={'pk': target_id})
        else:
            self.fail(f"Unsupported HTTP method '{method}' in test '{test_name}'")

        # ペイロードの準備
        payload = json.loads(payload_json) if payload_json else None

        # メソッドに応じたリクエストの実行
        response = None
        if method == 'POST':
            response = self.client.post(url, payload, format='json')
        elif method == 'GET':
            response = self.client.get(url, format='json')
        elif method == 'PATCH':
            response = self.client.patch(url, payload, format='json')
        elif method == 'DELETE':
            response = self.client.delete(url)
        
        # ステータスコードの検証
        self.assertEqual(int(expected_status_code), response.status_code, f"Test '{test_name}' failed status code check. Response: {response.data}")

        # レスポンスボディの検証
        if expected_response_contains_json:
            expected_data = json.loads(expected_response_contains_json)
            # レスポンスデータに期待するキーと値が含まれているかチェック
            for key, value in expected_data.items():
                self.assertIn(key, response.data)
                self.assertEqual(value, response.data[key])









"""
古いテストケース
"""
# from django.test import TestCase
# from rest_framework.test import APITestCase
# from rest_framework import status
# from django.urls import reverse
# from .models import Facility, Amenity, FacilityImage

# import csv
# import os
# from parameterized import parameterized

# class FacilityModelTest(TestCase):
#     def test_create_facility_with_amenities(self):

#         # アメニティを作成
#         bath_towels = Amenity.objects.create(name="バスタオル")
#         face_towels = Amenity.objects.create(name="フェイスタオル")
#         shampoo = Amenity.objects.create(name="シャンプー")
#         treatment = Amenity.objects.create(name="トリートメント")
#         body_soap = Amenity.objects.create(name="ボディソープ")

#         # 施設を作成
#         facility = Facility.objects.create(
#             facility_name="ゲストハウス巴.com",
#             capacity=11,
#             address="北海道函館市松風町1-2",
#             description="当ゲストハウスは、1階にキッチンと掘り炬燵が完備され、くつろぎのひとときをお楽しみいただけます。2階には快適な寝室と清潔なシャワールームを備え、家族や友人との宿泊に最適です。 館内には、ワンピースのフィギュアをはじめ、多彩なフィギュアやポスターが飾られており、ファンの方にもお楽しみいただけるユニークな空間が広がっています。 函館駅から徒歩約10分という便利な立地に加え、施設前には最大3台まで駐車可能な駐車場を完備。観光やビジネスでのご利用に最適なアクセス環境を提供しています。 函館の魅力とともに、心地よい滞在をお楽しみください。",
#             short_description="函館駅徒歩10分、広々空間でグループ旅行を楽しく！個性豊かなデザインとノスタルジックな展示が魅力の宿泊体験。",
#         )

#         # 施設にアメニティを追加
#         facility.amenities.add(bath_towels, face_towels, shampoo, treatment, body_soap)

#         # データベースから施設を再取得して確認
#         retrieved_facility = Facility.objects.get(facility_name="ゲストハウス巴.com")
#         self.assertEqual(retrieved_facility.capacity, 11)
#         self.assertEqual(retrieved_facility.amenities.count(), 5)

#     def test_create_facility_with_images(self):
#         facility = Facility.objects.create(
#             facility_name="ゲストハウス巴.com",
#             capacity=11,
#             address="北海道函館市松風町1-2"
#         )

#         # 画像のファイルパスの文字列を渡し、テスト
#         image1 = FacilityImage.objects.create(facility=facility, image="/Users/atsuyakatougi/Desktop/Tomoe.com/DSC_0041.JPG", caption="外観")
        
#         # 確認
#         retrieved_facility = Facility.objects.get(facility_name="ゲストハウス巴.com")
#         self.assertEqual(retrieved_facility.images.count(), 1)
#         self.assertEqual(retrieved_facility.images.first().caption, "外観")

        

# # 
# class FacilityAPITest(APITestCase):

#     def setUp(self):
#         # テストで使う共通のデータを作成
#         self.facility = Facility.objects.create(facility_name="テスト", capacity=5)
#         self.amenity = Amenity.objects.create(name="APIテスト用アメニティ")
#         self.facility.amenities.add(self.amenity)

#     def test_list_facilities(self):
#         """
#         GET /api/facilities/ : 施設一覧が取得できるか
#         """
#         url = reverse('facility-list')  # DRFのルータが自動作成したURL名
#         response = self.client.get(url)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)
#         self.assertEqual(response.data[0]['facility_name'], "テスト")

#     def test_create_facility(self):
#         """
#         POST /api/facilities/ : 新しい施設が作成できるか
#         """
#         url = reverse('facility-list')
#         data = {
#             'facility_name': "新しい施設",
#             'capacity': 10,
#             'address': '北海道函館市松風町11-11',
#             'description': '新規施設の説明'
#         }
#         response = self.client.post(url, data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Facility.objects.count(), 2)
#         self.assertEqual(Facility.objects.get(id=response.data['id']).facility_name, '新しい施設')

#     def test_delete_facility(self):
#         """
#         DELETE /api/facilities/{id}/ : 施設が削除できるか
#         """
#         url = reverse('facility-detail', kwargs={'pk': self.facility.pk})
#         response = self.client.delete(url)

#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertEqual(Facility.objects.count(), 0)


# # -- CSVファイルを読み込むためのヘルパー関数 --
# def load_test_cases_from_csv(file_path):
#     test_cases = []

#     # ファイルのフルパスを取得
#     abs_path = os.path.join(os.path.dirname(__file__), file_path)
#     with open(abs_path, 'r', encoding='utf-8') as csvfile:
#         reader = csv.DictReader(csvfile)

#         for row in reader:
#             test_cases.append(
#                 (
#                     row['test_name'],
#                     row['facility_name'],
#                     int(row['capacity']),
#                     row['address'],
#                     int(row['expected_status_code'])
#                 )
#             )
#     return test_cases


# # -- データ駆動テスト用のクラス --
# class FacilityCreationDataDrivenTest(APITestCase):

#     @parameterized.expand(
#         load_test_cases_from_csv('test_data/facilities_test_data.csv')
#     )

#     def test_create_facility_from_csv(
#             self, 
#             test_name,
#             facility_name,
#             capacity,
#             address,
#             expected_status_code
#         ):
#         """
#         CSVから読み込んだデータで施設作成APIをテスト
#         """

#         print(f"Running Test: {test_name}")
#         url = reverse('facility-list')
#         data = {
#             'facility_name': facility_name,
#             'capacity': capacity,
#             'address': address,
#         }

#         response = self.client.post(url, data, format='json')

#         # 期待するテストコードと、実際のレスポンスを確認
#         self.assertEqual(response.status_code, expected_status_code)

#         # 成功を期待するテストケースなら、DBに追加されたことを確認
#         if expected_status_code == status.HTTP_201_CREATED:
#             self.assertTrue(Facility.objects.filter(facility_name=facility_name).exists())