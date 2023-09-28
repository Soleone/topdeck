![MIT license](https://img.shields.io/github/license/Soleone/topdeck)
![Last commit](https://img.shields.io/github/last-commit/Soleone/topdeck/main)

# Topdeck

A Remix based Podcast homepage customizable for your needs.

## Features

* Episode links
* Submit feedback and thanks page
* Login
* Admin for viewing feedback

## Live

You can test the following URLs live:

* https://topdeckpodcast.com/ displays home page

##  Pages

* `/`
* `/feedback`
* `/login`
* `/admin`

## Dependencies

* [Remix](https://remix.run) as the full stack [React](https://react.dev) framework
* [Prisma](https://prisma.io) for interacting with the database
* [Tailwind](https://tailwindcss.com) for managing CSS
* [shadcn/ui](https://ui.shadcn.com/) (radix-ui) for lightweight UI components

## Contributing

### Requirements

* [Postgres](https://www.postgresql.org) installed

### Running in development

1. `cp .env.example .env` to be able to set up environment variables
2. Open the new `.env` file and enter your database url
3. `npm install` to install all dependencies (might fail on the postinstall step in development, that's ok)
4. `npm run prisma` to prepare your database schema and generate the local Prisma client
5. `npm run dev` to run the server
6. Visit https://localhost:3000

## Deployment

Currently optimized to be deployed to Vercel.

```sh
npm run deploy
```
