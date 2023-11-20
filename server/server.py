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

# firebase_config = {
#     "apiKey": "AIzaSyDYe4KcRYqda6X2mNSP_Vg1S0DdIYxUB5g",
#     "authDomain": "idp-pweb.firebaseapp.com",
#     "databaseURL": "https://idp-pweb-default-rtdb.europe-west1.firebasedatabase.app",
#     "projectId": "idp-pweb",
#     "storageBucket": "idp-pweb.appspot.com",
# }

# firebase = pyrebase.initialize_app(firebase_config)
# auth = firebase.auth()

#             'id': str(uuid.uuid4()),
#             'name': profile_payload['name'],
#             'email': profile_payload['email'],
#             'phone': profile_payload['phone'],
#             'userType': profile_payload['userType'],
#             'group': profile_payload['group'],
#             'createdAt': datetime.datetime.now(),

class User:
    def __init__(self, id, name, email, password, phone, userType, group):
        self.__dict__.update(locals())
        del self.__dict__['self']

class Request:
    def __init__(self, id, title, location, phone, author, email, group, description, identifiers, authorId):
        self.__dict__.update(locals())
        del self.__dict__['self']

class Offer:
    def __init__(self, id, title, location, phone, author, email, description, identifiers, authorId):
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

########################### RABBIT MQ #####################################

# def publish_verify_email(email, idToken):
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
#     channel = connection.channel()
#     channel.queue_declare(queue='verify_email_queue', durable=True)
#     channel.basic_publish(
#         exchange='',
#         routing_key='verify_email_queue',
#         body=json.dumps({'email': email, 'idToken': idToken}),
#         properties=pika.BasicProperties(
#             delivery_mode=2,  # make message persistent
#         ))
#     connection.close()
#     return '  [x] Publishing verification email for %s' % email

# def publish_reset_password(email):
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
#     channel = connection.channel()
#     channel.queue_declare(queue='reset_password_queue', durable=True)
#     channel.basic_publish(
#         exchange='',
#         routing_key='reset_password_queue',
#         body=email,
#         properties=pika.BasicProperties(
#             delivery_mode=2,  # make message persistent
#         ))
#     connection.close()
#     return '  [x] Publishing reset password for %s' % email

# @app.route('/add-job/<cmd>')
# def add(cmd):
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST)) 
#     channel = connection.channel()
#     channel.queue_declare(queue='task_queue', durable=True)
#     channel.basic_publish(
#         exchange='',
#         routing_key='task_queue',
#         body=cmd,
#         properties=pika.BasicProperties(
#             delivery_mode=2,  # make message persistent
#         ))
#     connection.close()
#     return " [x] Sent: %s" % cmd

# ############################## PROFILE #####################################

# @app.route('/api/update-profile', methods=['POST'])
# def update_profile():
#     updateData = request.json()
#     profile_payload = request.get_json()
#     jwtToken = request.headers.get('Authorization')
#     try:
#         user = db.profiles.find_one_and_replace({'email': updateData['email']}, profile_payload)
#         return jsonify({'message: ': 'Update profile was succesful'}), 200
#     except Exception as e:
#         print(e)

#     return jsonify({'message: ': 'Profile updated'}), 200

# @app.route('/api/reset-password', methods=['POST'])
# def reset_password():
#     email = request.get_json()['email']
#     publish_reset_password(email)
#     return jsonify({'message: ': 'Password reset email sent'}), 200

# @app.route('/api/profile', methods=['GET'])
# def get_profile():
#     args = request.args
#     args = args.to_dict()
#     jwtToken = request.headers.get('Authorization')
#     print('Getting profile details...')
#     try:
#         response = db.profiles.find_one({"email": args['email']})
#         response = json_util.dumps(response)
#         return response, 200
#     except Exception as e:
#         print(e)
#         return jsonify({'message': 'Error getting profile information'}), 400

# @app.route('/api/profile', methods=['POST'])
# def post_profile():
#     profile_payload = request.get_json()
#     jwtToken = request.headers['Authorization']
#     try:
#         profile = {
#             'id': str(uuid.uuid4()),
#             'name': profile_payload['name'],
#             'email': profile_payload['email'],
#             'phone': profile_payload['phone'],
#             'userType': profile_payload['userType'],
#             'group': profile_payload['group'],
#             'createdAt': datetime.datetime.now(),
#         }
#         db.profiles.insert_one(profile)
#         publish_verify_email(profile_payload['email'], jwtToken)
#         return jsonify({'message': 'Profile created successfully'}), 201
#     except Exception as ex:
#         print(ex)
#         return jsonify({'message': 'Error creating profile'}), 400

# ############################## REQUESTS #####################################

