const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'หน้าหลัก',
    message: 'สวัสดีจาก Nunjucks!',
    items: ['เขียนโค้ด', 'ทดสอบระบบ', 'ดื่มกาแฟ ☕']
  });
});

module.exports = router;