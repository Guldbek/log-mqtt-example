# Simple File Reader AMQP to WS
It reads data from a file stream and serves it to RabbitMQ through AMQP, a relay is running that transforms the data to WS


## Setup
### Yarn: `yarn install`
### Docker: `docker-compose up`
### Start the file reader: `yarn index.js`
### Start the web server `yarn dev`