const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error");
const colors = require("colors");
const session = require("express-session");
var cors = require("cors");
const dns = require("dns");
const os = require("os");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const products = require("./routes/products");
const auth = require("./routes/auth");
const cart = require("./routes/cart");
const user = require("./routes/user");
const post = require("./routes/post");
const orders = require("./routes/orders");
const promotion = require("./routes/promotion");
const banner = require("./routes/banner");
const categories = require("./routes/categories");
const brands = require("./routes//brands");
const rating = require("./routes/rating");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// Session

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 1000 },
  })
);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Moute routers
app.use("/api/products", products);
app.use("/api/auth", auth);
app.use("/api/cart", cart);
app.use("/api/user", user);
app.use("/api/posts", post);
app.use("/api/orders", orders);
app.use("/api/promotion", promotion);
app.use("/api/banner", banner);
app.use("/api/categories", categories);
app.use("/api/brands", brands);
app.use("/api/ratings", rating);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

module.exports = server.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.name}`.red);
  // Close server and axit process
  server.close(() => process.exit(1));
});
