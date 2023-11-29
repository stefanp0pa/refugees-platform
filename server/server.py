from flask import Flask, Response, request
from flask.json import jsonify
import json
import pymongo
import datetime
import pika
import time
from flask_cors import CORS
from bson import json_util
import uuid

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

MONGODB_HOST = 'localhost'

# DEV_MODE = False
# RABBITMQ_HOST = 'localhost' if DEV_MODE else 'rabbitmq'
# MONGODB_HOST = 'localhost' if DEV_MODE else 'mongo-database'


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

try:
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/refugeesApp'
    mongo = pymongo.MongoClient(app.config['MONGO_URI'])
    db = mongo.refugeesApp
    mongo.server_info()
    print('✅ Succesfully connected to MongoDB!')
except Exception as e:
    print(e)
    print('❌ Error - Cannot connect to database!')
    exit()


def seed_users_from_json(db, file_path = "seed_users.json"):
    with open(file_path, 'r') as file:
        users_data = json.load(file)

    for user_data in users_data:
        existing_user = db.users.find_one({'id': user_data['id']})
        if not existing_user:
            new_user = User(**user_data)
            db.users.insert_one(new_user.__dict__)
            print(f">>> [Users] Inserted user with id {user_data['id']}.")

def seed_requests_from_json(db, file_path = "seed_requests.json"):
    with open(file_path, 'r') as file:
        requests_data = json.load(file)

    for request_data in requests_data:
        existing_req = db.requests.find_one({'id': request_data['id']})
        if not existing_req:
            new_request = Request(**request_data)
            db.requests.insert_one(new_request.__dict__)
            print(f">>> [Requests] Inserted request with id {request_data['id']}.")
            
def seed_offers_from_json(db, file_path = "seed_offers.json"):
    with open(file_path, 'r') as file:
        offers_data = json.load(file)

    for offer_data in offers_data:
        existing_offer = db.offers.find_one({'id': offer_data['id']})
        if not existing_offer:
            new_offer = Offer(**offer_data)
            db.offers.insert_one(new_offer.__dict__)
            print(f">>> [Offers] Inserted offer with id {offer_data['id']}.")

def seed_subscribers_from_json(db, file_path = "seed_subscribers.json"):
    with open(file_path, 'r') as file:
        subscribers_data = json.load(file)

    for subscriber_data in subscribers_data:
        existing_subs = db.subscribers.find_one({'authorId': subscriber_data['authorId']})
        if not existing_subs:
            new_subs = Subscriber(**subscriber_data)
            db.subscribers.insert_one(new_subs.__dict__)
            print(f">>> [Subscribers] Inserted subscribed topics for user {subscriber_data['name']}.")


seed_users_from_json(db)
seed_requests_from_json(db)
seed_offers_from_json(db)
seed_subscribers_from_json(db)

# ############################## PROFILE #####################################

@app.route('/api/login', methods=['POST'])
def login():
    try:
        payload = request.get_json()
        email = payload['email']
        password = payload['password']
        
        result = db.users.find_one({'email': email, 'password': password})
        if result:
            response = json_util.dumps(result)
            return response, 200
        return jsonify({'message': 'Login unsuccessful'}), 400
    except Exception as ex:
        print(ex)
        return Response(status=500)

@app.route('/api/register', methods=['POST'])
def register():
    try:
        payload = request.get_json()
        new_user = {
            'id': str(uuid.uuid4()),
            'name': payload['name'],
            'email': payload['email'],
            'phone': payload['phone'],
            'password': payload['password'],
            'phone': payload['phone'],
            'userType': payload['userType'],
            'group': payload['group'],
            'topics': payload['topics'],
        }
        new_subscriber = {
            'authorId': new_user['id'],
            'name': new_user['name'],
            'topics': payload['topics']
        }
            
        db.users.insert_one(new_user)
        db.subscribers.insert_one(new_subscriber)
        
        result = db.users.find_one({'email': new_user['email']})
        print(result)
        response = json_util.dumps(result)
        return response, 201
        
    except Exception as ex:
        print(ex)
        return Response(status=500)

# ############################## REQUESTS #####################################

def send_request_accept_email(request_author, accepter):
    print(f">>>> 📧 Sending email to {request_author} that {accepter} has accepted their help request...")
    print(">>>> 📧 Email sent!")

def broadcast_request(request_title, subscribers):
    print(f">>>> 📧 Broadcasting request {request_title} to subscribers...")
    for subscriber in subscribers:
        print(f">>>> 📧 Sending email to {subscriber} that a new request has been posted...")
        print(">>>> 📧 Email sent!")

# Posting a new request
@app.route('/api/requests', methods=['POST'])
def post_request():
    payload = request.get_json()
    try:
        new_request = {
            'id': str(uuid.uuid4()),
            'title': payload['title'],
            'location': payload['location'],
            'phone': payload['phone'],
            'author': payload['author'],
            'email': payload['email'],
            'group': payload['group'],
            'description': payload['description'],
            'identifiers': payload['identifiers'],
            'authorId': payload['authorId'],
            'accepted': False
        }
        db.requests.insert_one(new_request)
        
        required_topics = payload['identifiers']
        if required_topics is None or len(required_topics) == 0:
            print(">>>> There are no topics attached on this request, no subscriber will be notified!")
            return Response(status=201)
        
        user = db.users.find_one({"id": payload['authorId']})

        subscriberUserType = "refugee" if user['userType'] == "helper" else "helper"
        subscriberUsers = db.users.find({"userType": subscriberUserType})
        
        subscribers = db.subscribers.find()
        filtered_subscribers = [subscriber for subscriber in subscribers if any(topic in required_topics for topic in subscriber["topics"])]
        filtered_subscribers = [subscriber for subscriber in filtered_subscribers if any(subscriberUser['id'] == subscriber['authorId'] for subscriberUser in subscriberUsers)]
        filtered_subscribers_names = [filtered_subscriber["name"] for filtered_subscriber in filtered_subscribers]
        
        broadcast_request(payload['title'], filtered_subscribers_names)
        
        return Response(status=201)
    except Exception as ex:
        print(ex)
        return Response(status=500)

