import application 
import json
import unittest
import psycopg2

DB_NAME = "snomedct"
DB_USER = "simon"

class TestApplication(unittest.TestCase):
    """
    Performs unittests on the application.
    """
    def drop_database(self):
        conn = psycopg2.connect("dbname=" + DB_NAME + " user=" + DB_USER)
        conn.autocommit = True
        cur = conn.cursor()
        with conn as c:
            f = open("sql-scripts/usr_schema.sql", "r")
            c.cursor().execute(f.read())
            f.close()

    def setUp(self):
        """
        Clear the database and prepare for test.
        Does not use a seperate database.
        """
        application.app.config['TESTING'] = True
        self.app = application.app.test_client()
        self.drop_database()

    def tearDown(self):
        self.drop_database()

    def create_user(self):
        user_data = {"email": "simli746@student.liu.se", "password": "emini"}
        headers = {"content-type": "application/json"}
        return self.app.post('/register', data=json.dumps(user_data), headers=headers)

    def login_user(self):
        user_data = {"email": "simli746@student.liu.se", "password": "emini"}
        headers = {"content-type": "application/json"}
        return self.app.post('/login', data=json.dumps(user_data), headers=headers)

    def test_create_user(self):
        response = self.create_user()
        self.assertEqual(response.status_code, 201)

        # The user is already registered
        response = self.create_user()
        self.assertEqual(response.status_code, 400)

        # Should fail if the client isn't providing email
        user_data = {"password": "emini"}
        headers = {"content-type": "application/json"}
        response = self.app.post('/register', data=json.dumps(user_data), headers=headers)
        self.assertEqual(response.status_code, 400)

    def test_login(self):
        self.create_user()
        response = self.login_user()
        self.assertEqual(response.status_code, 200)

        # Verify that the user is logged in.
        data = json.loads(response.data.decode('utf-8'))
        response = self.app.get('/verify', headers={'Authorization': data['token']})
        self.assertEqual(response.status_code, 200)

        # Invalid user credentials
        user_data = {"email": "simli746@student.liu.se", "password": "emini_madness"}
        headers = {"content-type": "application/json"}
        response = self.app.post('/login', data=json.dumps(user_data), headers=headers)
        
        self.assertEqual(response.status_code, 400)

    def test_logout(self):
        self.create_user()
        response = self.login_user()
        data = json.loads(response.data.decode('utf-8'))
        response = self.app.post('/logout', headers={'Authorization': data['token']})
        self.assertEqual(response.status_code, 200)

        response = self.app.get('/verify', headers={'Authorization': data['token']})
        self.assertEqual(response.status_code, 401)


    def test_user_info(self):
        self.create_user()
        response = self.login_user()
        data = json.loads(response.data.decode('utf-8'))
        user_data = {"first_name": "Simon", "last_name": "Lindblad", "data_lang": "en", "site_lang": "en", "email": "simli746@student.liu.se"}
        response = self.app.put('/user_info', data=json.dumps(user_data), headers={'Authorization': data['token']}, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        
        response = self.app.get('/user_info', headers={'Authorization': data['token']})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data.decode("utf-8")), user_data)


    def test_favorite_term(self):
        self.create_user()
        response = self.login_user()
        data = json.loads(response.data.decode('utf-8'))

        req = {"id": 123, "term": "Term name"}
        response = self.app.post("/favorite_term", data=json.dumps(req), headers={'Authorization': data['token']}, content_type="application/json")

        self.assertEqual(response.status_code, 200)

        response = self.app.get("/favorite_term", headers={'Authorization': data['token']}, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        resp_data = json.loads(response.data.decode("utf-8"))
        self.assertEqual(resp_data[0]['term'], req['term'])
        self.assertEqual(resp_data[0]['id'], req['id'])
        self.assertTrue('favorite_date' in resp_data[0])


    def test_concept(self):
        resp = self.app.get('/concept/709886006')
        self.assertEqual(resp.status_code, 200)
        
        resp_data = json.loads(resp.data.decode("utf-8"))
        self.assertEqual(resp_data['id'], 709886006)
        self.assertEqual(resp_data['full'], "Antibody to Encephalitozoon cuniculi (substance)")
        self.assertEqual(resp_data['synonym'], "Anti-Encephalitozoon cuniculi antibody")

    def test_children(self):
        resp = self.app.get('/get_children/11950008')
        self.assertEqual(resp.status_code, 200)

        resp_data = json.loads(resp.data.decode("utf-8"))
        self.assertEqual(len(resp_data), 6)
        self.assertEqual(resp_data[0]['id'], 420412004)
        self.assertEqual(resp_data[0]['synonym'], "Pseudoacanthocephalidae")
        self.assertEqual(resp_data[0]['type_name'], "IS A")
        self.assertEqual(resp_data[0]['type_id'], 116680003)
        self.assertEqual(resp_data[0]['full'], "Family Pseudoacanthocephalidae (organism)")


    def test_get_parents(self):
        resp = self.app.get('/get_parents/442006003')
        self.assertEqual(resp.status_code, 200)

        resp_data = json.loads(resp.data.decode("utf-8"))
        self.assertEqual(len(resp_data), 1)
        self.assertEqual(resp_data[0]['type_id'], 116680003)
        self.assertEqual(resp_data[0]['synonym'], "Procedure")
        self.assertEqual(resp_data[0]['type_name'], "IS A")
        self.assertEqual(resp_data[0]['full'], "Procedure (procedure)")
        self.assertEqual(resp_data[0]['id'], 71388002)


    def test_diagram(self):
        self.create_user()
        response = self.login_user()
        data = json.loads(response.data.decode('utf-8'))

        diagram = {"data": "This is a test diagram", "name": "Simons diagram", "created": "Thu Apr 28 2016 18:48:38 GMT+0200 (W. Europe Standard Time)"}
        response = self.app.post("/diagram", data=json.dumps(diagram), headers={'Authorization': data['token']}, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        resp_data = json.loads(response.data.decode("utf-8"))
        self.assertTrue("id" in resp_data)

        diagram_id = resp_data["id"]

        response = self.app.get("/diagram", headers={'Authorization': data['token']}, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        resp_data = json.loads(response.data.decode("utf-8"))
        self.assertEqual(len(resp_data), 1)
        self.assertEqual(resp_data[0]["id"], diagram_id)
        self.assertEqual(resp_data[0]["data"], "This is a test diagram")
        self.assertEqual(resp_data[0]["name"], "Simons diagram")
        self.assertEqual(resp_data[0]["created"], "Thu Apr 28 2016 18:48:38 GMT+0200 (W. Europe Standard Time)")
        self.assertEqual(resp_data[0]["modified"], "Thu Apr 28 2016 18:48:38 GMT+0200 (W. Europe Standard Time)")

        diagram = {"data": "This is an updated test diagram", "name": "Simons updated diagram", "id": diagram_id, "modified": "Thu Apr 28 2016 19:48:38 GMT+0200 (W. Europe Standard Time)"}
        response = self.app.put("/diagram", data=json.dumps(diagram), headers={'Authorization': data['token']}, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        response = self.app.get("/diagram", headers={'Authorization': data['token']}, content_type="application/json")
        resp_data = json.loads(response.data.decode("utf-8"))
        self.assertEqual(len(resp_data), 1)
        self.assertEqual(resp_data[0]["id"], diagram_id)
        self.assertEqual(resp_data[0]["data"], "This is an updated test diagram")
        self.assertEqual(resp_data[0]["name"], "Simons updated diagram")
        self.assertEqual(resp_data[0]["created"], "Thu Apr 28 2016 18:48:38 GMT+0200 (W. Europe Standard Time)")
        self.assertEqual(resp_data[0]["modified"], "Thu Apr 28 2016 19:48:38 GMT+0200 (W. Europe Standard Time)")

        response = self.app.delete("/diagram", data=json.dumps({"id": diagram_id}), headers={'Authorization': data['token']}, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        response = self.app.get("/diagram", headers={'Authorization': data['token']}, content_type="application/json")
        resp_data = json.loads(response.data.decode("utf-8"))
        self.assertEqual(len(resp_data), 0)


if __name__ == "__main__":
    unittest.main()
