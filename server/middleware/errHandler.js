export const errorHandler = (err, req, res, next) => {
  console.error(err);
  next()
};
