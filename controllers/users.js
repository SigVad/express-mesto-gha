const User = require('../models/user');

const VALID_ERR_CODE = 400;
const CAST_ERR_CODE = 404;
const DEFAULT_ERR_CODE = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(() => {
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

// орфейл
const getUserById = (req, res) => {
  User.findById(req.params.userId, { runValidators: true })
    // .orFail(() => {
    //   console.log('orFail');
    //   console.log(res.statusCode);
    //   res.status(CAST_ERR_CODE);
    //   console.log(res.statusCode);
    //   throw new Error('Пользователь по указанному _id не найден');
    // })
    .then((user) => {
      //проверяем, есть ли юзер с таким ид
      if(!user) {
        throw new Error('Пользователь по указанному _id не найден');
      }
      res.send({ user });
    })
    .catch((err) => {
      console.log(err.name);
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(VALID_ERR_CODE).send({
          message:
          'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(CAST_ERR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

// ValidationError и DefaulError нужны
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALID_ERR_CODE).send({
          message:
          'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
// орФейл ловит, если не найден ValidationError и DefaulError нужны
const patchUser = (req, res) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден');
      error.status(CAST_ERR_CODE);
      throw error;
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      console.log(err.name);
      console.log(err.statusCode);
      if (err.name === 'ValidationError') {
        res.status(VALID_ERR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.statusCode === 404) {
        res.status(CAST_ERR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers, getUserById, createUser, patchUser,
};
