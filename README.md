# SNOWY - SNOMED CT Browser

## Database
To run this application you will need  to setup an API running with access to a postgresql server with SNOMED CT's data.

Install postgresql.

In `/application/models.py` change the variables `DB_NAME` and `DB_USER` to match the name of the postgresql database name and user owning that database.

In `/sql-scripts/import.data.sql` change all paths to `SNOMED_CT_RF2Release_INT_20150731` to its location in your filesystem.

Finally run ,

```
psql -f schema.sql <database-name>
psql -f import-data.sql <database-name>
```

from inside `/sql-scripts/`. Where `<database-name>` is the name of your postgresql database.

## Installation

Install necessary node programs by, inside the `/application/static` directory,  running:

```
npm install
webpack
```

From the root directory install flask dependencies by running:

```
pip install -r requirements.txt
```

Then start the server by running:

```
python run.py
```


## Testing

To run the test framework, simply run `python3 test.py`.

## Local installation
** Create a virtual environment **
```
virutalenv virtenv
```

** Activate the virtual environment**
```
source virtenv/bin/activate
```

** Install all flask dependencies**
```
pip install -r requirements.txt
```

Now you can run the application inside the virtual environment using: `python run.py`. 

You have to activate the environment in every session you want to run code inside the environment. To return to the global environment deactivate the virtual environment.

** Deactivate the environment**
```
deactivate
```


If you do not want to source the environment you can use paths to **pip** and **python**.
`virtenv/bin/pip install -r requirements.txt` **and** `virtenv/bin/python3 run.py`


