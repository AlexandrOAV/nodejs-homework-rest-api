import { isValidObjectId } from "mongoose";
import httpError from "../helpers/httpError.js";


const isValidId = (req, res,  next)=>{
    const {id} =  req.params;
    if (!isValidObjectId(id)){
        return next(httpError(404, `${id} not valid format id `));
    }
    next();
    }

    export default isValidId;