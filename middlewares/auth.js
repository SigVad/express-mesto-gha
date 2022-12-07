const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

// мидлвэр для авторизации
const auth = (req, res, next) => {
  // console.log('попытка авторизации');
  const token = req.cookies.access_token;

  if (!token) {
    // console.log('нет токена');
    next(new UnauthorizedErr('Необходима авторизация')); // 401
  }
  console.log(token);
  let payload;

  try {
    // верифицировать токен из кук
    payload = jwt.verify(token, 'secret-code');
  } catch (err) {
    // console.log('не тот токен');
    next(new UnauthorizedErr('Необходима авторизация'));
  }
  // добавить пейлоуд токена в объект запроса
  req.user = payload;
  // console.log(payload);
  next();
};
module.exports = { auth };
