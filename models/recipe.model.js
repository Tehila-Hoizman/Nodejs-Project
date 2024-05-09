const mongoose = require('mongoose');
const layerSchema = new mongoose.Schema({
    description:{type:String},
    components:{type:[String]}
})
const userSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId},
    name:{type:String}
})
const recipeSchema = new mongoose.Schema({
    name:{type:String,required:true},
    categories:{type:[String]},
    preparationTimeInMinute:{type:Number,default:10},
    level:{type:Number,default:1,enum:[1,2,3,4,5]},
    addDate:{type:Date,default:Date.now},
    layers:{
        type:[layerSchema],
        // validate:{
        //     validator(v) {
        //         return v && v.length <1;
        //     },
        //     message: 'must have most 1 layer'
        // }
    },
    preparation:{type:[String]},
    image:{type:String},
    isDisplay:{type:Boolean},
    user:{type:userSchema}
})
module.exports.Recipe = mongoose.model('recipes',recipeSchema)