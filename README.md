
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


# Tweeter API

A brief description of what this project does and who it's for

## Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform


## Tech Stack

**Server:** NestJS, Express, GraphQL, Cloudinary, Nodemailer


## Demo

Insert gif or link to demo


## Environment Variables

To run this project, you will need to add some environment variables to your .env file, check the .env.example file to see them.


## Run Locally

Clone the project

```bash
  git clone https://github.com/iankakaruzia/tweeter-api.git
```

Go to the project directory

```bash
  cd tweeter-api
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn start:dev
```


## Running Tests

To run tests, run the following command

```bash
  yarn test
```


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Acknowledgements

 - [devChallenges](https://devchallenges.io/challenges/rleoQc34THclWx1cFFKH)

## License

[MIT](https://github.com/iankakaruzia/tweeter-api/blob/main/LICENSE)


## Authors

- [@iankakaruzia](https://www.github.com/iankakaruzia)

