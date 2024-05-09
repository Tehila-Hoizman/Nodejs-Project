const express = require("express");
const {signIn,signUp, getAllUsers} = require("../controllers/user.controller");
const { authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.post('/signin',signIn);
router.post('/signup',signUp);
router.get('/',authAdmin,getAllUsers);

module.exports = router;