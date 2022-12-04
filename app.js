require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Сборка пакетов
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
// const defaultError = require('./middlewares/defaultError');
const { NotFoundErr } = require('./errors/NotFoundErr');

const { PORT = 3000 } = process.env;
const app = express();

/* const urlRegExp = new RegExp(
    '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$'
   ); */

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // useCreateIndex: true,
  autoIndex: true,
});

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      // avatar: Joi.string().uri().pattern(
      avatar: Joi.string().uri().regex(
        /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\.\w{2,}(\/[1-90a-z-._~:?#[@!$&'()*+,;=]{1,}\/?)?#?/i,
      ),
      email: Joi.string().required().email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use('/', usersRouter); // auth - защита авторизацией
app.use('/', cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundErr('Страница не найдена'));
});

app.use(errors());
app.use((err, req, res, next) => { // обработать ошибку сервера
  const {
    statusCode = 500,
    message = 'На сервере произошла ошибка',
  } = err;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
