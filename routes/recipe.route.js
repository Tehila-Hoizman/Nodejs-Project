const express = require("express");
const {getAllRecipes,getRecipeById,getRecipeByUserName,addRecipe} = require("../controllers/recipe.controller");
const { auth } = require("../middlewares/auth");

const router = express.Router();
router.get("/",getAllRecipes);
router.get("/:id",getRecipeById);
// router.get("/:name",getRecipeByUserName);
router.post("/",addRecipe);

module.exports = router;