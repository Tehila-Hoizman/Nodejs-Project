const bcrypt = require('bcrypt');
const { User, generateToken, userValidators } = require("../models/user.model");

exports.signIn = async (req, res, next) => {
    // const v = userValidators.login.validate(req.body);
    // if(v.error)
    //     return next({ message: v.error.message })
    // קבלת מייל וסיסמא מגוף ההודעה
    const { email, password } = req.body;

    // חיפוש משתמש עם המייל והסיסמא בדטהבייס
    const user = await User.findOne({ email });

    if (user) {
        // בדיקת סיסמא
        //השוואת הסיסמה הלא מוצפנת מגוף ההודעה לסיסמה המוצפנת מהדטהבייס
        bcrypt.compare(password, user.password, (err, same) => {
            if (err)
                return next(new Error(err.message));
            if (same) {//אם שוות
                const token = generateToken(user);
                user.password = "****";// הסתרת הסיסמא ממה שחוזר ללקוח
                return res.send({ user, token });
            }
            //תשובה כללית של לא מורשה 
            return next({ message: "Auth Failed", status: 401 })
        })
    }
    else {
        return next({ message: "Auth Failed", status: 401 })
    }

}

exports.signUp = async (req, res, next) => {
    const { username, password, email, address, role } = req.body;

    try {
        // שמירת המשתמש בדטהבייס
        const user = new User({ username, password, email, address, role });
        await user.save();//  קודם כל הולך לפעולת pre ושם מצפין את הסיסמא

        // אם הצליח להצפין - מנסה להכניס לדטהבייס

        // אם הפרטים שלו חוקיים
        // נבדק ע"י המונגוס

        const token = generateToken(user);
        user.password = "****"// הסתרת הסיסמא ממה שחוזר ללקוח
        // החזרת המשתמש
        return res.status(201).json({ user, token });
    } catch (error) {
        return next({ message: error.message, status: 409 })
    }
}

exports.getAllUsers = async(req,res,next)=>{
    try{
        const users = await User.find().select('-__v')
        return res.json(users);
    }catch (error) {
        next(error);
    }
}