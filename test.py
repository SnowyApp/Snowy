import unittest
import json
import application 

class TestApplication(unittest.TestCase):
    """
    Performs unittests on the application.
    """

    def setUp(self):
        """
        Clear the database and prepare for test.
        Does not use a seperate database.
        """
        application.app.config['TESTING'] = True
        application.db.drop_all()
        application.db.create_all()
        self.app = application.app.test_client()

    def test_create_user(self):
        user_data = {"email": "simli746@student.liu.se", "password": "emini"}
        headers = {"content-type": "application/json"}
        response = self.app.post('/register', data=json.dumps(user_data), headers=headers)
        assert response.status_code == 200


if __name__ == "__main__":
    unittest.main()
