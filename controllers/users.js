const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    // .orFail(() => {
    //   throw new Error('Пользователь по указанному _id не найден');
    // })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   res.status(400).send({ message: 'Передан некорректный _id' });
      //   return;
      // }
      // if (err.statusCode === 404) {
      //   res.status(404).send({ message: err.message });
      //   return;
      // }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message:
          'Переданы некорректные данные при создании пользователя.'
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const patchUser = (req, res) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers, getUserById, postUser, patchUser,
};
