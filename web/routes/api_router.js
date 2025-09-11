const router = require('express').Router();
const path = require('path');
const corsConfig = require('../middlewares/cors_config');

const { requireLogin } = require("../middlewares/authMiddleware");

// Controllers
const authController = require("../controllers/auth");

router.use(corsConfig);

router.get('/', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});

router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/refresh', authController.refresh);

router.get("/secure-data", requireLogin, (req, res) => {
  res.json({ secret: "This is protected data" });
});

module.exports = router;