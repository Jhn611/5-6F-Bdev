const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger документация
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API для управления задачами",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["openapi.yaml"], // укажите путь к файлам с аннотациями
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware для парсинга JSON
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Разрешает все домены
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Массив для хранения товаров
let products = [
  {
    id: "1",
    name: "Гарнитура HyperX",
    price: 8000,
    description: "Игровая гарнитура с качественным звуком",
    categories: ["Компьютеры", "Аксессуары"],
  },
  {
    id: "2",
    name: "Клавиатура Razer",
    price: 12000,
    description: "Механическая клавиатура с подсветкой",
    categories: ["Компьютеры", "Клавиатуры"],
  },
  {
    id: "3",
    name: "Мышь Logitech",
    price: 5000,
    description: "Беспроводная игровая мышь",
    categories: ["Компьютеры", "Мыши"],
  },
];

// Получить список товаров
app.get("/products", (req, res) => {
  res.json(products);
});

// Создать новую задачу
app.post("/products", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Получить задачу по ID
app.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id == productId);
  if (product) {
    const { name, price, category } = req.body;
    product.name = name !== undefined ? name : product.name;
    product.price = price !== undefined ? price : product.price;
    product.category = category !== undefined ? category : product.category;
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === productId);
  if (index !== -1) {
    products.splice(index, 1);
    res.status(204).send(); // Код 204: Нет контента (успешное удаление)
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:", PORT);
});
