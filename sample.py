import requests
import json

url = "http://localhost:5000"
user = {'email': 'simon', 'password': '123'}

requests.post(url + "/register", json=user)
data = requests.post(url + "/login", json=user)
auth = {"Authorization": json.loads(data.text)["token"]}

def register_user(username, password):
    user = {'email': username, 'password': password}
    return json.loads(requests.post(url + "/register", json=user).text)

def login(username, password):
    user = {'email': username, 'password': password}
    return json.loads(requests.post(url + "/login", json=user).text)
    
def get_favorite_terms():
    return json.loads(requests.get(url + "/favorite_term", headers=auth).text)

def add_favorite_term(cid, term, et, a):
    data = {"id": cid, "effective_time": et, "term": term, "active": a}
    return json.loads(requests.post(url + "/favorite_term", json=data, headers=auth).text)

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

def update_diagram():
    data = {"data": "This is an updated diagram", "id": store_diagram()['id']}
    return json.loads(requests.put(url + "/diagram", json=data, headers=auth).text)

def get_diagram():
    return json.loads(requests.get(url + "/diagram", headers=auth).text)
