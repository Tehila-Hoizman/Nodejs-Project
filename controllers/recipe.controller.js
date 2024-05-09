const mongoose = require('mongoose');
const { Recipe } = require("../models/recipe.model");
const { Category } = require('../models/category.model');

exports.getAllRecipes = async (req, res, next) => {
    let { search, page, perPage } = req.query;
    search ??= '';
    page ??= '';
    perPage ??= '';

    try {
        const recipes = await Recipe.find({ name: new RegExp(search) })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
}
exports.getRecipeById = (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    else
        Recipe.findById(id, { __v: false })
            .then(r => {
                res.json(r);
            })
            .catch(err => {
                next({ message: 'recipe not found', status: 404 })
            })
}
exports.getRecipeByUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        const recipes = await Recipe.find({ "user._id": id })
            .select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
};
exports.getRecipeBypreparationTime = async (req, res, next) => {
    const time = req.params.time;
    try {
        const recipes = await Recipe.find({ preparationTimeInMinute: { $lte: time } })
            .select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
}
exports.addRecipe = async (req, res, next) => {
    try {
        const r = new Recipe(req.body);
        await r.save(); // מנסה לשמור במסד נתונים
        //מעבר על רשימת הקטגוריות
        r.categories.forEach(async c => {
            // בדיקה על כל קטגוריה האם קיימת כבר
            let category = await Category.findOne({ name: c })
            // במידה ולא מוסיף קטגוריה
            if (!category) {
                try {
                    const newCategory = new Category({ name: c, recipes: [] });
                    await newCategory.save(); // מנסה לשמור במסד נתונים
                    category = newCategory;
                } catch (err) {
                    next(err);
                }

            }
            //מוסיף את המתכון לרשימת מתכונים של הקטגוריה
            category.recipes.push({ _id: r._id, name: r.name })
            await category.save(); // מנסה לשמור במסד נתונים

        });
        return res.status(201).json(r); // כאן יהיו כל הנתונים של האוביקט שנשמר במ"נ
    } catch (err) {
        next(err);
    }

}
exports.updateRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    try {
        const r = await Recipe.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true } // החזרת האוביקט החדש שהתעדכן
        )
        return res.json(r);
    } catch (error) {
        next(error)
    }
};
exports.deleteRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' });
    else {
        try {
            //המתכון המבוקש למחוק
            let r = await Recipe.findById(id);
            if (!r)
                return next({ message: 'recipe not found!!!', status: 404 })
            //מעבר על קטגוריות המתכון
            r.categories.forEach(async c => {
                try {
                    //הסרת המתכון מהקטגוריה
                    await Category.updateOne(
                        { name: c },
                        { $pull: { recipes: { _id: r._id } } }
                    );
                    //הקטגוריה
                    let category = await Category.findOne({ name: c }).then(c => {
                        return c;
                    })
                        .catch(err => {
                            next({ message: 'recipe not found', status: 404 })
                        });
                    //בדיקה אם נותרו עוד מתכונים בקטגוריה ומחיקה אם לא
                    if (category.recipes.length === 0)
                        await Category.findByIdAndDelete(category._id);
                } catch (err) {
                    return next(err);
                }
            });
            await Recipe.findByIdAndDelete(id);
            return res.status(204).send();
        } catch (err) {
            return next(err);
        }
    }
}