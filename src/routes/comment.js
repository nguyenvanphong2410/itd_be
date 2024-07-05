const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment_controller');

router.get('/:id', commentController.getComment);
router.post('/', commentController.createComment)

module.exports = router;
