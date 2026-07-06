import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized, Please Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.body = req.body || {};
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth User Middleware Error:", error);
    res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authUser;
