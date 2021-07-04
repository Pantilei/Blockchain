from server_python.blockchain.block import Block
from typing import ByteString
import asyncio
from aio_pika import connect, Message, ExchangeType, DeliveryMode, IncomingMessage, Channel, Exchange, Queue
from aio_pika.connection import Connection


VIRTUAL_HOST = '/%2F'


class PubSub:
    """
    Create pubsub instance using RabbinMQ,
    which is a networking pattern that exposes vaious communication channels.
    Publisher broadcasts messages on those channels and subscriber receives those messages on channels.
    """

    def __init__(self, rabbitmq_url: str, exchange_name: str) -> None:
        """Initialize Pub/Sub instance

        Args:
            rabbitmq_url (str): RabbitMQ url
            exchange_name (str): Exchange name in channel
        """
        self.rabbitmq_url = rabbitmq_url
        self.exchange_name = exchange_name
        self.exchange_type = ExchangeType.FANOUT
        self.delivery_mode = DeliveryMode.PERSISTENT
        self.connection = None
        self.channel = None
        self.exchange = None

    async def create_conection(self) -> Connection:
        """Create the connection with rabbitMQ

        Returns:
            Connection: Connection object
        """
        self.connection = await connect(self.rabbitmq_url)

        return self.connection

    async def create_channel(self) -> Channel:
        """Create the channel instance

        Returns:
            Channel: Channel instance
        """
        connection: Connection = self.connection or await self.create_conection()
        self.channel = await connection.channel()

        return self.channel

    async def create_exchange(self) -> Exchange:
        """Create the exchage instance

        Returns:
            Exchange: Exchagne instance of RabbitMQ
        """
        channel: Channel = self.channel or await self.create_channel()
        self.exchange = await channel.declare_exchange(
            self.exchange_name, self.exchange_type)

        return self.exchange

    async def publish(self, message: ByteString):
        """Publish messages on instance of exchange

        Args:
            message (ByteString): Message to be published
        """
        exchange: Exchange = await self.create_exchange()
        message: Message = Message(
            message, delivery_mode=DeliveryMode.PERSISTENT)
        await exchange.publish(message, routing_key='')

    async def listen(self):
        """Create a queue in channel and listen to it
        """
        channel: Channel = self.channel or await self.create_channel()
        await channel.set_qos(prefetch_count=1)
        exchange: Exchange = self.exchange or await self.create_exchange()
        queue: Queue = await channel.declare_queue(exclusive=True)
        await queue.bind(exchange)
        await queue.consume(self.on_message)

    async def on_message(self, message: IncomingMessage):
        """Method invoked when message is received in channel queue

        Args:
            message (IncomingMessage): Incomming message
        """
        async with message.process():
            print("Message received!!!: ", message.body)

    async def broadcast_block(self, block: Block) -> None:
        """Broadcasts the block data to all nodes in network

        Args:
            block (Block): BLock instance
        """
        await self.publish(str(block.to_json()).encode('UTF-8'))


async def main():
    pub_sub = PubSub('amqp://guest:guest@localhost:5672/%2F', 'block')
    await pub_sub.listen()


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.create_task(main())
    print(" [*] Waiting for logs. To exit press CTRL+C")
    loop.run_forever()
