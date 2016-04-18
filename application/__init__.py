from flask import Flask
from flask.ext.elasticsearch import FlaskElasticsearch
from flask.ext.cors import CORS
app = Flask(__name__)
CORS(app)
app.config.from_object("config")

es = FlaskElasticsearch(app)

from application import views

