# express-sequelize-boilerplate

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

This is a simple boilerplate for building REST APIs in Node.js using Express. Intended for use with PostgreSQL using Sequelize ORM.


## Getting Started

Requires Node.js 22 or newer.

Clone the repository

```bash
git clone https://github.com/gadfaria/express-sequelize-boilerplate.git
```

Enter into the directory
```bash
cd express-sequelize-boilerplate/
```

Install the dependencies
```bash
yarn
```

Set the environment variables
```bash
cp .env.example .env
```

Running the boilerplate in development (restarts on file changes):
```bash
yarn dev
```

Running in production:
```bash
yarn start
```

## Routes

| Method | Route | Auth | Description |
| ------ | ------ | ------ | ------ |
| POST | /user | No | Sign up |
| POST | /login | No | Returns a JWT |
| GET | /logout | Yes | Revokes the current JWT |
| GET | /user | Yes | Lists users |
| GET | /user/:id | Yes | Finds a user |
| PUT | /user | Yes | Updates the logged user. Changing the password requires `oldPassword` and `confirmPassword` |
| DELETE | /user | Yes | Deletes the logged user |
| POST | /user/address | Yes | Adds an address to the logged user |
| POST | /address | Yes | Creates an address |

Authenticated routes expect the header `Authorization: Bearer <token>`. Errors are returned as `{ "type": "...", "message": "..." }`.

A Postman collection is available in `postman.json`.

## Configuration

Variables for the environment

| Option | Description |
| ------ | ------ |
| SERVER_PORT | Port the server will run on |
| NODE_ENV | development or production. Internal error messages are only returned in development |
| SERVER_JWT | true or false. When false, authenticated routes are open |
| SERVER_JWT_SECRET | JWT secret |
| SERVER_JWT_TIMEOUT | JWT duration in seconds |
| DB_DIALECT | "postgres" or "mysql" |
| DB_HOST | Database host |
| DB_PORT | Database port. Empty uses the dialect default (5432 for postgres, 3306 for mysql) |
| DB_USER | Database username |
| DB_PASS | Database password |
| DB_NAME | Database name |
| AWS_REGION | Bucket region, e.g. us-east-1 |
| AWS_KEYID | Access key ID |
| AWS_SECRETKEY | User secret key |
| AWS_BUCKET | Bucket name |

## Commands for sequelize 
```bash
# Creates the database
yarn sequelize db:create 

# Drops the database
yarn sequelize db:drop 

# Load migrations
yarn sequelize db:migrate 

# Undo migrations
yarn sequelize db:migrate:undo:all 

# Load seeders
yarn sequelize db:seed:all
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)



<h5 align="center">
  ☕ Code and Coffee
</h5>
