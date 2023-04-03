module.exports = {
  getError(errors, propertyName) {
    try {
      return errors.mapped()[propertyName].msg;
    } catch (err) {
      return "";
    }  
  }
};