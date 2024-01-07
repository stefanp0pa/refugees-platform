import json
import pymongo
import uuid

MONGODB_HOST = 'localhost'

class User:
    def __init__(self, id, name, email, password, phone, userType, group):
        self.__dict__.update(locals())
        del self.__dict__['self']

class Request:
    def __init__(self, id, title, location, phone, author, email, group, description, identifiers, authorId, accepted):
        self.__dict__.update(locals())
        del self.__dict__['self']

class Offer:
    def __init__(self, id, title, location, phone, author, email, description, identifiers, authorId, accepted):
        self.__dict__.update(locals())
        del self.__dict__['self']

class Subscriber:
    def __init__(self, authorId, name, topics):
        self.__dict__.update(locals())
        del self.__dict__['self']

def seed_users_from_json(db, file_path = "seed_users.json"):
    with open(file_path, 'r') as file:
        users_data = json.load(file)

    db.users.delete_many({})

    for user_data in users_data:
        new_user = User(**user_data)
        db.users.insert_one(new_user.__dict__)
        print(f">>> [Users] Inserted user with id {user_data['id']}.")

def seed_requests_from_json(db, file_path = "seed_requests.json"):
    with open(file_path, 'r') as file:
        requests_data = json.load(file)

    db.requests.delete_many({})

    for request_data in requests_data:
        new_request = Request(**request_data)
        db.requests.insert_one(new_request.__dict__)
        print(f">>> [Requests] Inserted request with id {request_data['id']}.")
        
def seed_offers_from_json(db, file_path = "seed_offers.json"):
    with open(file_path, 'r') as file:
        offers_data = json.load(file)

    db.offers.delete_many({})

    for offer_data in offers_data:
        new_offer = Offer(**offer_data)
        db.offers.insert_one(new_offer.__dict__)
        print(f">>> [Offers] Inserted offer with id {offer_data['id']}.")

def seed_subscribers_from_json(db, file_path = "seed_subscribers.json"):
    with open(file_path, 'r') as file:
        subscribers_data = json.load(file)

    db.subscribers.delete_many({})

    for subscriber_data in subscribers_data:
        new_subs = Subscriber(**subscriber_data)
        db.subscribers.insert_one(new_subs.__dict__)
        print(f">>> [Subscribers] Inserted subscribed topics for user {subscriber_data['name']}.")


# ############################## MAIN #######################################
try:
    mongo = pymongo.MongoClient('mongodb://localhost:27017/refugeesApp')
    db = mongo.refugeesApp
    mongo.server_info()
    print('✅ [Seeder] Succesfully connected to MongoDB!')
except Exception as e:
    print(e)
    print('❌ [Seeder] Error - Cannot connect to database!')
    exit()


print("✅ [Seeder] Process working!")

seed_users_from_json(db)
seed_requests_from_json(db)
seed_offers_from_json(db)
seed_subscribers_from_json(db)