from neo4j import GraphDatabase
import pandas as pd
import datetime
import os

uri = "bolt://localhost:7687"




'''



for i in range(5, 100):
    print(str(i) + ": " + str(datetime.datetime.now()))
    qry = "LOAD CSV WITH HEADERS FROM 'file:///sepsis_events/sepsis_events_sorted_" + str(i) + ".csv' AS row WITH row.patientId AS patientId, row.eventId AS eventId, row.eventName as eventName, row.eventCategory as eventCategory, row.eventDate AS eventDate, row.resultValue AS resultValue, row.resultUnit as resultUnit MERGE (e:Event {eventId: eventId}) SET e.eventId = eventId, e.patientId = patientId, e.eventName = eventName, e.eventCategory = eventCategory, e.eventDate = eventDate, e.resultValue = resultValue, e.resultUnit = resultUnit RETURN count(e);"
    session.run(qry)


'''

'''
df = pd.read_csv('sepsis_events_sorted.csv')
#ds = df.sample(1000)
#df.head()

for idx, row in df.iterrows():
    qry = "CREATE (e:Event { patientId: '" + row['patientId'] + "', "
    qry = qry + "eventId: '" + row['eventId'] + "', "
    qry = qry + "eventName: '" + row['eventName'] + "', "
    qry = qry + "eventCategory: '" + row['eventCategory'] + "', "
    qry = qry + "eventDate: '" + row['eventDate'] + "', "
    qry = qry + "resultValue: '" + str(row['resultValue']) + "', "
    qry = qry + "resultUnit: '" + str(row['resultUnit']) + "' "
    qry = qry + "});"
    print(qry)
    session.run(qry)
    
    
'''

def insert_for_dataframe(df):
    driver = GraphDatabase.driver(uri, auth=("testUser", "sepsis123"))
    session = driver.session()
    for idx, row in df.iterrows():
        qry = "CREATE (e:Event { patientId: '" + row['patientId'] + "', "
        qry = qry + "eventId: '" + row['eventId'] + "', "
        qry = qry + "eventName: '" + row['eventName'] + "', "
        qry = qry + "eventCategory: '" + row['eventCategory'] + "', "
        qry = qry + "eventDate: '" + row['eventDate'] + "', "
        qry = qry + "resultValue: '" + str(row['resultValue']) + "', "
        qry = qry + "resultUnit: '" + str(row['resultUnit']) + "' "
        qry = qry + "});"
        print(qry)
        session.run(qry)
    session.close()

def link_patients_and_events(df):
    # https://github.com/neo4j/neo4j-python-driver/issues/67
    # https://www.quackit.com/neo4j/tutorial/neo4j_create_a_relationship_using_cypher.cfm

    driver = GraphDatabase.driver(uri, auth=("testUser", "sepsis123"))
    session = driver.session()
    for idx, row in df.iterrows():
        qry = "MATCH (p:Patient),(e:Event) "
        qry = qry + "WHERE p.patientId = '" + row['patientId'] + "' AND e.patientId = '" + row['patientId'] + "' "
        qry = qry + "CREATE (p)-[rel:HAS]->(e) "
        print(qry)
        session.run(qry)
    session.close()



cnt = 0
for root, dirs, files in os.walk("output_05_01_2019", topdown=False):
    for name in files:
        if 'sepsis_events_sorted' in name:
            filename = os.path.join(root, name)
            df = pd.read_csv(filename)
            print(filename)

            #insert_for_dataframe(df)
            link_patients_and_events(df)

            cnt = cnt + 1
            #if cnt > 10:
            #    exit()


