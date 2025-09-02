require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const corsOptions = require("./config/corsOptions");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const allowedOrigins = require("./config/allowedOrigins");
const errorHandler = require("./Middleware/errorMiddleware");

const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(xss());
app.use(mongoSanitize());

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
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
app.use("/api/notifications", require("./routes/notificationRoute"));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler should be last middleware
app.use(errorHandler);

// HTTP server + Socket.IO
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

app.set('io', io);

mongoose.connection.once("open", () => {
  console.log("Database is connected");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
