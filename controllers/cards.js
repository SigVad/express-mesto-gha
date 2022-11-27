const Card = require('../models/card');

const VALID_ERR_CODE = 400;
const NOT_FOUND_CODE = 404;
const DEFAULT_ERR_CODE = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALID_ERR_CODE).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
        return;
      }
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error();
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        res.send({ data: card });
        return;
      }
      throw new Error();
    })
    .catch((err) => {
      if (err.name === 'ValidationError'
      || (err.value && err.value.length !== 24)) { // валидация _id
        res.status(VALID_ERR_CODE).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
        return;
      }
      if (err.name === 'CastError' || err.name === 'Error') {
        res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new Error();
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError'
      || (err.value && err.value.length !== 24)) { // валидация _id
        res.status(VALID_ERR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      if (err.name === 'CastError' || err.name === 'Error') {
        res.status(NOT_FOUND_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new Error();
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError'
      || (err.value && err.value.length !== 24)) { // валидация _id
        res.status(VALID_ERR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      if (err.name === 'CastError' || err.name === 'Error') {
        res.status(NOT_FOUND_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(DEFAULT_ERR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
