# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Fly Setup

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

## Development

## Topdeck

Podcast homepage customizable for your needs.

## Live

You can test the following URLs live:

* https://topdeckpodcast.com redirects to external podcast site
* https://topdeckpodcast.com/home displays home page

## Features

* Redirects from root url to external podcast page of your choice (e.g. Spotify for Podcasters)
* /home displays customizable home page with embeddable episode list
* /feedback displays a Form to submit text and author to a Prisma backed database
* /thanks displays after submitting feedback

## Contributing

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.
