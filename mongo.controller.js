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

class Order {
  constructor(userId, productName, quantity) {
    this.userId = userId;
    this.productName = productName;
    this.quantity = quantity;
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

// Create a new order document in the database
async function createOrder(order) {
  try {
    const collection = db.collection('orders');
    const result = await collection.insertOne(order);
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

// Retrieve all order documents from the database
async function getAllOrders() {
  try {
    const collection = db.collection('orders');
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

// Retrieve an order document by ID
async function getOrderById(orderId) {
  try {
    const collection = db.collection('orders');
    const result = await collection.findOne({ _id: orderId });
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

// Retrieve orders by user ID
async function getOrdersByUserId(userId) {
  try {
    const collection = db.collection('orders');
    const result = await collection.find({ userId: userId }).toArray();
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

// Update an order document in the database
async function updateOrder(orderId, updates) {
  try {
    const collection = db.collection('orders');
    const result = await collection.updateOne({ _id: orderId }, { $set: updates });
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

// Delete an order document from the database
async function deleteOrder(orderId) {
  try {
    const collection = db.collection('orders');
    const result = await collection.deleteOne({ _id: orderId });
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

// Retrieve the count of order documents in the database
async function getOrderCount() {
  try {
    const collection = db.collection('orders');
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

// Retrieve order documents by product name
async function getOrdersByProductName(productName) {
  try {
    const collection = db.collection('orders');
    const result = await collection.find({ productName: productName }).toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}
// Aggregate orders by product name
async function aggregateOrdersByProductName() {
  try {
    const collection = db.collection('orders');
    const result = await collection.aggregate([
      { $group: { _id: "$productName", count: { $sum: 1 } } }
    ]).toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Distinct values of a field in the users collection
async function distinctUsersField(fieldName) {
  try {
    const collection = db.collection('users');
    const result = await collection.distinct(fieldName);
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Find a user document using a filter
async function findUser(filter) {
  try {
    const collection = db.collection('users');
    const result = await collection.findOne(filter);
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Find multiple user documents using a filter
async function findUsers(filter) {
  try {
    const collection = db.collection('users');
    const result = await collection.find(filter).toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Find and update a user document
async function findAndUpdateUser(filter, updates) {
  try {
    const collection = db.collection('users');
    const result = await collection.findOneAndUpdate(filter, { $set: updates });
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Find and delete a user document
async function findAndDeleteUser(filter) {
  try {
    const collection = db.collection('users');
    const result = await collection.findOneAndDelete(filter);
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Create an index on a field in the users collection
async function createIndexOnUsersField(fieldName) {
  try {
    const collection = db.collection('users');
    const result = await collection.createIndex(fieldName);
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Create a unique index on a field in the users collection
async function createUniqueIndexOnUsersField(fieldName) {
  try {
    const collection = db.collection('users');
    const result = await collection.createIndex(fieldName, { unique: true });
    return result;
  } catch (err) {
    console.log(err);
  }
}

// Drop an index on a field in the users collection
async function dropIndexOnUsersField(fieldName) {
  try {
    const collection = db.collection('users');
    const result = await collection.dropIndex(fieldName);
    return result;
  } catch (err) {
    console.log(err);
  }
}
