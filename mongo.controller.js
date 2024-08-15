const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

let client;
let db;

// Connect to the MongoDB instance
MongoClient.connect(url, function(err, _client) {
  if (err) {
    console.log(err);
  } else {
    client = _client;
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  }
});

// Define the User model
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}
// Create a new user document in the database
async function createUser(user) {
  try {
    const collection = db.collection('users');
    const result = await collection.insertOne(user);
    return result.insertedId;
  } catch (err) {
    console.log(err);
  }
}
// Retrieve all user documents from the database
async function getAllUsers() {
  try {
    const collection = db.collection('users');
    const result = await collection.find().toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Retrieve a user document by ID
async function getUserById(userId) {
  try {
    const collection = db.collection('users');
    const result = await collection.findOne({ _id: userId });
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Retrieve a user document by email
async function getUserByEmail(email) {
  try {
    const collection = db.collection('users');
    const result = await collection.findOne({ email: email });
    return result;
  } catch (err) {
    console.log(err);
  }
}
// Update a user document in the database
async function updateUser(userId, updates) {
  try {
    const collection = db.collection('users');
    const result = await collection.updateOne({ _id: userId }, { $set: updates });
    return result.modifiedCount;
  } catch (err) {
    console.log(err);
  }
}
// Delete a user document from the database
async function deleteUser(userId) {
  try {
    const collection = db.collection('users');
    const result = await collection.deleteOne({ _id: userId });
    return result.deletedCount;
  } catch (err) {
    console.log(err);
  }
}
// Retrieve the count of user documents in the database
async function getUserCount() {
  try {
    const collection = db.collection('users');
    const result = await collection.countDocuments();
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Retrieve user documents by name
async function getUsersByName(name) {
  try {
    const collection = db.collection('users');
    const result = await collection.find({ name: name }).toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}
