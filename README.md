# learn-to-deno-two-api

Based on Beyond Fireship's
[Does Deno 2 really uncomplicate JavaScript?](https://www.youtube.com/watch?v=8IHhvkaVqVE)
video to create a simple CRUD api in deno 2.

## Getting Started

In development, run `deno run watch` to run the server and reload on file
changes.

Server runs on **http://localhost:8000**

- GET /birds - read all birds
- GET /birds/<name> - read single bird
- POST /birds - create bird, include {name: <name>}

to be added

- PUT /birds/<name> update bird, include ??
- DELETE /birds/<name> delete bird

Use `deno run sample` to add additional data.
