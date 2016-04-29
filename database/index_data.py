import psycopg2
import requests

from elasticsearch import Elasticsearch
es = Elasticsearch()

requests.delete("http://localhost:9200/desc")

db = psycopg2.connect("dbname=snomedct user=simon")
cur = db.cursor()
cur.execute("SELECT concept_id,term FROM description;")
i = 0
for data in cur:
    i+=1
    doc = {"concept_id": data[0], "term": data[1]}
    res = es.index(index="desc", doc_type='concept', id=i, body=doc)
    if i % 1000 == 0:
        print("Indexed item " + str(i))
