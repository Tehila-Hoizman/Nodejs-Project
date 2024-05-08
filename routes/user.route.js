const express = require("express");
const {signIn,signUp, getAllUsers} = require("../controllers/user.controller");
const { authAdmin } = require("../middlewares/auth");
const router = express.Router();

// signin - התחברות
router.post('/signin',signIn);
// signup - הרשמה
router.post('/signup',signUp);
// getAllUsers - קבלת כל המשתמשים
router.get('/',authAdmin,getAllUsers);

module.exports = router;