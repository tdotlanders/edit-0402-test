const db = require("../db/mongodb");

async function getPollById(pollId) {
  try {
    return await db
      .getDB()
      .collection(db.pollsCollection)
      .findOne({ _id: db.toMongoID(pollId) });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAllPolls() {
  try {
    return await db.getDB().collection(db.pollsCollection).find({}).toArray();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createPoll(value) {
  try {
    return await db.getDB().collection(db.pollsCollection).insertOne(value);
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function updatePoll(pollId, selectedOption) {
  try {
    return await db
      .getDB()
      .collection(db.pollsCollection)
      .updateOne(
        {
          _id: db.toMongoID(pollId),
          "options.option": selectedOption,
        },
        { $inc: { [`options.$.votes`]: 1 } }
      );
  } catch (error) {
    console.log("Error updating poll", error);
    return updatePoll;
  }
}

async function deletePollById(pollId) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .deleteOne({ _id: db.toMongoID(pollId) });

    return result.deletedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getPollById,
  createPoll,
  getAllPolls,
  updatePoll,
  deletePollById,
};
