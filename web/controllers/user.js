const bcrypt = require("bcrypt");
const { validationResult, body } = require("express-validator");
const db = require("../utils/db");

exports.validateUser = [
  body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long."),
  body("password").optional({ checkFalsy: true }).isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
  body("role").isIn(["admin", "viewer"]).withMessage("Invalid role."),
  body("status").isIn(["enabled", "disabled"]).withMessage("Invalid status."),
];

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;

  try {
    const usersQuery = db("users").select("id", "username", "role", "status", "created_at");
    const totalUsers = await db("users").count("id as count").first();
    const users = await usersQuery.offset((page - 1) * pageSize).limit(pageSize);

    res.json({
      users,
      pagination: {
        page,
        pageSize,
        total: totalUsers.count,
        totalPages: Math.ceil(totalUsers.count / pageSize),
      },
    });
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, role, status } = req.body;

  try {
    const existingUser = await db("users").where({ username }).first();
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [id] = await db("users").insert({ username, password_hash, role, status }).returning("id");
    res.status(201).json({ message: "User created successfully", id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { username, password, role, status } = req.body;

  try {
    const user = await db("users").where({ id }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let updateData = { username, role, status };
    if (password) {
      const saltRounds = 12;
      updateData.password_hash = await bcrypt.hash(password, saltRounds);
    }

    await db("users").where({ id }).update(updateData);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await db("users").where({ id }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
