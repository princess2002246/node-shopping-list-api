
import express, {
  Request,
  Response,
  NextFunction
} from "express";
import { Item } from "./models/item";

const app = express();
const PORT = 3000;

app.use(express.json());

let items: Item[] = [];
let nextId = 1;

// Reusable error handler
function handleError(
  res: Response,
  status: number,
  message: string
) {
  return res.status(status).json({
    success: false,
    message
  });
}

// Validate request body
function validateItem(
  body: any,
  isUpdate = false
): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object.";
  }

  if (!isUpdate || body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      body.name.trim().length === 0
    ) {
      return "Name is required and must be a non-empty string.";
    }
  }

  if (!isUpdate || body.quantity !== undefined) {
    if (
      !Number.isInteger(body.quantity) ||
      body.quantity <= 0
    ) {
      return "Quantity must be a positive integer.";
    }
  }

  if (
    body.purchased !== undefined &&
    typeof body.purchased !== "boolean"
  ) {
    return "Purchased must be true or false.";
  }

  if (isUpdate &&
      body.name === undefined &&
      body.quantity === undefined &&
      body.purchased === undefined) {
    return "Provide at least one field to update.";
  }

  return null;
}

// GET /items - Get all items
app.get("/items", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: items
  });
});

// POST /items - Create an item

app.post("/items", (req: Request, res: Response) => {
  // Allow a single item or an array of items
  const multipleItems = Array.isArray(req.body);
  const inputItems = multipleItems ? req.body : [req.body];

  if (inputItems.length === 0) {
    return handleError(res, 400, "Provide at least one item.");
  }

  // Validate every item before adding any of them
  for (const input of inputItems) {
    const error = validateItem(input);

    if (error) {
      return handleError(res, 400, error);
    }
  }

  const newItems: Item[] = inputItems.map((input: any) => ({
    id: nextId++,
    name: input.name.trim(),
    quantity: input.quantity,
    purchased: input.purchased ?? false
  }));

  items.push(...newItems);

  return res.status(201).json({
    success: true,
    message: `${newItems.length} item(s) created successfully.`,
    data: multipleItems ? newItems : newItems[0]
  });
});


// GET /items/:id - Get one item
app.get("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return handleError(res, 400, "Invalid item ID.");
  }

  const item = items.find((item) => item.id === id);

  if (!item) {
    return handleError(res, 404, "Item not found.");
  }

  return res.status(200).json({
    success: true,
    data: item
  });
});

// PUT /items/:id - Update an item
app.put("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return handleError(res, 400, "Invalid item ID.");
  }

  const item = items.find((item) => item.id === id);

  if (!item) {
    return handleError(res, 404, "Item not found.");
  }

  const error = validateItem(req.body, true);

  if (error) {
    return handleError(res, 400, error);
  }

  if (req.body.name !== undefined) {
    item.name = req.body.name.trim();
  }

  if (req.body.quantity !== undefined) {
    item.quantity = req.body.quantity;
  }

  if (req.body.purchased !== undefined) {
    item.purchased = req.body.purchased;
  }

  return res.status(200).json({
    success: true,
    message: "Item updated successfully.",
    data: item
  });
});

// DELETE /items/:id - Delete an item
app.delete("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return handleError(res, 400, "Invalid item ID.");
  }

  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return handleError(res, 404, "Item not found.");
  }

  items.splice(index, 1);

  return res.status(204).send();
});

// Handle unknown routes
app.use((_req: Request, res: Response) => {
  return handleError(res, 404, "Route not found.");
});

// Handle malformed JSON
app.use((
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof SyntaxError && "body" in error) {
    return handleError(res, 400, "Invalid JSON request body.");
  }

  return handleError(res, 500, "Internal server error.");
});

app.listen(PORT, () => {
  console.log(`Shopping List API running at http://localhost:${PORT}`);
});
