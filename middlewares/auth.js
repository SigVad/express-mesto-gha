const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

// мидлвэр для авторизации
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith('Bearer')) {
    throw new UnauthorizedErr('Необходима авторизация'); // 401
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // верифицировать токен из заголовков
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedErr('Необходима авторизация');
  }
  // добавить пейлоуд токена в объект запроса
  req.user = payload;
  next();
};
