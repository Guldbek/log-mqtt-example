const fs = require('fs');
const readline = require('readline');
const { AMQPClient } = require('@cloudamqp/amqp-client');

// Specify the path to your log file
const logFilePath = './logfile.log';
const queueName = 'logEvents'


async function start() {
  try {
    const amqp = new AMQPClient("amqp://guest:guest@localhost")
    const connection = await amqp.connect()
    const channel = await connection.channel()
    const queue = await channel.queue(queueName)

    setInterval(() => watchLogFile(queue), 15000)
  } catch (e) {
    console.error("ERROR", e)
    e.connection.close()
    setTimeout(run, 1000) // will try to reconnect in 1s
  }
}

start();

function watchLogFile(queue) {
  // Create a readable stream to watch the log file for changes
  const stream = fs.createReadStream(logFilePath, { encoding: 'utf8', flags: 'r' });

  const rl = readline.createInterface({
    input: stream,
    output: process.stdout, // You can change this to any writable stream if needed
    terminal: false, // Disable readline's prompt
  });

    // Listen for new lines in the log file
    rl.on('line', (line) => {
         queue.publish(line, {deliveryMode: 2})
    });
    // Handle errors
    rl.on('error', (err) => {
        console.error(`Error reading log file: ${err.message}`);
    });
}
