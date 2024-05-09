const mongoose = require('mongoose');
const { Recipe } = require("../models/recipe.model");
const { Category } = require('../models/category.model');

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find( {}, { "_id": 1, "name": 1, }
        )
        return res.json(categories);
    } catch (error) {
        next(error);
    }
}
exports.getAllCategoriesWithRecipes = async (req, res, next) => {
    try {
        const categories = await Category.find()
            .select('-__v');
        return res.json(categories);
    } catch (error) {
        next(error);
    }
}
exports.getCategoryById = (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    else
        Recipe.findById(id, { __v: false })
            .then(r => {
                res.json(r);
            })
            .catch(err => {
                next({ message: 'category not found', status: 404 })
            })
}

