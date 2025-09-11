const router = require('express').Router();
const { requireLogin } = require('../middlewares/authMiddleware');

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/', requireLogin, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    username: req.session.username,
    role: req.session.role,
    activeTab: 'cronjob-section'
  });
});

router.get('/cronjob', requireLogin, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - Cronjob',
    username: req.session.username,
    role: req.session.role,
    activeTab: 'cronjob-section'
  });
});

const { adminAuth } = require('../middlewares/adminAuthMiddleware');

router.get('/user-management', requireLogin, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - User Management',
    username: req.session.username,
    role: req.session.role,
    activeTab: 'user-management-section'
  });
});

router.get('/profile-settings', requireLogin, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - Profile Settings',
    username: req.session.username,
    role: req.session.role,
    activeTab: 'profile-settings-section'
  });
});

router.get('/identity-management', requireLogin, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - Identity Management',
    username: req.session.username,
    role: req.session.role,
    activeTab: 'identity-management-section'
  });
});

module.exports = router;