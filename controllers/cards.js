const Card = require('../models/card');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundErr('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        res.send({ message: 'Карточка удалена' });
        return;
      }
      throw next(new ForbiddenErr('Недостаточно прав для удаления карточки'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundErr('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundErr('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
