const router = require('express').Router();
const {register, login} = require('../controllers/authController')

//routes
router.post('/register', register)
router.post("/login", login)

module.exports = router;