import psycopg2
import sys

SELECT_CONCEPT_IDS_QUERY = "SELECT DISTINCT id FROM concept WHERE active=1";
SELECT_CONCEPT_QUERY = """SELECT id, definition_status_id FROM concept WHERE active=1 AND id=%s ORDER BY effective_time ASC LIMIT 1"""
INSERT_CONCEPT_STATEMENT = "INSERT INTO concept VALUES (%s, %s)"

def transfer_concept(concept_id, old_db, new_db):
    """
    Transfers the concept with concept_id from the old database to the new.
    """
    data_cur = old_db.cursor()
    dest_cur = new_db.cursor()
    try:
        # Fetch the data from temporary database
        data_cur.execute(SELECT_CONCEPT_QUERY, (concept_id,))
        data = data_cur.fetchone()
        data_cur.close()

        # Insert the data into the new database
        dest_cur.execute(INSERT_CONCEPT_STATEMENT, (data[0], data[1]))
        dest_cur.close()
    except Exception as e:
        print("Error occured for id " + str(concept_id) + ": " + str(e))

def transfer_concepts(old_db, new_db):
    """
    Transfers all the concepts from old_db to new_db.
    """
    print("Transfering concepts")
    id_cur = old_db.cursor()
    id_cur.execute(SELECT_CONCEPT_IDS_QUERY)
    total = id_cur.rowcount
    count = 0
    for res in id_cur:
        transfer_concept(res[0], old_db, new_db)
        count += 1
        print("\r{0:.2f}".format(count*100/total) + "%", end="")
    print()
    id_cur.close()
    new_db.commit()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: transfer_data.py DATA_DB PRODUCTION_DB")
        print("Example: transfer_data.py tmp_INT_20150731 INT_20150731")
        exit(1)

    old_db = psycopg2.connect("dbname=" + sys.argv[1] + " user=" + "simon")
    new_db = psycopg2.connect("dbname=" + sys.argv[2] + " user=" + "simon")
    
    transfer_concepts(old_db, new_db)
