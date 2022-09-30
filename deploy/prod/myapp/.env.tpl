# [debug]
DEBUG=app:*
DEBUG_COLORS=true
DEBUG_HIDE_DATE=true


# [app]
PORT=3000

APP_NAME=Luxuria
SERVICE_NAME=Chat
LOG_URL=


BASE_URL=http://localhost:8604

# [token]
JWT_SECRET_KEY=shzzzzzz
ACCESS_TOKEN_TTL=1h
REFRESH_TOKEN_TTL=10d

# [mysql2]
MYSQL_CONNECTION_STRING=mysql2://root:@localhost:3306/citizen

# [mongodb]
MONGODB_CONNECTION_STRING="mongodb://user:pass@nodeapp-mongodb-headless:27017/?authSource=admin&retryWrites=false"
MONGODB_DEFAULT_DB=database

# [rabbitmq]
RABBITMQ_VIRTUAL_HOST_NETIZEN=/
RABBITMQ_CONNECTION_URL=amqp://luxuria:p0lWahe2wube@localhost:5672/luxuria

# [neo4j]
NEO4J_CONNECTION_URL=neo4j://localhost
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=luxuria
NEO4J_MAX_CONNECTION_POOL_SIZE=2000

# [redis]
# redis modes: normal|cluster|sentinel
REDIS_MODE=normal
REDIS_PORT=6379
REDIS_HOST=redis
REDIS_PASSWORD=123123
REDIS_DB=0
REDIS_PREFIX=lx-ntz
# using for cluster|sentinel mode
REDIS_NODE_1_HOST=
REDIS_NODE_1_PORT=
REDIS_NODE_2_HOST=
REDIS_NODE_2_PORT=
# only using for sentinel mode
REDIS_SENTINEL_NAME=
REDIS_SENTINEL_PASSWORD=

# [smtp]
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_TLS=
SMTP_USERNAME=vahaha.test.1@gmail.com
SMTP_PASSWORD=ojimpzxdqldbrlko
SMTP_FROM='No-Reply - Test <vahaha.test.1@gmail.com>'