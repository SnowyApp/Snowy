import psycopg2
import sys

SELECT_CONCEPT_IDS_QUERY = "SELECT DISTINCT id FROM concept WHERE active=1"
SELECT_CONCEPT_QUERY = """SELECT id, definition_status_id FROM concept WHERE active=1 AND id=%s ORDER BY effective_time DESC LIMIT 1"""
INSERT_CONCEPT_STATEMENT = "INSERT INTO concept VALUES (%s, %s)"

SELECT_RELATION_IDS_QUERY = "SELECT DISTINCT id FROM relationship WHERE active=1"
SELECT_RELATION_QUERY = "select source_id, destination_id, relationship_group, type_id from relationship where active=1 and id=%s order by effective_time desc limit 1"
INSERT_RELATION_STATEMENT = "insert into relationship (source_id, destination_id, group_id, type_id) VALUES (%s, %s, %s, %s)"

SELECT_DESC_IDS_QUERY = "select distinct id from description where active=1"
SELECT_DESC_QUERY = "select distinct a.effective_time, a.id, a.concept_id, a.term, a.type_id, b.acceptability_id from description a join language_refset b on a.id=b.referenced_component_id and b.active=1 and a.active=1 and a.id=%s order by a.effective_time desc limit 10;"
INSERT_DESC_STATEMENT = "insert into description (id, concept_id, term, type_id, acceptability_id) VALUES (%s, %s, %s, %s, %s)"

def transfer_specific(data_id, old_db, new_db, SELECT_QUERY, INSERT_STATEMENT, scale = 0):
    """
    Transfers the concept with concept_id from the old database to the new.
    """
    data_cur = old_db.cursor()
    dest_cur = new_db.cursor()
    try:
        # Fetch the data from temporary database
        data_cur.execute(SELECT_QUERY, (data_id,))
        data = data_cur.fetchone()
        data_cur.close()

        # Insert the data into the new database
        dest_cur.execute(INSERT_STATEMENT, data[scale:])
        dest_cur.close()
    except Exception as e:
        print("Error occured for id " + str(data_id) + ": " + str(e))

def transfer_type(old_db, new_db, ID_QUERY, SELECT_QUERY, INSERT_STATEMENT, scale=0):
    id_cur = old_db.cursor()
    id_cur.execute(ID_QUERY)
    total = id_cur.rowcount
    count = 0
    for res in id_cur:
        transfer_specific(res[0], old_db, new_db, SELECT_QUERY, INSERT_STATEMENT, scale)
        count += 1
        print("\r{0:.2f}".format(count*100/total) + "%", end="")
    print()
    id_cur.close()

def transfer_name(db):
    cur = db.cursor()
    cur.execute("select id from concept order by id")
    total = cur.rowcount
    count = 0
    for res in cur:
        count += 1
        row_cur = db.cursor()
        row_cur.execute("select term, type_id from description where concept_id=%s", (res[0],))
        full = ""
        syn = ""
        for data in row_cur:
            if data[1] == "900000000000003001":
                full = data[0]
            else:
                syn = data[0]

        row_cur.execute("update concept set preferred_full=%s, preferred_synonym=%s where id=%s", (full, syn, res[0]))
        print("\r{0:.2f}".format(count*100/total) + "%", end="")
    print()
    cur.close()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: transfer_data.py DATA_DB PRODUCTION_DB")
        print("Example: transfer_data.py tmp_INT_20150731 INT_20150731")
        exit(1)

    old_db = psycopg2.connect("dbname=" + sys.argv[1] + " user=" + "simon")
    old_db.autocommit = True;
    new_db = psycopg2.connect("dbname=" + sys.argv[2] + " user=" + "simon")
    new_db.autocommit = True;

    transfer_name(new_db)
    
    print("Transfering concepts")
    transfer_type(old_db, new_db, SELECT_CONCEPT_IDS_QUERY, SELECT_CONCEPT_QUERY, INSERT_CONCEPT_STATEMENT)
    print("Completed!")

    print("Transfering relations")
    transfer_type(old_db, new_db, SELECT_RELATION_IDS_QUERY, SELECT_RELATION_QUERY, INSERT_RELATION_STATEMENT)
    print("Completed!")

    print("Transfering descriptions")
    transfer_type(old_db, new_db, SELECT_DESC_IDS_QUERY, SELECT_DESC_QUERY, INSERT_DESC_STATEMENT, 1)
    print("Completed!")
