const Comment = require("../models/Comments");
const { responseSuccess, responseError } = require('../utils/ResponseHandle');

//getComment
const getComment = async (req, res) => {
    try {
        const comments = await Comment.find({ documentId: req.params.id }).sort({
            createdAt: -1,
        });
        res.status(200).json(comments);
    } catch (err) {
        // res.status(500).json(err)
        return responseError(res, 500, 'err', 'Lấy bình luận thất bại !!! ')
    }
}

//createCommentService
const createCommentService = async (req, res) => {
    const newComment = new Comment(req.body);
    try {
        const saveCat = await newComment.save();
        res.status(200).json(saveCat);
    } catch (err) {
        return responseError(res, 500, 'err', 'Tạo mới bình luận thất bại !!! ')
    }
}

module.exports = {
    getComment,
    createCommentService,
}
