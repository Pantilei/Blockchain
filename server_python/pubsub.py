from os import putenv
from re import M
from typing import ByteString
import asyncio

from aio_pika import channel, connect, Message, ExchangeType, DeliveryMode, IncomingMessage


async def rabbit():
    connection = await connect('amqp://guest:guest@localhost:5672/%2F')
    channel = await connection.channel()
    block_exchange = channel.declare_exchange('block', ExchangeType.FANOUT)
    message = Message(b'Test Message Block',
                      delivery_mode=DeliveryMode.PERSISTENT)
    block_exchange.publish(message, routing_key='')


class PubSub:
    def __init__(self, rabbitmq_url, exchange_name) -> None:
        self.rabbitmq_url = rabbitmq_url
        self.exchange_name = exchange_name
        self.exchange_type = ExchangeType.FANOUT
        self.delivery_mode = DeliveryMode.PERSISTENT
        self.connection = None
        self.channel = None
        self.exchange = None

    async def create_conection(self):
        self.connection = await connect(self.rabbitmq_url)

        return self.connection

    async def create_channel(self):
        connection = self.connection or await self.create_conection()
        self.channel = await connection.channel()

        return self.channel

    async def create_exchange(self):
        channel = self.channel or await self.create_channel()
        self.exchange = await channel.declare_exchange(
            self.exchange_name, self.exchange_type)

        return self.exchange

    async def publish(self, message: ByteString):
        exchange = await self.create_exchange()
        message = Message(message, delivery_mode=DeliveryMode.PERSISTENT)
        await exchange.publish(message, routing_key='')
        # await self.connection.close()

    async def listen(self):
        channel = self.channel or await self.create_channel()
        await channel.set_qos(prefetch_count=1)
        exchange = self.exchange or await self.create_exchange()
        queue = await channel.declare_queue(exclusive=True)
        await queue.bind(exchange)
        await queue.consume(self.on_message)

    async def on_message(self, message: IncomingMessage):
        async with message.process():
            print("[x] %r" % message.body)


async def main():
    pub_sub = PubSub('amqp://guest:guest@localhost:5672/%2F', 'block')
    await pub_sub.listen()


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.create_task(main())

    # we enter a never-ending loop that waits for data
    # and runs callbacks whenever necessary.
    print(" [*] Waiting for logs. To exit press CTRL+C")
    loop.run_forever()

# # credentials = pika.PlainCredentials('guest', 'guest')
# # parameters = pika.ConnectionParameters('rabbit-server-1', 5672, '/', credentials)
# parameters = pika.URLParameters('amqp://guest:guest@rabbit-server-1:5672/%2F')
# connection = pika.BlockingConnection(parameters)

# channel = connection.channel()

# channel.exchange_declare(exchange='blocks', exchange_type='fanout')

# # Publish messages
# channel.basic_publish(exchange='blocks', routing='', body='1st message')

# # Consume messages
# result: Method = channel.queue_declare(queue='', exclusive=True)
# queue_name: str = result.method.name
# channel.queue_bind(exchange='blocks', queue=queue_name)


# def callback(ch, method, properties, body):
#     print(body)


# channel.basic_consume(
#     queue=queue_name, on_message_callback=callback, auto_ack=True)

# channel.start_consuming()
