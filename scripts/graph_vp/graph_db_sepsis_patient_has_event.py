from neo4j import GraphDatabase
import pandas as pd
import datetime
import os

uri = "bolt://localhost:7687"


def link_patients_and_events(patientId):
    # https://github.com/neo4j/neo4j-python-driver/issues/67
    # https://www.quackit.com/neo4j/tutorial/neo4j_create_a_relationship_using_cypher.cfm

    driver = GraphDatabase.driver(uri, auth=("testUser", "sepsis123"))
    session = driver.session()

    qry = "MATCH (p:Patient),(e:Event) "
    qry = qry + "WHERE p.patientId = '" + patientId + "' AND e.patientId = '" + patientId + "' "
    qry = qry + "CREATE (p)-[rel:HAS]->(e) "
    print(qry)
    session.run(qry)
    session.close()

    

df = pd.read_csv("sepsis_events_patients.csv")

cnt = 1
for idx, row in df.iterrows():
    link_patients_and_events(row['patientId'])
    print(cnt)
    cnt = cnt + 1


