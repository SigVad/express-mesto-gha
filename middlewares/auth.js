const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

// мидлвэр для авторизации
const auth = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    next(new UnauthorizedErr('Необходима авторизация')); // 401
  }
  let payload;

  try {
    // верифицировать токен из заголовков
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(UnauthorizedErr('Необходима авторизация'));
  }
  // добавить пейлоуд токена в объект запроса
  req.user = payload;
  next();
};
module.exports = { auth };
