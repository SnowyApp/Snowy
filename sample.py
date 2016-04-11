import requests
import json

url = "http://localhost:5000"
user = {'email': 'simon', 'password': '123'}

requests.post(url + "/register", json=user)
data = requests.post(url + "/login", json=user)
auth = {"Authorization": json.loads(data.text)["token"]}

def search(term):
    return json.loads(requests.get(url + "/search/cancer").text)['hits']['hits']

def get_children(id):
    return json.loads(requests.get(url + "/get_children/" + str(id)).text)
