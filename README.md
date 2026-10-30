# Shopping List API

## Project Overview
The Shopping List API is a RESTful API built with Node.js, TypeScript and Express.js. It allows users to create, view, update and delete shopping list items.

## Technologies Used
- Node.js
- TypeScript
- Express.js
- REST API
- REST Client for API testing

## Shopping Item Structure
Each shopping item contains:
- `id`: A unique identifier for the item.
- `name`: The name of the shopping item.
- `quantity`: The number of items required.
- `purchased`: A Boolean value indicating whether the item has been purchased.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/items` | Retrieve all shopping items |
| POST | `/items` | Create a shopping item |
| GET | `/items/:id` | Retrieve one item by ID |
| PUT | `/items/:id` | Update a shopping item |
| DELETE | `/items/:id` | Delete a shopping item |

## Validation and Error Handling
The API validates incoming data and returns appropriate HTTP status codes:
- `200 OK`: Request completed successfully.
- `201 Created`: Shopping item created successfully.
- `204 No Content`: Item deleted successfully.
- `400 Bad Request`: Invalid input or item ID.
- `404 Not Found`: Item or route does not exist.
- `500 Internal Server Error`: Unexpected server error.

## Installation and Setup

1. Clone or download the project.
2. Open the project folder in a terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The API runs at `http://localhost:3000`.

## Build and Run

Build the TypeScript project:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

## Testing
The API was tested using the VS Code REST Client extension. The `requests.http` file contains requests for creating, retrieving, updating and deleting shopping items, as well as testing invalid input and missing items.

## Data Storage
This project uses an in-memory array to store shopping items. Data resets when the server restarts.

## Author
Princess Tau