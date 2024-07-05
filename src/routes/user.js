const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.get('/all', userController.getAll);
router.get('/all_user', userController.getAllUser);
router.get('/all_officer', userController.getAllOfficer);
router.get('/all_student', userController.getAllStudent);
router.get('/all_other', userController.getAllOther);
router.get('/details/:id', userController.getDetails);
router.put('/:id', userController.update);
router.put('/updatedStatusUser/:id', userController.updateStatusUser);
router.delete('/deleteByAdmin/:id', userController.deleteByAdmin);

module.exports = router;
