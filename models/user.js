const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');
const bcrypt = require('bcryptjs');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

// схема
const userSchema = new mongoose.Schema({
  name: { // имя
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: { // информация
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: { // аватарка
    type: String,
    validate: {
      validator: (link) => isURL(link),
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

function findUserByCredentialsFunc(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedErr('Некорректный Email или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedErr('Некорректный Email или пароль');
          }
          return user;
        });
    });
}

// проверка почты на уровне схемы
userSchema.statics.findUserByCredentials = findUserByCredentialsFunc;

// модель
module.exports = mongoose.model('user', userSchema);
