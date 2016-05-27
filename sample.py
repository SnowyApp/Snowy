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


def logout():
    resp = requests.post(url + "/logout", headers=auth)
    return json.loads(resp.text), resp.status_code


def get_favorite_terms():
    return json.loads(requests.get(url + "/favorite_term", headers=auth).text)


def delete_favorite_term(id):
    return json.loads(requests.delete(url + "/favorite_term", json={'id': id}, headers=auth).text)


def add_favorite_term(cid, term):
    data = {"id": cid, "term": term, "date_added": "now"}
    return json.loads(requests.post(url + "/favorite_term", json=data, headers=auth).text)


def search(term):
    return json.loads(requests.get(url + "/search/cancer").text)['hits']['hits']


def get_children(id):
    return json.loads(requests.get(url + "/get_children/" + str(id)).text)


def get_relations(id):
    return json.loads(requests.get(url + "/get_relations/" + str(id)).text)


def get_parents(id):
    return json.loads(requests.get(url + "/get_parents/" + str(id)).text)


def get_grandparents(id):
    return json.loads(requests.get(url + "/get_grandparents/" + str(id)).text)


def get_concept(id):
    return json.loads(requests.get(url + "/concept/" + str(id)).text)


def get_concept_names(id):
    return json.loads(requests.get(url + "/get_names/" + str(id)).text)


def update_info():
    global auth
    data = {"first_name": "Simon", "last_name": "Lindblad", "db_edition": "en", "email": "simonlind", "site_lang": "en"}
    data = json.loads(requests.put(url + "/user_info", json=data, headers=auth).text)
    auth = {"Authorization": data["token"]}
    return data


def update_password(pswd):
    data = {"password": pswd, "invalidate_tokens": True}
    return json.loads(requests.put(url + "/password", json=data, headers=auth).text)


def get_user_info():
    return json.loads(requests.get(url + "/user_info", headers=auth).text)


def store_diagram():
    data = {"data": "This is a test diagram", "name": "Simons diagram",
            "created": "Thu Apr 28 2016 18:48:38 GMT+0200 (W. Europe Standard Time)"}
    return json.loads(requests.post(url + "/diagram", json=data, headers=auth).text)


def update_diagram():
    data = {"data": "This is an updated diagram", "name": "Simons updated diagram", "id": store_diagram()['id'],
            "modified": "Thu Apr 28 2016 19:48:38 GMT+0200 (W. Europe Standard Time)"}
    return json.loads(requests.put(url + "/diagram", json=data, headers=auth).text)


def delete_diagram(id):
    return json.loads(requests.delete(url + "/diagram/" + str(id), headers=auth).text)

def get_diagrams():
    return json.loads(requests.get(url + "/diagram", headers=auth).text)


def get_diagram(id):
    return json.loads(requests.get(url + "/diagram/" + str(id), headers=auth).text)


def rel_data(cid):
    data = get_relations(cid)
    for res in data:
        print(res["full"])
        print(res["group_id"])
        print(res["type_name"])
        print()
