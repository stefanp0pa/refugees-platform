from flask import Flask, Response, request
from flask.json import jsonify
import json
import pymongo
import datetime
import pika
import time
from flask_cors import CORS
from bson import json_util

import requests
import uuid

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

MONGODB_HOST = 'localhost'

# DEV_MODE = False
RABBITMQ_HOST = 'localhost'
# MONGODB_HOST = 'localhost' if DEV_MODE else 'mongo-database'

connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
channel = connection.channel()

channel.queue_declare(queue='subscription_offer')
channel.queue_declare(queue='request_acceptance')

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


@app.before_request
def before_request():
    user_validation_endpoint = "http://localhost:7021/api/validate-user"
    if 'login' not in request.url and 'register' not in request.url and request.method == 'POST':
        try:
            response = requests.post(user_validation_endpoint, json = request.get_json(), headers = {'Content-Type': 'application/json'})
            if response.status_code == 200:
                print("Validation middleware successful!")
            else:
                return jsonify({'message': 'User validation unsuccessful'}), 400
        except Exception as ex:
            print(ex)

# ############################## OFFERS #######################################

def send_offer_accept_email(offer_author, accepter):
    print(f">>>> 📧 [Notification] Notifying {offer_author} that {accepter} has accepted their help offer...")
    channel.basic_publish(exchange='', routing_key='offer_acceptance', body=json.dumps({"offer_author": offer_author, "accepter": accepter}))    

def broadcast_offer(offer_title, subscribers):
    print(f">>>> 📧 Broadcasting offer {offer_title} to subscribers on {subscribers}")
    channel.basic_publish(exchange='', routing_key='subscription_offer', body=json.dumps({"title": offer_title, "subscribers": subscribers}))

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

# Retrieve all offers that were not accepted yet
@app.route('/api/offers', methods=['GET'])
def get_offers():
    try:
        # Get all the offers from the database
        offers_cursor = db.offers.find({"accepted": False})

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

# Retrieve all offers
@app.route('/api/offers/all', methods=['GET'])
def get_offers_all():
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


# ############################## MAIN #######################################
@app.route('/')
def get_message():
    return '✅ Refugees app OFFERS server working!'

if __name__ == '__main__':
    print('✅ Refugees app OFFERS server running!')
    app.run('0.0.0.0', port=7022, debug=True)