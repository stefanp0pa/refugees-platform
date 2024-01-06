import pika
import json

RABBITMQ_HOST = 'localhost'

print('🐇 [Notifications] Connecting to RabbitMQ...')

connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
channel = connection.channel()

channel.queue_declare(queue='subscription_offer')
channel.queue_declare(queue='subscription_request')
channel.queue_declare(queue='offer_acceptance')
channel.queue_declare(queue='request_acceptance')

print('🐇 [Notifications] Connected to RabbitMQ!')

def subscription_request_callback(ch, method, properties, body):
    print(f"🐇 [Notifications] Received subscription REQUEST notification: {body}")
    body = json.loads(body)
    subscribers = body['subscribers']
    for subscriber in subscribers:
        print(subscriber)
        print(f"🐇 [Notifications] Sending email REQUEST {body['title']} to {subscriber}...")
        print(f"🐇 [Notifications] Email sent!")

def subscription_offer_callback(ch, method, properties, body):
    print(f"🐇 [Notifications] Received subscription OFFER notification: {body}")
    body = json.loads(body)
    subscribers = body['subscribers']
    for subscriber in subscribers:
        print(subscriber)
        print(f"🐇 [Notifications] Sending email OFFER {body['title']} to {subscriber}...")
        print(f"🐇 [Notifications] Email sent!")

def offer_acceptance_callback(ch, method, properties, body):
    print(f"🐇 [Notifications] Received offer acceptance notification: {body}")
    body = json.loads(body)
    print(f"🐇 [Notifications] Sending email to {body['offer_author']} that {body['accepter']} has accepted their offer...")
    print(f"🐇 [Notifications] Email sent!")

def request_acceptance_callback(ch, method, properties, body):
    print(f"🐇 [Notifications] Received request acceptance notification: {body}")
    body = json.loads(body)
    print(f"🐇 [Notifications] Sending email to {body['request_author']} that {body['accepter']} has accepted their help request...")
    print(f"🐇 [Notifications] Email sent!")

channel.basic_consume(queue='subscription_offer', on_message_callback=subscription_offer_callback, auto_ack=True)
channel.basic_consume(queue='subscription_request', on_message_callback=subscription_request_callback, auto_ack=True)
channel.basic_consume(queue='offer_acceptance', on_message_callback=offer_acceptance_callback, auto_ack=True)
channel.basic_consume(queue='request_acceptance', on_message_callback=request_acceptance_callback, auto_ack=True)

try:
    print('🐇 [Notifications] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()
except KeyboardInterrupt:
    print('🐇 [Notifications] Stopped consuming messages.')
    connection.close()