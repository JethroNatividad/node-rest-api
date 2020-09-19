const router = require('express').Router();
const verify = require('./verifyAuthToken')

//this is a test if verify middle ware works
router.get('/', verify, (req, res) => {
    res.send(req.user)
})

module.exports = router;