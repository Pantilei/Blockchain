from re import M
import pika
from pika.frame import Method

# credentials = pika.PlainCredentials('guest', 'guest')
# parameters = pika.ConnectionParameters('rabbit-server-1', 5672, '/', credentials)
parameters = pika.URLParameters('amqp://guest:guest@rabbit-server-1:5672/%2F')
connection = pika.BlockingConnection(parameters)

channel = connection.channel()

channel.exchange_declare(exchange='blocks', exchange_type='fanout')

# Publish messages
channel.basic_publish(exchange='blocks', routing='', body='1st message')

# Consume messages
result: Method = channel.queue_declare(queue='', exclusive=True)
queue_name: str = result.method.name
channel.queue_bind(exchange='blocks', queue=queue_name)


def callback(ch, method, properties, body):
    print(body)


channel.basic_consume(
    queue=queue_name, on_message_callback=callback, auto_ack=True)

channel.start_consuming()


class PubSub:
    def __init__(self) -> None:
        pass

    def publish(self):
        pass

    def broadcast_block(self, block):
        pass
