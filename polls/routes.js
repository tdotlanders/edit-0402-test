const express = require("express");
const router = express.Router();
const schemas = require("./schemas");
const services = require("./services");
const { pollsCollection } = require("../db/mongodb");

router.get("/", async (req, res) => {
  const polls = await services.getAllPolls();
  res.status(200).json(polls);
});

router.get("/:id", async (req, res) => {
  const pollId = req.params.id;
  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }
  res.status(200).json(poll);
});

router.post("/", async (req, res) => {
  const { error, value } = schemas.createPollSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  const db = await getDb();

  const insertRes = await db.collection(pollsCollection).insertOne(value);

  const result = await services.getPollById(insertRes.insertedId);

  res.status(201).json(result);
});

router.delete("/:id", async (req, res) => {
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }

  const deleted = await services.deletePollById(pollId);
  if (!deleted) {
    return res.status(500).json({ error: "failed to delete poll" });
  }

  res.status(200).json({ message: "poll deleted successfully" });
});

module.exports = router;
