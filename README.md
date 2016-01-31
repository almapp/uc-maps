# UC Maps REST API

[![Build Status][ci-image]][ci-url] [![dependencies][dependencies-image]][dependencies-url] [![dev-dependencies][dev-dependencies-image]][dev-dependencies-url]

## Development

### Prerequisites

*   Node 5.3.x or newer
*   MongoDB installed and running

### Preparation

Clone this repository:

```sh
git clone https://github.com/almapp/uc-maps.git
cd uc-maps
```

Install dependencies:

```sh
npm install
```

Run:

```sh
npm run develop
```

This will start the application and will be accessible on [`http://localhost:3000/`](http://localhost:3000/).

### Test

Run test suite with:

```sh
npm test
```

## Production

### Prerequisites

*   [Docker](https://docs.docker.com/)
*   [Docker Compose](https://docs.docker.com/compose/)

### Setup

Clone this repository:

```sh
git clone https://github.com/almapp/uc-maps.git
cd uc-maps
```

Change the mapped `port` on [`docker-compose.yml`](docker-compose.yml#L4) to `80`.

Start with:

```sh
docker-compose up -d
```

See the logs with:

```sh
docker-compose logs
```

[ci-image]: https://travis-ci.org/almapp/uc-maps.svg
[ci-url]: https://travis-ci.org/almapp/uc-maps
[dependencies-image]: https://david-dm.org/almapp/uc-maps.svg
[dependencies-url]: https://david-dm.org/almapp/uc-maps
[dev-dependencies-image]: https://david-dm.org/almapp/uc-maps/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/almapp/uc-maps#info=devDependencies
