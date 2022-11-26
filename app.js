// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Сборка пакетов

const { PORT = 3000 } = process.env;
const app = express();

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '638208ffd6ca00545679090c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
});
