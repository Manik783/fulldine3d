const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const AdminRouter = require("./routes/admin.routes");
const DishRouter = require("./routes/dish.routes");
const ClientRouter = require("./routes/client.routes");
const MenuRouter = require("./routes/menu.routes");
const connectToDb = require("./db/db");
const cookieParser = require("cookie-parser");

connectToDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/admin", AdminRouter); // done
app.use("/dish", DishRouter);  //done (upload .glb , .usdz files)
app.use("/client", ClientRouter);
app.use("/menu", MenuRouter);

module.exports = app;
