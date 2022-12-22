const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

// мидлвэр для авторизации
const auth = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    next(new UnauthorizedErr('Необходима авторизация')); // 401
    return;
  }
  let payload;

  try {
    // верифицировать токен из кук
    payload = jwt.verify(token, 'secret-code');
  } catch (err) {
    next(new UnauthorizedErr('Необходима авторизация'));
    return;
  }
  // добавить пейлоуд токена в объект запроса
  req.user = payload;
  next();
};
module.exports = { auth };
