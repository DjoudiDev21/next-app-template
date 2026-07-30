# Auth module

The auth module follows the same dependency direction as the other business
modules:

- `domain/entities` contains provider-neutral authentication models.
- `domain/interfaces` defines repository interfaces.
- `application/dtos` defines use-case input data.
- `application/use-cases` contains class-based application actions.
- `infrastructure/repositories` contains the concrete Clerk implementations.

React composition lives in `src/providers`, while pages and forms live in
`src/app`. Clerk must not be imported outside `auth/infrastructure`.

`AuthenticatedFetchUseCase` obtains a token for each request. On a `401`, it
requests a refreshed token and retries exactly once. The external backend must
still validate authentication and authorization.
