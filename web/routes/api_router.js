const router = require('express').Router();
const path = require('path');
const corsConfig = require('../middlewares/cors_config');

const { requireLogin } = require("../middlewares/authMiddleware");
const { adminAuth } = require("../middlewares/adminAuthMiddleware");

// Controllers
const profileController = require("../controllers/profile");
const userController = require("../controllers/user");

router.use(corsConfig);

router.get('/', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});

router.post('/profile/change-password', requireLogin, profileController.changePassword);

// User Management (Admin Only).
router.get('/users', requireLogin, adminAuth, userController.getAllUsers);
router.post('/users', requireLogin, adminAuth, userController.validateUser, userController.createUser);
router.put('/users/:id', requireLogin, adminAuth, userController.validateUser, userController.updateUser);
router.delete('/users/:id', requireLogin, adminAuth, userController.deleteUser);

router.get("/secure-data", requireLogin, (req, res) => {
  res.json({ secret: "This is protected data" });
});

module.exports = router;
