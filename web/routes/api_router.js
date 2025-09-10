const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});

module.exports = router;