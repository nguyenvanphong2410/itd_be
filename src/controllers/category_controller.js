const Category = require('../models/Category');
const CategoryService = require('../services/category_services')
const { responseSuccess, responseError } = require('../utils/ResponseHandle');


//getAll
const getAll = async (req, res) => {
  try {
    const data = await CategoryService.getAllService(req, res);
    if (!res.headersSent) {
      return responseSuccess(res, data, 200, 'Lấy tất cả thể loại sách thành công');
    }
  } catch (e) {
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Lấy toàn bộ thể loại thất bại !!! ');
    }
  }
};

//create
const create = async (req, res) => {
  try {
    let { name, description, thumbnail } = req.body;
    if (thumbnail) {
      thumbnail = thumbnail.save("images");
      thumbnail = req.body.thumbnail.filepath;
    }
    //Chuỗi so sánh
    const hasNumber = /\d/;
    const specialChars = /[$%^&*_\[\]{}\\|<>\/]+/;
    const specialCharsDescription = /[$%^&*_\[\]{}|]+/;

    const isTrueName = specialChars.test(name)
    const ishasNumberName = hasNumber.test(name);
    const isTrueDescription = specialCharsDescription.test(description)

    if (!name && !description) {
      return responseError(res, 500, 'null', 'Thông tin trống !!! ')
    } else if (isTrueName) {
      return responseError(res, 500, 'name', 'Tên không hợp lệ !!! ')
    } else if (ishasNumberName) {
      return responseError(res, 500, 'name', 'Tên có chứa số !!! ')
    } else if (isTrueDescription) {
      return responseError(res, 500, 'description', 'Mô tả không hợp lệ !!! ')
    }

    // Kiểm tra và thiết lập giá trị slugt
    let { slug } = req.body;
    if (!slug) {
      // Nếu slug không được đặt, bạn có thể tạo một giá trị unique từ name hoặc mô tả
      slug = name.toLowerCase().replace(/\s+/g, '-') || description.toLowerCase().replace(/\s+/g, '-');
    }

    const createdCategory = await Category.create({ ...req.body, slug });

    if (createdCategory) {
      return responseSuccess(res, {
        status: 'OK',
        message: 'Tạo mới danh mục thành công',
        data: createdCategory
      }, 200);
    }
  } catch (e) {
    console.log('Lỗi tạo mới danh mục', e)
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Thêm mới thể loại sách thất bại !!! ')
    }
  }
};

//details
const details = async (req, res) => {
  try {
      const categoryId = req.params.id

      if (!categoryId) {
          return responseError(res, 404, 'not found', 'Thể loại tài liệu này không tồn tại !!! ')

      }

      const response = await CategoryService.detailsService(categoryId, res);
      return responseSuccess(res, response, 200, 'Lấy ra một thể loại thành công');
  } catch (e) {
    console.log('lala', e)
    return responseError(res, 500, 'err', 'Lấy ra thông tin của 1 thể loại sách thất bại !!! ')

  }
};

//update
const update = async (req, res) => {
  try {
    const categoryId = req.params.id
    let { name, description, thumbnail } = req.body;
    if (thumbnail) {
      thumbnail = thumbnail.save("images");
    }
    const data = req.body;
    console.log('dữ liệu body cập nhật cate', data.thumbnail)
    data.thumbnail = data.thumbnail.filepath.replace('images/', '')
    data.slug = data.name

    //Chuỗi so sánh
    const hasNumber = /\d/;
    const specialChars = /[$%^&*_\[\]{}\\|<>\/]+/;
    const specialCharsDescription = /[$%^&*_\[\]{}|]+/;

    const isTrueName = specialChars.test(name)
    const ishasNumberName = hasNumber.test(name);
    const isTrueDescription = specialCharsDescription.test(description)

    if (!categoryId) {
      return responseError(res, 404, 'not found', 'Thể loại sách không tồn tại !!! ')
    }

    //Kiểm tra 
    if (!name || !description) {
      return responseError(res, 400, 'null', 'Thông tin trống !!! ')
    } else if (isTrueName) {
      return responseError(res, 400, 'name', 'Tên thể loại không hợp lệ !!! ')
    } else if (ishasNumberName) {
      return responseError(res, 400, 'name', 'Tên thể loại có chứa số !!! ')
    } else if (isTrueDescription) {
      return responseError(res, 400, 'description', 'Mô tả không hợp lệ !!! ')
    }

    const response = await CategoryService.updateService(categoryId, data, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    console.log('loi nè Cập nhật cate', e)
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Cập nhật thể loại thất bại !!! ');

    }
  }
};

//delete 
const deleteController = async (req, res) => {
  try {
    if (!req.params.id) {
      return responseError(res, 400, 'err', 'id Xóa thể loại thất bại !!! ');
    }
    const data = await CategoryService.deleteService(req, res);
    if (!res.headersSent) {
      return responseSuccess(res, data, 200, 'Xóa thể loại sách tài liệu thành công');
    }
  } catch (e) {
    console.log('loi controller cate get all', e)
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Xóa thể loại thất bại !!! ');
    }
  }
}

module.exports = {
  getAll,
  create,
  details,
  update,
  deleteController
}