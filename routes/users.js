const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, patchUser, getCurrentUser,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/users', getUsers);

// возвращает информацию о текущем  пользователе
router.get('/users/me', getCurrentUser);

// обновляет профиль
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

// обновляет аватар
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\.\w{2,}(\/[1-90a-z-._~:?#[@!$&'()*+,;=]{1,}\/?)?#?/i),
  }),
}), patchUser);

// возвращает пользователя по _id
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

module.exports = router;
