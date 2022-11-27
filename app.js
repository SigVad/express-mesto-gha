const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Сборка пакетов
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '638208ffd6ca00545679090c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
// Обработка неправильного пути
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
