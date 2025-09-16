
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const corsOptions = require("./config/corsOptions");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/reports", require("./routes/reportRoute"));
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));
app.use("/api/donations", require("./routes/paymentRoute"));
app.use("/api/likes", require("./routes/likeRoute"));
app.use("/api/ratings", require("./routes/ratingRoute"));
app.use("/api/comments", require("./routes/commentRoute"));
app.use("/api/notifications", require("./routes/notificationRoute"));
app.use("/api/news", require("./routes/newsRoute"));
app.use("/api/volunteer", require("./routes/volunteerRoute"));
app.use("/api/stories", require("./routes/storyRoute"));
app.use("/api/contact", require("./routes/contactRoute"));





// Alternate API endpoints for flexibility
app.use('/api/news', require('./api/news'));
app.use('/api/volunteer', require('./api/volunteer'));
app.use('/api/stories', require('./api/stories'));
app.use('/api/contact', require('./api/contact'));

// Start server
const PORT = process.env.PORT || 4000;

mongoose.connection.once("open", () => {
  console.log("Database is connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
