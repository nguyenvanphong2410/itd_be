const CommentService = require('../services/comment_services')
const { responseSuccess, responseError } = require('../utils/ResponseHandle');


//getComment
const getComment = async (req, res) => {
  try {
    const response = await CommentService.getComment(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Lấy bình luận thất bại !!! ');
    }
  }
};

//createComment
const createComment = async (req, res) => {
    try {
      const response = await CommentService.createCommentService(req, res);
      if (!res.headersSent) {
        return res.status(200).json(response);
      }
    } catch (e) {
      if (!res.headersSent) {
        return responseError(res, 500, 'err', 'Tạo mới bình luận thất bại !!! ');
      }
    }
  };
  

module.exports = {
  getComment,
  createComment,
}