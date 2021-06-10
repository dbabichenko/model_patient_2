from neo4j import GraphDatabase
import pandas as pd
import datetime
import os

uri = "bolt://localhost:7687"


def link_event_sequences(df):
    # https://github.com/neo4j/neo4j-python-driver/issues/67
    # https://www.quackit.com/neo4j/tutorial/neo4j_create_a_relationship_using_cypher.cfm

    driver = GraphDatabase.driver(uri, auth=("testUser", "sepsis123"))
    session = driver.session()

    for idx, row in df.iterrows():
        qry = "MATCH (e1:Event),(e2:Event) "
        qry = qry + "WHERE e1.eventId = '" + row['prevEventId'] + "' AND e2.eventId = '" + row['eventId'] + "' "
        qry = qry + "CREATE (e1)-[rel:SEQUENCE]->(e2) "
        print(qry)
        session.run(qry)

    session.close()

    

cnt = 0
for root, dirs, files in os.walk("output_05_01_2019", topdown=False):
    for name in files:
        if 'sepsis_linked_events' in name:
            filename = os.path.join(root, name)
            df = pd.read_csv(filename)

            print(filename)

            link_event_sequences(df)

            cnt = cnt + 1
            print(cnt)
            #if cnt > 1:
            #    exit()
