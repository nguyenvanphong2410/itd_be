const PostService = require('../services/post_services')
const Posts = require("../models/Post");
const { responseSuccess, responseError } = require('../utils/ResponseHandle');

//create
const create = async (req, res) => {
    console.log('frontend gui len:  ', req.body)
    try {
        const response = await PostService.createService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Tạo tài liệu thất bại !!!')
    }
}

//update
const update = async (req, res) => {
    try {
        const response = await PostService.updateService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        console.log('Lỗi update Controller', e)
        return responseError(res, 500, 'err', 'Cập nhật tài liệu thất bại !!! ')
    }
}

//updateStatusPost
const updateStatusPost = async (req, res) => {
    try {
        const response = await PostService.updateStatusPostService(req, res);
        if (!res.headersSent) {
            return res.status(200).json(response);
        }
    } catch (e) {
        console.log('Lỗi updateStatusPost Controller', e)
        if (!res.headersSent) {
            return responseError(res, 500, 'err', 'Cập nhật trang thái tài liệu thất bại !!! ')
        }
    }
}

//updateViewPost
const updateViewPost = async (req, res) => {
    try {
        const response = await PostService.updateViewPostService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        console.log('Lỗi updateViewPost Controller', e)
        return responseError(res, 500, 'err', 'Cập nhật lượt xem tài liệu thất bại !!! ')
    }
}


//getAll
const getAll = async (req, res) => {
    try {
        const response = await PostService.getAllService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu thất bại !!! ')
    }
};

//getAll
const getAllDocument = async (req, res) => {
    try {
        const response = await PostService.getAllDocumentService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu đã duyệt thất bại !!! ')
    }
};

//getAll
const getDocumentCategory = async (req, res) => {
    try {
        const response = await PostService.getDocumentCategoryService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu theo thể loại đã duyệt thất bại !!! ')
    }
};

//getDocuments
const getDocuments = async (req, res) => {
    try {
        const response = await PostService.getDocumentsService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ documents thất bại !!! ')
    }
};

//getDocumentsChecked
const getDocumentsChecked = async (req, res) => {
    try {
        const response = await PostService.getDocumentsCheckedService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ documents đã duyệt thất bại !!! ')
    }
};
//getAllDocumentNew
const getAllDocumentNew = async (req, res) => {
    try {
        const response = await PostService.getAllDocumentNewService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu mới đã duyệt thất bại !!! ')
    }
};

//getAllDocumentView
const getAllDocumentView = async (req, res) => {
    try {
        const response = await PostService.getAllDocumentViewService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu xem nhiều thất bại !!! ')
    }
};

//getAllDocumentPending
const getAllDocumentPending = async (req, res) => {
    try {
        const response = await PostService.getAllDocumentPendingService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu chờ duyệt thất bại !!! ')
    }
};

//getAllDocumentPendingOver
const getAllDocumentPendingOver = async (req, res) => {
    try {
        const response = await PostService.getAllDocumentPendingOverService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu chờ Over duyệt thất bại !!! ')
    }
};

//getAllDocumenChecked
const getAllDocumenChecked = async (req, res) => {
    try {
        const response = await PostService.getAllDocumentCheckedService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu chờ duyệt thất bại !!! ')
    }
};
//getAllDocumentName
const getAllDocumentName = async (req, res) => {
    try {
        const response = await PostService.getAllDocumentNameService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        return responseError(res, 500, 'err', 'Lấy toàn bộ tài liệu chờ duyệt thất bại !!! ')
    }
};

//getDetails
const getDetails = async (req, res) => {
    try {
        const response = await PostService.getDetailsService(req, res);
        console.log('1 Post nha', response)
        return res.status(200).json(response);
    } catch (e) {
        console.log('lỗi', e)
        return responseError(res, 500, 'err', 'Lấy một tài liệu thất bại !!! ')
    }
};

//delete
const deletePost = async (req, res) => {
    console.log('iddddd', req.params.id)
    try {
        const response = await PostService.deleteService(req, res);
        return res.status(200).json(response);
    } catch (e) {
        console.log('lỗi xóa tài liệu', e)
        return responseError(res, 500, 'err', 'Xóa tài liệu thất bại !!! ')
    }
}

module.exports = {
    create,
    update,
    updateStatusPost,
    updateViewPost,
    getAll,
    getDocumentCategory,
    getDocuments,
    getDocumentsChecked,
    getAllDocument,
    getAllDocumentNew,
    getAllDocumentView,
    getAllDocumentPending,
    getAllDocumentPendingOver,
    getAllDocumenChecked,
    getAllDocumentName,
    getDetails,
    deletePost
}