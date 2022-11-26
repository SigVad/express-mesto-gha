const mongoose = require('mongoose');
// схема
const userSchema = new mongoose.Schema({
  name: { // имя пользователя, строка от 2 до 30 символов, обязательное поле;
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: { // информация о пользователе, строка от 2 до 30 символов, обязательное поле;
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: { // ссылка на аватарку, строка, обязательное поле.
    type: String,
    required: true,

  },
});

// модель
module.exports = mongoose.model('user', userSchema);
