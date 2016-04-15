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

def update_info(first_name, last_name, language):
    data = {"first_name": first_name, "last_name": last_name, "language": language}
    return json.loads(requests.post(url + "/update_info", json=data, headers=auth).text)

def store_diagram():
    data = {"data": "This is a test diagram"}
    return json.loads(requests.post(url + "/diagram", json=data, headers=auth).text)

def get_diagram():
    return json.loads(requests.get(url + "/diagram", headers=auth).text)
