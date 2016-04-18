from flask import Flask
from flask.ext.elasticsearch import FlaskElasticsearch

app = Flask(__name__)
app.config.from_object("config")

es = FlaskElasticsearch(app)

from application import views

