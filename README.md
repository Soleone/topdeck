![MIT license](https://img.shields.io/github/license/Soleone/topdeck)
![Last commit](https://img.shields.io/github/last-commit/Soleone/topdeck/main)

# Topdeck

A Remix based Podcast homepage customizable for your needs.

## Live

You can test the following URLs live:

* https://topdeckpodcast.com/ displays home page

## Features

* Episode links
* Submit feedback and thanks page
* Login
* Admin for viewing feedback

## Contributing

### Requirements

* Postgres installed

### Running in development

1. `cp .env.example .env`
2. Open `.env` and enter your database url
3. `npm install` to install all dependencies (might fail on postinstall, that's ok)
4. `npm run migrate` to prepare your database schema
5. `npm run dev` to run the server
6. Visit https://localhost:3000

## Deployment

Currently optimized to be deployed to Vercel.

```sh
npm run deploy
```
