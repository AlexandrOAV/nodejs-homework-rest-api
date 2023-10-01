import httpError from "../helpers/httpError.js";

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      let errorMessage;
      if (Object.keys(req.body).length === 0) {
        errorMessage = "missing fields";
      } else {
        errorMessage = error.details[0].message;
      }
      next(httpError(400, errorMessage));
    } else {
      next();
    }
  };
  return func;
};

export default validateBody;