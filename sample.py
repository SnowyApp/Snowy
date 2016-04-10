import requests
import json

url = "http://localhost:5000"
user = {'email': 'simon', 'password': '123'}

requests.post(url + "/register", json=user)
data = requests.post(url + "/login", json=user)
auth = {"Authorization": json.loads(data.text)["token"]}

print(requests.get(url + "/get_children/16763008").text)
