const router = require('express').Router();
const {
  getUsers, getUserById, createUser, patchUser,
} = require('../controllers/users');

router.get('', getUsers); // возвращает всех пользователей
router.get('/:userId', getUserById); // возвращает пользователя по _id
router.post('', createUser); // создаёт пользователя

router.patch('/me', patchUser); // обновляет профиль
router.patch('/me/avatar', patchUser); // обновляет аватар

module.exports = router;
