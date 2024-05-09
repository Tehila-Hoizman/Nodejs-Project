const express = require("express");
const {getAllRecipes,getRecipeById,addRecipe,getRecipeByUser, deleteRecipe, getRecipeBypreparationTime} = require("../controllers/recipe.controller");
const { auth, authAdminOrEditorUser } = require("../middlewares/auth");

const router = express.Router();
router.get("/",getAllRecipes);
router.get("/:id",getRecipeById);
router.get("/byTime/:time",getRecipeBypreparationTime);
router.get("/byUser/:id",getRecipeByUser);
router.post("/",auth,addRecipe);
router.delete("/:id",authAdminOrEditorUser,deleteRecipe);

module.exports = router;