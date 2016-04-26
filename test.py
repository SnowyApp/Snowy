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

if __name__ == "__main__":
    unittest.main()
