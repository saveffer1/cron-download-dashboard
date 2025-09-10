const router = require('express').Router();

router.get('/', (req, res) => {
    const pageData = {
        title: 'ยินดีต้อนรับ',
        message: 'นี่คือเว็บที่สร้างด้วย Express และ Pug!',
        items: ['เรียนรู้ Express', 'ฝึกเขียน Pug', 'สร้างโปรเจกต์เจ๋งๆ']
    };

    res.render('index', pageData);
});

module.exports = router;