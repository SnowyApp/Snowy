"""
Indexes concepts from the database
"""
import psycopg2
import requests

from elasticsearch import Elasticsearch
es = Elasticsearch()

requests.delete("http://localhost:9200/desc")

db = psycopg2.connect("dbname=snomed user=simon")
cur = db.cursor()
cur.execute("SELECT id, preferred_synonym FROM concept")
i = 0
count = cur.rowcount
for data in cur:
    i += 1
    doc = {"concept_id": data[0], "term": data[1]}
    res = es.index(index="desc", doc_type='concept', id=i, body=doc)
    print("\r{0:.2f}".format(i*100/count) + "%", end="")
