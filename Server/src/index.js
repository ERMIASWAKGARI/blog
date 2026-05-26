const express = require("express");
const path = require("path");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const postRoute = require("./routes/postRoutes");
const ratingRoute = require("./routes/ratingRoute");
const userRoutes = require("./routes/userRoutes");

const cors = require("cors");
const { connectDB } = require("./connectDb");
const globalErrorHandler = require("./Controllers/errorController");
const AppError = require("./utils/appError");

const app = express();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:5173",
      "https://blog-e0l8.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: false,
  }),
);

// Configure Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// Mount other routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/rating", ratingRoute);
app.use("/api/v1/admin", adminRoutes);

// Handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Adding GlobalErrorHandler middleware
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`The server is listening on port: ${port}`);
});
