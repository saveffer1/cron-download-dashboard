const router = require('express').Router();
const { requireLogin } = require('../middlewares/authMiddleware');

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/', requireLogin, (req, res) => {
  res.redirect('/dashboard/home');
});

router.get('/home', requireLogin, (req, res) => {
  res.render('home', { title: 'Home' });
});

module.exports = router;