const jwt = require('jsonwebtoken');

// מידלוואר שבודק את הטוקן שמגיע מהלקוח
exports.auth = (req, res, next) => {
    try {
        const { authorization } = req.headers;// חילוץ של הטוקן מההידר
        const [, token] = authorization.splite(' ');
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // מחרוזת סודית שלפיה נוצר הטוקן

        const data = jwt.verify(token, privateKey);// הנתונים שמהם נוצר הטוקן
        req.user = data;// הוספת תכונה לבקשה
        next(); // עובר לראוט/מידלוואר
    } catch (err) {
        next({ message: err, status: 401 });
    }
}
exports.authAdmin = (req, res, next) => {
    try {
        const { authorization } = req.headers;// חילוץ של הטוקן מההידר
        const [, token] = authorization.splite(' ');
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // מחרוזת סודית שלפיה נוצר הטוקן

        const data = jwt.verify(token, privateKey);// הנתונים שמהם נוצר הטוקן
        req.user = data;// הוספת תכונה לבקשה
        if (data.role == "admin")
            next(); // עובר לראוט/מידלוואר
        else
            next({ message: 'only admin can get all user', status: 403 });
    } catch (err) {
        next({ message: err, status: 401 });
    }
}