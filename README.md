# Polls API

This is a simple API for managing polls.
Polls are simply a question with a list of options to vote for (only 1 option can be picked when voting).
Polls' information is public but only authenticated users can create polls and vote.

## Development

After cloning, remember to install dependencies with `npm install`.

Add your environment variables to `.env` file (see `.env.sample` for a example).

Start server with `npm run dev`.

There is a Postman collection available: `PollsAPI.postman_collection.json`.
