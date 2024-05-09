const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId },
    name: { type: String },
})
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    recipes:{type:[recipeSchema]}
})

module.exports.categorySchema = categorySchema;
module.exports.Category = mongoose.model('categories', categorySchema);
