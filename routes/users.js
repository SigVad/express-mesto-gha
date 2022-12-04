const router = require('express').Router();
const {
  getUsers, getUserById, createUser, patchUser,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUserById); // возвращает пользователя по _id
router.post('/users', createUser); // создаёт пользователя

router.patch('/users/me', patchUser); // обновляет профиль
router.patch('/users/me/avatar', patchUser); // обновляет аватар

module.exports = router;

/*
6. Создайте контроллер и роут для получения информации о пользователе
Реализуйте роут:
GET /users/me - возвращает информацию о текущем пользователе
*/
/*

*/
