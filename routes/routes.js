const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { urlRegExp } = require('../utils/constants');
const { auth } = require('../middlewares/auth');
const NotFoundErr = require('../errors/NotFoundErr');
const defaultError = require('../middlewares/defaultError');
const { requestLogger, errorLogger } = require('../middlewares/logger');

router.use(requestLogger); // подключаем логгер запросов

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri().regex(urlRegExp),
      email: Joi.string().required().email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth); // защита авторизацией
router.post('/signout', (req, res) => {
  res.clearCookie('access_token').send({ message: 'Выход' });
});
router.use('/', usersRouter);
router.use('/', cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundErr('Страница не найдена'));
});

router.use(errorLogger); // подключаем логгер ошибок
router.use(errors()); // обработчик ошибок celebrate
router.use(defaultError); // обработать ошибку сервера

module.exports = router;
