from flask import Flask
from flask.ext.elasticsearch import FlaskElasticsearch
from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object("config")
CORS(app)
es = FlaskElasticsearch(app)

from application import views

