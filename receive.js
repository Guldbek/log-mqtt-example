var amqp = require('amqplib/callback_api');

amqp.connect('amqp://guest:guest@localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }

  console.log('connected to mqtt server')
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'LogFile';

    channel.assertQueue(queue, {
      durable: true
    });

    channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
    }, {
        noAck: true
    });
  });
});