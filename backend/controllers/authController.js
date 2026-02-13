const Organization = require("../models/Organization");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register Organization + Admin
exports.register = async (req, res) => {
  try {
    const { organizationName, name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create organization
    const organization = await Organization.create({
      name: organizationName,
    });

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: "Admin",
      organizationId: organization._id,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Organization registered successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
