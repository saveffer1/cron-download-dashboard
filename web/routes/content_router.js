const router = require('express').Router();
const { requireLogin } = require('../middlewares/authMiddleware');
const { adminAuth } = require('../middlewares/adminAuthMiddleware');

router.get('/cronjob-section', requireLogin, (req, res) => {
  res.render('cronjob_content', {}); // Will create cronjob_content.njk later
});

router.get('/user-management-section', requireLogin, adminAuth, (req, res) => {
  res.render('user_management', {});
});

router.get('/profile-settings-section', requireLogin, (req, res) => {
  res.render('profile_settings', {});
});

router.get('/identity-management-section', requireLogin, adminAuth, (req, res) => {
  res.render('identity_management', {});
});

module.exports = router;