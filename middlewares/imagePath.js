const setPath = (req, res, next) => {
  req.imagePath = `${req.protocol}://${req.get("host")}/img/`;
  next();
}

module.exports = setPath;