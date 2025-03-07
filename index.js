const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const todosRouter = require("./routes/apis");

require("dotenv").config();

//const PORT = process.env.PORT || 80;
const PORT = process.env.PORT || 443;
const HOST = process.env.HOST || "https://todolistgradstracker.azurewebsites.net";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo List API",
      version: "1.0.0",
      description: "A TodoList API",
    },
    servers: [
      {
        url: `${HOST}:${PORT}/`,
      },
    ],
  },
  apis: ["./routes/apis.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/tasks", todosRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
