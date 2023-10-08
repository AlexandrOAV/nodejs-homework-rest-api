export const handleMongooseError = (error, data, next) => {
    error.status = 400;
    next(error);
  };

  export function runValidationAtUpdate (next) {
    this.options.runValidator =  true;
    this.options.new = true;
    next();
  }
  
