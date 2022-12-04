const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const User = require('../models/user');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundErr('Пользователь по указанному _id не найден'));
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные при создании пользователя.'));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFoundErr('Пользователь по указанному _id не найден'));
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные при создании пользователя.'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, about, avatar, password: hash,
    }))
    .then((user) => {
      const userData = {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.send(userData);
    })
    .catch((err) => {
      // попытка создать дубликат уникального поля.
      if (err.code === 11000) {
        next(new ConflictErr('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

const patchUser = (req, res, next) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundErr('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные при создании пользователя.'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email, password }).select('+password')
    .then((user) => {
      if (!user) next(new NotFoundErr());
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret-code',
        { expresIn: '7d' },
      );
      res
        .cookie('access_token', token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: false, // позволит браузеру передавать куку на сторонний домен
        })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

/*
  if( !email || !password ) {
    return res.status(400).send({ message: 'Email и пароль должны быть заполнены' });
  }
  User.findOne({ email }).then((user) => {
    if (user){
      return res.status(403).send({ message: 'Что-то пошло не так на сервере' });
    }
*/

module.exports = {
  getUsers, getUserById, createUser, patchUser, login, getCurrentUser,
};
