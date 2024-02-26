const express = require("express");
const router = express.Router();
const schemas = require("./schemas");
const services = require("./services");
const { pollsCollection, getDB } = require("../db/mongodb");

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

  const db = await getDB();

  const insertRes = await db.collection(pollsCollection).insertOne({
    question: value.question,
    options: value.options,
  });

  const result = await services.getPollById(insertRes.insertedId);

  res.status(201).json(result);
});

router.put("/:id", async (req, res) => {
  // validate body
  const { error } = schemas.createPollSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }

  // check poll has vote option
  const { voteError } = schemas.voteSchema.validate(req.body);
  if (voteError) {
    return res.status(400).json(voteError.details);
  }
  res.status(200).json();
});

// update poll - increment vote count

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
