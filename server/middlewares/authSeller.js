import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  try {
    const token = req.cookies.sellerToken || req.cookies.token || req.headers.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized, Please Login Again" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the decoded token email matches the configured seller email or if isSeller is true
    if (decoded.email !== process.env.SELLER_EMAIL && !decoded.isSeller) {
      return res.status(403).json({ success: false, message: "Access Denied: Not a registered seller" });
    }
    
    req.body = req.body || {};
    req.body.sellerEmail = decoded.email;
    next();
  } catch (error) {
    console.error("Auth Seller Middleware Error:", error);
    res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authSeller;
