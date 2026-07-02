const { MongoMemoryServer } = require('mongodb-memory-server');

async function run() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('MONGO_URI=' + uri);
  await mongod.stop();
}
run().catch(console.error);
