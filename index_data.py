import psycopg2

from elasticsearch import Elasticsearch
es = Elasticsearch()

db = psycopg2.connect("dbname=snomedct user=Sehnsucht")
cur = db.cursor()
cur.execute("SELECT concept_id,term FROM description;")
i = 0
for data in cur:
    i+=1
    doc = {"concept_id": data[0], "term": data[1]}
    res = es.index(index="desc", doc_type='concept', id=i, body=doc)
    if i % 1000 == 0:
        print("Indexed item " + str(i))
