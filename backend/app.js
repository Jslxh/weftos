const express = require("express")
const cors = require("cors")
const app = express()
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const authorize = require("./middleware/roleMiddleware");
const workflowRoutes = require("./routes/workflowRoutes");
const protectRoute = require("./routes/protectRoute");
const userRoutes = require("./routes/userRoutes");
const workflowDefinitionRoutes = require("./routes/workflowDefinitionRoutes");
const errorHandler = require("./middleware/errorMiddleware");

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In dev, allow all if ALLOWED_ORIGINS is not set
    if (allowedOrigins.length === 0) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}))
app.use(express.json())
// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok", message: "Server is running" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/instances", workflowRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workflows", workflowDefinitionRoutes);
app.use("/api/v1/dashboard", require("./routes/dashboardRoutes"));
app.use(errorHandler);

app.get("/",(req,res)=>{
    res.json({message:"WeftOS API Running"})
})

app.get("/api/v1/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  })
})

app.use(
  "/api/v1/admin-only",
  protectRoute
)



module.exports = app