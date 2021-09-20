# fastify-typeorm-graphql

A backend using fastify, typeorm, mercurius and type-grapqhl with session authentication.

It has sample entities, resolver, auth midleware dataloaders, and migrations.

## Configuration

By default it uses an sqlite database for a quick start.

Rename `.env.sample` to `.env` and fill in the values to use Postgres as a database and Redis for session store.

To run the migration execute `npm run typeorm migration:run`

## `npm install` on windows

On windows either add gitbash as script-shell for npm by running

`npm config get script-shell "c:\\path\\to\\bash.exe"`

or remove

`"preinstall": "([ ! -f package-lock.json ] && npm install --package-lock-only --ignore-scripts --no-audit); npx npm-force-resolutions",`

from package.json
