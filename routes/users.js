const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  login, getUsers, getUserById, createUser, patchUser, getCurrentUser,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/users', getUsers);

// создаёт пользователя
router.post('/users', createUser);

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

router.post('/users/me', login);

// возвращает пользователя по _id
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.post('/users/me', login);

module.exports = router;
