const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const addressSchema = new mongoose.Schema({
    city: { type: String },
    street: { type: String },
    houseNumber: { type: Number },
})
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: [8, 'password length < 8'] },
    email: { type: String, required: true, unique: true },
    address: [addressSchema],
    role: { type: String, required: true },
})
//הצפנת הסיסמה קודם השמירה במסד נתונים
// this-חובה לשלוח פונקציה רגילה ולא חץ בגלל השימוש ב
userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, +process.env.BCRYPT_SALT, async (err, hashPass) => {
        if (err)
            throw new Error(err.message);
        this.password = hashPass;
        next();
    })
})
module.exports.userSchema = userSchema;
module.exports.User = mongoose.model('users', userSchema);

// יצירת הטוקן
module.exports.generateToken = (user) => {
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // מחרוזת סודית שלפיה נוצר הטוקן
    const data = { role: user.role, user_id: user._id }; // הנתונים שרלוונטיים עבור הרשאות משתמש
    const token = jwt.sign(data, privateKey, { expiresIn: '1h' }); // יצירת הטוקן + תפוגה
    return token;
}