# @app.route('/api/requests', methods=['POST'])
# def post_requests():
#     payload = request.get_json()
#     print('Posting request...')
#     try:
#         requestData = {
#             'id': str(uuid.uuid4()),
#             'title': payload['title'],
#             'subtitle': payload['subtitle'],
#             'location': payload['location'],
#             'phone': payload['phone'],
#             'author': payload['author'],
#             'group': payload['group'],
#             'description': payload['description'],
#             'identifiers': payload['identifiers'],
#             'author': payload['author']
#         }
#         db.requests.insert_one(requestData)     
#         return Response(status=201)
#     except Exception as ex:
#         print(ex)
#         return Response(status=409)

# @app.route('/api/requests', methods=['GET'])
# def get_requests():
#     print('Getting requests...')
#     try:
#         # get all the offers from the database
#         data = list(db.requests.find())

#         # remove the '_id' field inserted by mongoDB 
#         for elem in data:
#             elem.pop('_id', None)

#         response = jsonify(data)
#         response.headers.add('Access-Control-Allow-Origin', '*')

#         return response, 200
#     except Exception as ex:
#         print(ex)
#         return Response(status=500)

# @app.route('/api/request-details', methods=['GET'])
# def get_request_details():
#     args = request.args
#     args = args.to_dict()
#     try:
#         response = db.requests.find_one({'id': args['id']})
#         response = json_util.dumps(response)
#         return response, 200
#     except Exception as ex:
#         print(ex)
#         return Response(status=500)

# ############################## FAVORITES ####################################

# @app.route('/api/favorites', methods=['POST'])
# def post_favorite():
#     payload = request.get_json()
#     print("Marking favorite...")
#     try:
#         favorite = {
#             'id': str(uuid.uuid4()),
#             'postId': payload['postId'],
#             'profileId': payload['profileId']
#         }
#         db.favorites.insert_one(favorite)    
#         return Response(status=201)
#     except Exception as ex:
#         print(ex)
#         return Response(status=409)

# @app.route('/api/favorites', methods=['DELETE'])
# def delete_favorite():
#     print("Deleting favorite...")
#     payload = request.get_json()
#     try:
#         deleteItem = {
#             'postId': payload['postId'],
#             'profileId': payload['profileId']
#         }
#         db.favorites.delete_one({
#             "postId": deleteItem['postId'], 
#             "profileId": deleteItem['profileId']})

#         return Response(status=200)
#     except Exception as ex:
#         print(ex)
#         return Response(status=500)

# @app.route('/api/favorites', methods=['GET'])
# def get_favorites():
#     print('Getting favorites...')
#     try:
#         # get all the offers from the database
#         data = list(db.favorites.find())

#         # remove the '_id' field inserted by mongoDB 
#         for elem in data:
#             elem.pop('_id', None)

#         response = jsonify(data)
#         response.headers.add('Access-Control-Allow-Origin', '*')

#         return response, 200
#     except Exception as ex:
#         print(ex)
#         return Response(status=500)

# ############################## OFFERS #######################################

# @app.route('/api/offers', methods=['POST'])
# def post_offers():
#     payload = request.get_json()
#     print('Posting offer...')
#     try:
#         offer = {
#             'id': str(uuid.uuid4()),
#             'title': payload['title'],
#             'subtitle': payload['subtitle'],
#             'location': payload['location'],
#             'phone': payload['phone'],
#             'interval': payload['interval'],
#             'description': payload['description'],
#             'identifiers': payload['identifiers'],
#             'author': payload['author']
#         }
#         db.offers.insert_one(offer) 
#         return Response(status=201)
#     except Exception as ex:
#         print(ex)
#         return Response(status=400)

# @app.route('/api/offers', methods=['GET'])
# def get_offers():
#     print('Getting offers...')
#     try:
#         # get all the offers from the database
#         data = list(db.offers.find())

#         # remove the '_id' field inserted by mongoDB 
#         for elem in data:
#             elem.pop('_id', None)

#         response = jsonify(data)
#         response.headers.add('Access-Control-Allow-Origin', '*')

#         return response, 200
#     except Exception as ex:
#         print(ex)
#         return Response(status=500)

# @app.route('/api/offers/<int:id>', methods=['PUT'])
# def put_offer(id):
#     # get payload from request
#     payload = request.get_json(silent=True)

#     try:
#         dbResponse = db.offers.update_one(
#             {"id": id},
#             {"$set": {
#                 'favorite': payload['favorite']
#             }}
#         )

#         return Response(status=200)
#     except Exception as ex:
#         print(ex)
#         return Response(status=409)

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
    return '✅ Refugees app server working!'

if __name__ == '__main__':
    app.run('0.0.0.0', port=7020, debug=True)