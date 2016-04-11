from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask.ext.elasticsearch import FlaskElasticsearch

app = Flask(__name__)
app.config.from_object("config")

db = SQLAlchemy(app)
es = FlaskElasticsearch(app)

from application import views

