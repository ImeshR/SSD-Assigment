import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// Route imports
import customerRouter from "./routes/Customer/customer.js";
import manageListingRouter from "./routes/LandLord/Listings/ManageListings.js";
import authRouter from "./routes/Auth/auth.js";
import blogRouter from "./routes/Blog/blog.js";
import problemsRouter from "./routes/SupportCenter/Problems/ManageProblems.js";
import lawyerRouter from "./routes/Lawyer/lawyer.js";
import managefurnitureRouter from "./routes/Showroom/Furniture/ManageFurniture.js";
import manageshowroomRouter from "./routes/Showroom/Create_Showroom/ManageShowroom.js";
import userRouter from "./routes/Usermanage/UserList.js";
import manageVehicleRouter from "./routes/Vehicle/ManageVehicle.js";
import bookingRouter from "./routes/Booking/Booking.js";
import cardDetailsRouter from "./routes/Payment/Cards.js";
import reservationDetailRouter from "./routes/Payment/Reservations.js";

import { authenticateUser } from "./middleware/authMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7070;

// Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(compression()); // Compresses response bodies
app.use(cors()); // Configure CORS as needed
app.use(express.json({ limit: "10mb" })); // Replaces bodyParser.json() with a size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/customer", authenticateUser, customerRouter);
app.use("/card", authenticateUser, cardDetailsRouter);
app.use("/reservation", authenticateUser, reservationDetailRouter);
app.use("/api/manageListings", authenticateUser, manageListingRouter);
app.use("/api/Furniture", managefurnitureRouter);
app.use("/api/Showroom", manageshowroomRouter);
app.use("/api/landlordinfo", manageListingRouter);
app.use("/api/blog", blogRouter);
app.use("/api/problems", authenticateUser, problemsRouter);
app.use("/api/lawyer", lawyerRouter);
app.use("/api/userr", userRouter);
app.use("/api/vehi", manageVehicleRouter);
app.use("/api/bookingVehicle", authenticateUser, bookingRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || "An unexpected error occurred",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});
