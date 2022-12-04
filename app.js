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
const defaultError = require('./middlewares/defaultError');
const { NotFoundErr } = require('./errors/NotFoundErr');

const { PORT = 3000 } = process.env;
const app = express();

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    emmail: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    emmail: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().url().regex(
      /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\.\w{2,}(\/[1-90a-z\-._~:?#[@!$&'()*+,;=]{1,}\/?)?#?/i,
    ),
  }),
}), createUser);

app.use('/', auth, usersRouter); // auth - защита авторизацией
app.use('/', auth, cardsRouter);

app.use('*', (req, res, next) => {
  // res.status(404).send({ message: 'Страница не найдена' });
  next(new NotFoundErr('Страница не найдена'));
});

app.use(errors());
app.use(defaultError); // обработать ошибку сервера

app.listen(PORT);
