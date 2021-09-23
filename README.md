# BGC Safety Fall 2021

## Tech Stack

- React.js, Next.js, and MongoDB
- For linting and formatting we use eslint + prettier

## Setup

- Run `npm i` before going further

### Pulling Secrets

- Run `npm run secrets-dev` to sync development secrets from Bitwarden and save them to a local `.env` file. Contact a leadership member for the Bitwarden password.
  - **Note**: If you are using Windows, enter `npm run secrets:login` and then `npm run secrets:sync` instead of the above script.

**NEVER** commit any secrets or your `.env` file.

### MongoDB

A MongoDB server is required for this project. Pulling secrets will point your local environment to the staging MongoDB server, but it is **highly** recommended that you run your own instance of MongoDB locally.

- [Download MongoDB Community Server](https://www.mongodb.com/download-center/community)
- Go through the installation instructions.
  - Leave the port at default 27017
- (Optional but recommended) Run `npm run seed` to insert testing data into your database.
  - **Note**: the `seed` command will nuke your database!

## Running

### Development

- Run `npm run dev`
- Contact a leadership member for the test user credentials
- To understand this code better, read the [Code Tour](/CODETOUR.md).
  - This project previously used a different organizational structure, so some things will not line up.

### Production

**TODO**
