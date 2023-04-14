// TODO: setup .env
module.exports = updateMongoDb = async (curr_ip) => {
  // put your mongo url here
  let mongodb_uri;
  const { MongoClient } = require("mongodb");
  const client = new MongoClient(mongodb_uri);

  await client.connect();
  const db = client.db("IP");
  const collection = db.collection("IP");
  const filter = {};
  const update_doc = {
    $set: {
      IP: curr_ip,
    },
  };
  console.log(await collection.updateOne(filter, update_doc));
  client.close();
};

if (require.main === module) {
  updateMongoDb("1.2.3.6");
}
