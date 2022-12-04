const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const validator = require('validator');

// схема
const userSchema = new mongoose.Schema({
  name: { // имя
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: { // информация
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: { // аватарка
    type: String,
    required: true,
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: 'Некорректная ссылка',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',

  },
  email: { // почта
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Некорректный Email',
    },
  },
  password: { // пароль
    type: String,
    required: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

// модель
module.exports = mongoose.model('user', userSchema);
