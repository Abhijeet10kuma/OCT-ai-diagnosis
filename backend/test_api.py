import requests
import io
from PIL import Image

# Create a dummy image
img = Image.new('RGB', (224, 224), color = 'red')
img_bytes = io.BytesIO()
img.save(img_bytes, format='JPEG')
img_bytes = img_bytes.getvalue()

try:
    response = requests.post(
        "http://localhost:8001/api/predict",
        files={"file": ("test.jpg", img_bytes, "image/jpeg")}
    )
    print("Status Code:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Request failed:", e)