# Accept request
@app.route('/api/requests/accept', methods=['POST'])
def accept_request():
    try:
        payload = request.get_json(silent=True)
        accepter = payload['accepter']
        accepterId = payload['accepterId']
        requestId = payload['requestId']
        
        db.requests.update_one({"id": requestId}, {"$set": {"accepted": True}})
        
        requestt = db.requests.find_one({"id": requestId})
        request_author = requestt['author']
        
        send_request_accept_email(request_author, accepter)

        return Response(status=200)
    except Exception as ex:
        print(ex)
        return Response(status=500)

# Retrieve all requests
@app.route('/api/requests', methods=['GET'])
def get_requests():
    try:
        # Get all the requests from the database
        requests_cursor = db.requests.find()

        # Convert the cursor to a list and remove the '_id' field inserted by MongoDB
        requests = [{k: v for k, v in elem.items() if k != '_id'} for elem in requests_cursor]

        # Create a JSON response with the requests
        response = jsonify(requests)

        # Set the 'Access-Control-Allow-Origin' header to allow cross-origin requests
        response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)


# Retrieving request details
@app.route('/api/request-details', methods=['GET'])
def get_requests_details():
    try:
        args = request.args.to_dict()
        response = db.requests.find_one({'id': args['id']})
        response = json_util.dumps(response)
        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)


# ############################## OFFERS #######################################

def send_offer_accept_email(offer_author, accepter):
    print(f">>>> 📧 Sending email to {offer_author} that {accepter} has accepted their help offer...")
    print(">>>> 📧 Email sent!")

def broadcast_offer(offer_title, subscribers):
    print(f">>>> 📧 Broadcasting offer {offer_title} to subscribers...")
    for subscriber in subscribers:
        print(f">>>> 📧 Sending email to {subscriber} that a new offer has been posted...")
        print(">>>> 📧 Email sent!")

# Posting a new offer
@app.route('/api/offers', methods=['POST'])
def post_offers():
    payload = request.get_json()
    try:
        new_offer = {
            'id': str(uuid.uuid4()),
            'title': payload['title'],
            'location': payload['location'],
            'phone': payload['phone'],
            'author': payload['author'],
            'email': payload['email'],
            'description': payload['description'],
            'identifiers': payload['identifiers'],
            'authorId': payload['authorId'],
            'accepted': False
        }
        db.offers.insert_one(new_offer)
        
        required_topics = payload['identifiers']
        if required_topics is None or len(required_topics) == 0:
            print(">>>> There are no topics attached on this offer, no subscriber will be notified!")
            return Response(status=201)
        
        user = db.users.find_one({"id": payload['authorId']})

        subscriberUserType = "refugee" if user['userType'] == "helper" else "helper"
        subscriberUsers = db.users.find({"userType": subscriberUserType})
        
        subscribers = db.subscribers.find()
        filtered_subscribers = [subscriber for subscriber in subscribers if any(topic in required_topics for topic in subscriber["topics"])]
        filtered_subscribers = [subscriber for subscriber in filtered_subscribers if any(subscriberUser['id'] == subscriber['authorId'] for subscriberUser in subscriberUsers)]
        
        filtered_subscribers_names = [filtered_subscriber["name"] for filtered_subscriber in filtered_subscribers]
        
        broadcast_offer(payload['title'], filtered_subscribers_names)
        
        return Response(status=201)
    except Exception as ex:
        print(ex)
        return Response(status=500)

# Retrieve all offers
@app.route('/api/offers', methods=['GET'])
def get_offers():
    try:
        # Get all the offers from the database
        offers_cursor = db.offers.find()

        # Convert the cursor to a list and remove the '_id' field inserted by MongoDB
        offers = [{k: v for k, v in elem.items() if k != '_id'} for elem in offers_cursor]

        # Create a JSON response with the offers
        response = jsonify(offers)

        # Set the 'Access-Control-Allow-Origin' header to allow cross-origin requests
        response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)

# Accept offer
@app.route('/api/offers/accept', methods=['POST'])
def accept_offer():
    try:
        payload = request.get_json(silent=True)
        accepter = payload['accepter']
        accepterId = payload['accepterId']
        offerId = payload['offerId']
        
        db.offers.update_one({"id": offerId}, {"$set": {"accepted": True}})
        
        offer = db.offers.find_one({"id": offerId})
        offer_author = offer['author']
        
        send_offer_accept_email(offer_author, accepter)

        return Response(status=200)
    except Exception as ex:
        print(ex)
        return Response(status=500)

# Retrieving offer details
@app.route('/api/offer-details', methods=['GET'])
def get_offer_details():
    try:
        args = request.args.to_dict()
        response = db.offers.find_one({'id': args['id']})
        response = json_util.dumps(response)
        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)

# ############################## PROFILE ####################################

@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        args = request.args.to_dict()
        print(args['email'])
        response = db.users.find_one({'email': args['email']})
        response = json_util.dumps(response)
        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)

# ############################## MAIN #######################################
@app.route('/')
def get_message():
    return '✅ Refugees app server working!'

if __name__ == '__main__':
    app.run('0.0.0.0', port=7020, debug=True)