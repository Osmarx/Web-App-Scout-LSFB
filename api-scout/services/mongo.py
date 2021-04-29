import pymongo

class MongoDBconnect():
    def mongodbConnect():
        try:
            client = pymongo.MongoClient(
            host = 'mongodb://186.64.121.79:27017', # <-- IP and port go here
            serverSelectionTimeoutMS = 3000, # 3 second timeout
            username="god",
            password="god1936",
            )
            db = client.scouts
            return db
        except:
            return print("Can't connect to DB")
          