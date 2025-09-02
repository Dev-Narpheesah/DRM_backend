require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const corsOptions = require("./config/corsOptions");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(helmet());

// Rate limit API routes
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', apiLimiter);

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
app.use("/api/disasters", require("./routes/disasterRoute"));
app.use("/api/notifications", require("./routes/notificationRoute"));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Serve basic index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 404 fallback for API
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'Not Found' });
  next();
});

// Frontend 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Error handler
const errorHandler = require('./Middleware/errorMiddleware');
app.use(errorHandler);

// Start server with Socket.IO
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
try {
  const { Server } = require('socket.io');
  const io = new Server(server, { cors: { origin: (origin, cb) => cb(null, true), credentials: true } });
  app.set('io', io);
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
  });
} catch (e) {
  console.warn('Socket.IO not initialized:', e?.message || e);
}

mongoose.connection.once("open", () => {
  console.log("Database is connected");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
