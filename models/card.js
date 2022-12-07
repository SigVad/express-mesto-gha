const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./user');

// схема
const cardSchema = new mongoose.Schema({
  name: { // имя карточки, строка от 2 до 30 символов, обязательное поле
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: { // ссылка на картинку, строка, обязательное поле.
    type: String,
    required: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Поле "link" должно быть валидным url-адресом.',
    },
  },
  owner: { // ссылка на модель автора карточки, тип ObjectId, обязательное поле;
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  likes: [{ //  список лайкнувших пост пользователей, массив ObjectId, по умолчанию — пустой массив
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: User,
  }],
  createdAt: { // дата создания, тип Date, значение по умолчанию Date.now
    type: Date,
    default: Date.now,
  },
});

// модель
module.exports = mongoose.model('card', cardSchema);
