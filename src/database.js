
Database = require('arangojs').Database;

db = new Database('http://127.0.0.1:8529');
db.useDatabase('dump');
db.useBasicAuth('root', process.argv[2]);

module.exports = db;

module.exports.createPOLARDocument = async(postcode, quintile) => {
  const collection = db.collection('polarPostcodes');

  return await collection.save({
    _key: postcode,
    quintile
  });
};

