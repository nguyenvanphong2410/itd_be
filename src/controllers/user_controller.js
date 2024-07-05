const UserService = require('../services/user_services')
const { responseSuccess, responseError } = require('../utils/ResponseHandle');

// update
const update = async (req, res) => {
  console.log(req.body)
  try {
    const response = await UserService.updateService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    console.log('Lỗi cập nhật : ', e)
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Cập nhật thông tin người dùng thất bại !!! ');
    }
  }
}

//updateStatusUser
const updateStatusUser = async (req, res) => {
  // console.log('Status2 nhận được: ', req.params.status);
  try {
    const response = await UserService.updateStatusUserService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    console.log('Lỗi updateStatusUser Controller', e)
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Cập nhật trang thái Người dùng thất bại !!! ')
    }
  }
}

//getAll
const getAll = async (req, res) => {
  try {
    const response = await UserService.getAllService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Lấy toàn bộ người dùng thất bại !!! ');
    }
  }
};

//getAll
const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUserService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Lấy toàn bộ người dùng thất bại !!! ');
    }
  }
};

//getAllOfficer
const getAllOfficer = async (req, res) => {
  try {
    const response = await UserService.getAllOfficerService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Lấy toàn bộ cán bộ thất bại !!! ');
    }
  }
};

//getAllStudent
const getAllStudent = async (req, res) => {
  try {
    const response = await UserService.getAllStudentService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Lấy toàn bộ sinh viên thất bại !!! ');
    }
  }
};

//getAllOther
const getAllOther = async (req, res) => {
  try {
    const response = await UserService.getAllOtherService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Lấy toàn bộ người dùng thất bại !!! ');
    }
  }
};

//get Details
const getDetails = async (req, res) => {
  try {
    const response = await UserService.getDetailsService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Lấy một người dùng thất bại !!! ');
    }
  }
};

//deleteByAdmin
const deleteByAdmin = async (req, res) => {
  try {
    const response = await UserService.deleteByAdminService(req, res);
    if (!res.headersSent) {
      return res.status(200).json(response);
    }
  } catch (e) {
    console.log('Lôiz deleteByAdmin', e)
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Admin xóa người dùng thất bại !!! ');
    }
  }
}


module.exports = {
  update,
  updateStatusUser,
  getAll,
  getAllUser,
  getAllOfficer,
  getAllStudent,
  getAllOther,
  getDetails,
  deleteByAdmin,

}