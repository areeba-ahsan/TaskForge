// Har async controller function ko is se wrap karenge
// Agar andar error aaye, ye automatically Express ke error handler tak bhej dega
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;