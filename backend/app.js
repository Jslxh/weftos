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

app.use(cors({
  origin: "*",
  // credentials: true // Not needed for Bearer token auth, and conflicts with origin: *
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