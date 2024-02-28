const express = require("express");
const router = express.Router();
const schemas = require("./schemas");
const services = require("./services");
const middle = require("../middleware");
const { pollsCollection, getDB } = require("../db/mongodb");
const { options } = require("joi");

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

router.use(middle.auth);

router.post("/", async (req, res) => {
  const { error, value } = schemas.createPollSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  value.options = value.options.map((option) => ({ option, vote: 0 }));

  const createPoll = await services.createPoll(value, options);

  res.status(201).json(createPoll);
});

router.put("/:id/vote", async (req, res) => {
  // validate body
  const { voteError } = schemas.voteSchema.validate(req.body);
  if (voteError) {
    return res.status(400).json(voteError.details);
  }

  const pollId = req.params.id;
  const selectedOption = req.body.option;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }

  const updatedPoll = await services.updatePoll(pollId, selectedOption);
  if (!updatedPoll) {
    return res.status(404).json({ error: "failed to update poll" });
  }
  res.status(200).json({ message: "poll sucessfully updated" });
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
