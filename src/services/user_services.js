const User = require("../models/User");
const { responseSuccess, responseError } = require('../utils/ResponseHandle');
const { getPlaiceholder } = require("plaiceholder");
const bcrypt = require("bcrypt");
const cloudinary = require('../cloudinary');

// updateService
const updateService = async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    if (req.body.profilePic) {
      const user = await User.findById(req.params.id);
      // if (user.profilePic) {
      //   cloudinary.uploader.destroy(user.public_id, { invalidate: true }, function (error, result) {
      //     console.log('ket qua anh',result, error)
      //   });
      // }
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      }, { new: true });

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }

  } else {
    res.status(401).json("You can update only your account!");
  }
}

//updateStatusUserService
const updateStatusUserService = async (req, res) => {
  console.log('Trạng thái nhận được: ', req.body.status);
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedUser) {
      return responseError(res, 404, 'Người dùng không tồn tại', 'User not found');
    }

    console.log('Người dùng đã được cập nhật:', updatedUser);
    
    return res.status(200).send('Cập nhật trạng thái người dùng thành công');
  } catch (err) {
    console.log('Lỗi updateStatusUserService', err);
    return responseError(res, 500, 'Lỗi máy chủ', 'Cập nhật trạng thái người dùng thất bại');
  }
};

//getAllService
const getAllService = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    // res.status(500).json(err)
    return responseError(res, 500, 'err', 'Lấy toàn bộ người dùng thất bại !!! ')
  }
}

//getAllUserService
const getAllUserService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size } = req.query;
    const sRegex = search ? {
      $or: [
        {
          username: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          fullName: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          mssv: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      ]
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 20;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const result = await User.aggregate([
      {
        $match: {
          deletedAt: null,
          // status : true,
          ...sRegex,
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      {
        $facet: {
          documents: [
            { $skip: skip },
            { $limit: pageSize },
            {
              $project: {
                _id: 1,
                username: 1,
                fullName: 1,
                email: 1,
                password: 1,
                profilePic: 1,
                isAdmin: 1,
                public_id: 1,
                mssv: 1,
                address: 1,
                option: 1,
                class: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: 'value' }]
        }
      },
    ]).exec();

    const userTotal = result[0].total.length > 0 ? result[0].total[0].value : 0;

    return {
      total: userTotal,
      page: pageNumber,
      page_size: pageSize,
      users: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getAllOfficerService
const getAllOfficerService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size } = req.query;
    const sRegex = search ? {
      $or: [
        {
          username: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          fullName: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          mssv: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      ]
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 20;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const result = await User.aggregate([
      {
        $match: {
          deletedAt: null,
          option: '2',
          ...sRegex,
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      {
        $facet: {
          documents: [
            { $skip: skip },
            { $limit: pageSize },
            {
              $project: {
                _id: 1,
                username: 1,
                fullName: 1,
                email: 1,
                password: 1,
                profilePic: 1,
                isAdmin: 1,
                public_id: 1,
                mssv: 1,
                address: 1,
                option: 1,
                class: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: 'value' }]
        }
      },
    ]).exec();

    const userTotal = result[0].total.length > 0 ? result[0].total[0].value : 0;

    return {
      total: userTotal,
      page: pageNumber,
      page_size: pageSize,
      users: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getAllStudentService
const getAllStudentService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size } = req.query;
    const sRegex = search ? {
      $or: [
        {
          username: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          fullName: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          mssv: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      ]
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 20;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const result = await User.aggregate([
      {
        $match: {
          deletedAt: null,
          option: '1',
          ...sRegex,
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      {
        $facet: {
          documents: [
            { $skip: skip },
            { $limit: pageSize },
            {
              $project: {
                _id: 1,
                username: 1,
                fullName: 1,
                email: 1,
                password: 1,
                profilePic: 1,
                isAdmin: 1,
                public_id: 1,
                mssv: 1,
                address: 1,
                option: 1,
                class: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: 'value' }]
        }
      },
    ]).exec();

    const userTotal = result[0].total.length > 0 ? result[0].total[0].value : 0;

    return {
      total: userTotal,
      page: pageNumber,
      page_size: pageSize,
      users: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getAllOtherService
const getAllOtherService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size } = req.query;
    const sRegex = search ? {
      $or: [
        {
          username: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          fullName: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          mssv: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      ]
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 20;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const result = await User.aggregate([
      {
        $match: {
          deletedAt: null,
          option: '3',
          ...sRegex,
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      {
        $facet: {
          documents: [
            { $skip: skip },
            { $limit: pageSize },
            {
              $project: {
                _id: 1,
                username: 1,
                fullName: 1,
                email: 1,
                password: 1,
                profilePic: 1,
                isAdmin: 1,
                public_id: 1,
                mssv: 1,
                address: 1,
                option: 1,
                class: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: 'value' }]
        }
      },
    ]).exec();

    const userTotal = result[0].total.length > 0 ? result[0].total[0].value : 0;

    return {
      total: userTotal,
      page: pageNumber,
      page_size: pageSize,
      users: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getDetailsService
const getDetailsService = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
}

// deleteByAdminService
const deleteByAdminService = async (req, res) => {
  console.log(req.body._id);
  if (req.body._id === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await User.findByIdAndDelete(req.params.id);
        if (user.profilePic) {
          cloudinary.uploader.destroy(user.public_id, { invalidate: true }, function (error, result) {
            console.log(result, error)
          });
        }
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
}

module.exports = {
  updateService,
  updateStatusUserService,
  getAllService,
  getAllOfficerService,
  getAllStudentService,
  getAllOtherService,
  getAllUserService,
  getDetailsService,
  deleteByAdminService,
}
