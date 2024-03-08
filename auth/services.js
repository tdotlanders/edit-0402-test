const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/mongodb");

async function findUserByID(id) {
  try {
    return await db
      .getDB()
      .collection(db.usersCollection)
      .findOne({
        _id: db.toMongoID(id),
      });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function findUserByEmail(email) {
  try {
    return await db.getDB().collection(db.usersCollection).findOne({
      email: email,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function createUser(newUserData) {
  try {
    newUserData.password = await hashPassword(newUserData.password);
    const inserted = await db
      .getDB()
      .collection(db.usersCollection)
      .insertOne(newUserData);

    if (!inserted) {
      return null;
    }

    return await findUserByID(inserted.insertedId);
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function hashPassword(passwordText) {
  const salt = 10;
  return bcrypt.hash(passwordText, salt);
}

async function validatePassword(pwd, hash) {
  return bcrypt.compare(pwd, hash);
}

function generateAccessToken(userId) {
  const payload = { userId };

  return jwt.sign(payload, process.env.JWT_SECRET);
}

function validateAccessToken(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

async function incrementLoginAttempts(email) {
  try {
    await db
      .getDB()
      .collection(db.usersCollection)
      .updateOne({ email: email }, { $inc: { loginAttempts: 1 } });
  } catch (error) {
    console.log(error);
  }
}
async function resetLoginAttempts(email) {
  try {
    await db
      .getDB()
      .collection(db.usersCollection)
      .updateOne({ email: email }, { $set: { loginAttempts: 0 } });
  } catch (error) {
    console.log(error);
  }
}
async function lockAccount(email) {
  try {
    await db
      .getDB()
      .collection(db.usersCollection)
      .updateOne({ email: email }, { $set: { accountLocked: true } });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  findUserByID,
  findUserByEmail,
  validatePassword,
  createUser,
  generateAccessToken,
  validateAccessToken,
  incrementLoginAttempts,
  resetLoginAttempts,
  lockAccount,
};
