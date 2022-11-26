const User = require('../models/user');

const OK_CODE = 200;
const OK_CREATED_CODE = 201;
const ERROR_BAD_REQUEST_CODE = 400;
const ERROR_NOT_FOUND_CODE = 404;
const ERROR_INTERNAL_SERVER_CODE = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK_CODE).send({ data: users });
    })
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(OK_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(OK_CREATED_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST_CODE).send({
          message:
          'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const patchUser = (req, res) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .then((user) => res.status(OK_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers, getUserById, createUser, patchUser,
};
