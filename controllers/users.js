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

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundErr('Пользователь по указанному _id не найден'));
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      }
      next(err);
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFoundErr('Пользователь по указанному _id не найден'));
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные пользователя'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
 // console.log('createUser');
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userData = {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };
      res.send(userData);
    })
    .catch((err) => {
      console.log(err.name);
      // попытка создать дубликат уникального поля.
      if (err.code === 11000) {
        next(new ConflictErr('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные пользователя'));
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
        next(new BadRequestErr('Переданы некорректные данные пользователя'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      if (!user) {
        next(new NotFoundErr('Некорректный Email или пароль'));
      }

      const token = jwt.sign({ _id: user._id }, 'secret-code', { expiresIn: '7d' });
      res
        .cookie('access_token', token, { httpOnly: true })
        .send({ message: 'Аутентификация прошла успешно' });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, patchUser, login, getCurrentUser,
};
