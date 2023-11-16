
# Banking API

This project is a NestJS application that provides a REST API for managing bank accounts and transactions. It uses Prisma as a data access layer and Postgres as a database.


## Requirements
- Node.js v12 or higher
- Docker

## Getting Started
1. Clone the repository:
```
git clone https://github.com/mohamedadham/banking.git
```

2. Install the dependencies:
```
npm install
```

3. Copy the example environment file and update the variables:
```
cp .env.example .env
```
4. run prisma generate
```
npx prisma generate
```

5. run migrations
```
npx prisma migrate dev
```

6. Start the User Service and its dependencies using Docker Compose:

```
docker-compose up
```

The service should now be running on http://localhost:3000.



## TWILIO SMS Integration

[Sign up](https://www.twilio.com/try-twilio) for twilio and optain the token, phone number and SID


## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

### Integration testing

This project utilizes TestContainers to facilitate integration testing with Dockerized services. TestContainers allows us to easily set up and tear down containers for testing purposes, ensuring a consistent and isolated environment.

Example
To see an example of integration testing using TestContainers, refer to the src/users/users.integration.spec.ts file. 

How to Run Integration Tests

```
npm run test src/users/users.integration.spec.ts
```

### Unit testing

example for unit testing in this project are located in the src/transactions/transactions.service.spec.ts file. These tests focus on individual units of code, specifically the TransactionsService class.


## Versioning
This project utilizes [URL versionin](https://docs.nestjs.com/techniques/versioning#uri-versioning-type) for API version management. The versioning is applied at the controller level, specifically in the User Controller.

## Request Validation

In this project, we follow the practice of using Data Transfer Objects (DTOs) for request validation. DTOs help define the shape of the data expected in requests, ensuring that the incoming data is well-formed and meets the required criteria.

### Transactions DTO

For transactions, we have implemented a DTO in the `src/transactions/dtos/transaction.dto.ts` file. This DTO defines the structure of data expected when creating or updating a transaction.

## Clean Architecture

### Error Handling
The services in this project adhere to the clean architecture principles, meaning they do not directly throw HTTP errors. Instead, they throw custom errors defined in src/errors/custom-errors.ts.

These custom errors provide a more granular and domain-specific way of handling exceptional cases within the application logic.

Exception mapping to HTTP errors is handled by the CustomExceptionFilter. This filter intercepts exceptions thrown within the application and maps them to appropriate HTTP responses.

By centralizing the exception mapping, the application maintains a consistent approach to error handling, ensuring a clear separation of concerns between business logic and HTTP-specific concerns. This contributes to a more maintainable and scalable codebase.

### Dependency Inversion
In accordance with the principles of Clean Architecture, our services are designed to depend on abstractions (interfaces) rather than concrete implementations. This promotes flexibility, maintainability, and testability in our codebase.

Services leverage these interfaces, enabling us to easily switch implementations or mock repositories during testing. This decoupling of dependencies ensures a modular and maintainable architecture.

## TODOs

### Request Validations

We are in the process of enhancing our API by implementing thorough request validations using Data Transfer Objects (DTOs). This practice ensures that the data received by our endpoints adheres to the specified criteria, reducing the risk of invalid or malicious inputs.

- [ ] Complete request validations for all endpoints using DTOs (other than transactions).
- [ ] Ensure that DTOs cover edge cases and potential security vulnerabilities.

### Testing

Testing is a crucial aspect of maintaining a robust and reliable application. We follow a dual approach, including both unit testing for individual components and integration testing to verify the interactions between these components.

- [ ] Complete unit tests for services, controllers, and other individual components.
- [ ] Implement integration tests to validate the end-to-end functionality of our API 

Feel free to contribute to these efforts and ensure the stability and security of our application. For guidance on writing tests, refer to our [testing guidelines](#) in the repository.

## Contributing
If you would like to contribute to this project, please create a pull request.

## License
This project is licensed under the MIT License.

