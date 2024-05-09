const express = require("express");
const {getAllCategories,getAllCategoriesWithRecipes,getCategoryById} = require("../controllers/category.controller");
const router = express.Router();
router.get("/",getAllCategories);
router.get("/withRecipes",getAllCategoriesWithRecipes);
router.get("/:id",getCategoryById);

module.exports = router;