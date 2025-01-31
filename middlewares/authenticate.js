import httpError from '../helpers/httpError.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import 'dotenv/config';



const { JWT_SECRET } = process.env


const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      next(httpError(401, "Not authorized"));
    }
    
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(id);
      if (!user || !user.token || user.token !== token) {
        throw httpError(401, "Not authorized");
      }
      req.user = user;
      
      next();
    } catch (error) {
         next(httpError(401, "Not authorized"));
    }
  };

export default authenticate;