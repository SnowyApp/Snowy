# SNOWY - SNOMED CT Browser

## Installation

### Database
To run this application you will need  to setup an API running with access to a postgresql server with SNOMED CT's data.
The data needs to be parsed and added to the database.
You'll need one database for the user data, and one for the snomed data.
Create them:
- users: Used to store user data.
- snomed: Used to store snomed data.
- old_snomed: Used to store temporary snomed file data.

In order to parse the data, the following steps are required:

1. Obtain a copy of the SNOMED CT data
2. Write a script that sets up a temporary database (modify database/scripts/import_INT_20150731.sql with your own paths).
3. run database/setup.sh

After this, the old_snomed database can be removed.

Configure the database constants in config.py.

### Elasticsearch

Install Elasticsearch and start the Elasticsearch server.

From the project root run:

```
python database/index_data.py
```

inside your virtual environment if you are using one.

### npm

Install necessary node programs by, inside the `/application/static` directory,  running:

```
npm install
```


### virtualenv
**Create a virtual environment**
```
virutalenv virtenv
```

**Activate the virtual environment**
```
source virtenv/bin/activate
```

**Install all flask dependencies**
```
pip install -r requirements.txt
```

Now you can run the application inside the virtual environment using: `python run.py`.

You have to activate the environment in every session you want to run code inside the environment. To return to the global environment deactivate the virtual environment.

**Deactivate the environment**
```
deactivate
```

If you do not want to source the environment you can use paths to **pip** and **python**.
`virtenv/bin/pip install -r requirements.txt` **and** `virtenv/bin/python3 run.py`

### Start server

Make sure `bundle.js` is updated by running:

```
webpack
```

from `/application/static/`.

Then start the server by running(requires Python3 for full functionality):

```
python run.py
```


## Testing

To run the test framework, simply run `python3 test.py`.
