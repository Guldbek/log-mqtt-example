const fs = require('fs');
const readline = require('readline');
const amqplib = require('amqplib');


// Specify the path to your log file
const logFilePath = './logfile.log';


async function start() {
    const queue = "LogFile"
    const amqpServerLink = "amqp://guest:guest@localhost"
    const connection = await amqplib.connect(amqpServerLink)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)

    
    setInterval(() => watchLogFile(channel, queue), 15000)

    console.log(`Watching log file: ${logFilePath}`);
}

start();

function watchLogFile(channel, queue) {
  // Create a readable stream to watch the log file for changes
  const stream = fs.createReadStream(logFilePath, { encoding: 'utf8', flags: 'r' });

  const rl = readline.createInterface({
    input: stream,
    output: process.stdout, // You can change this to any writable stream if needed
    terminal: false, // Disable readline's prompt
  });

    // Listen for new lines in the log file
    rl.on('line', (line) => {
        channel.sendToQueue(queue, Buffer.from(line))
    });
    // Handle errors
    rl.on('error', (err) => {
        console.error(`Error reading log file: ${err.message}`);
    });
}
