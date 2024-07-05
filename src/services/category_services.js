const Category = require("../models/Category");
const { responseSuccess, responseError } = require('../utils/ResponseHandle');

//getAllService
const getAllService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size } = req.query;

    const sRegex = search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 100;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;

    const result = await Category.aggregate([
      {
        $match: {
          deleted_at: null,
          ...sRegex,
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      {
        $facet: {
          categories: [
            { $skip: skip },
            { $limit: pageSize },
            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                thumbnail: { $concat: ["http://localhost:5000/uploads/images/", "$thumbnail"] },
                slug: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: 'value' }]
        }
      },
    ]).exec();

    const categoryTotal = result[0].total.length > 0 ? result[0].total[0].value : 0;

    return {
      total: categoryTotal,
      page: pageNumber,
      page_size: pageSize,
      categories: result[0].categories,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

// createSerpvice
const createSerpvice = async (req, res) => {
  const newCat = new Category(req.body);
  console.log('mememe ', newCat)
  try {
    const response = await newCat.save();
    // if (!res.headersSent) {
    return response;
    // }
  } catch (err) {
    // res.status(500).json(err)
    if (!res.headersSent) {
      return responseError(res, 500, 'err', 'Tạo thể loại tài liệu thất bại !!! ')
    }

  }
}

//detailsService
const detailsService = async(id, res) => {
  try {
    //Lấy ra 1 email theo id
    const category = await Category.findOne({ _id: id })

    if (category === null) {
      return reject.status(500).json({
        status: 'Ok',
        message: 'Thể loại này không tồn !'
      })
    }

    return category

  } catch (e) {
    return responseError(res, 500, 'err', 'Lấy ra thông tin của 1 thể loại sách thất bại !!! ')
  }
}


//updateService
const updateService = async (id, data, res) => {
  try {
    const checkCategory = await Category.findOne({ _id: id })

    if (checkCategory === null) {
      return responseError(res, 400, 'Not found', 'Thể loại sách này không tồn tại !!! ')
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });

    console.log('Dữ liệu được cập nhật', updatedCategory);

    return responseSuccess(res, {
      status: 'OK',
      message: 'Cập nhật thông tin thể loại tài liệu thành công',
      data: updatedCategory
    }, 200);

  } catch (e) {
    return responseError(res, 500, 'err', 'Cập nhật thể loại thể loại thất bại !')
  }
}

//deleteService g
const deleteService = async (req, res) => {
  const id = req.params.id
  try {
    return await Category.findByIdAndDelete(id)
  } catch (error) {
    return responseError(res, 500, 'err', 'Xóa tài liệu thất bại !!! ')
  }

}

module.exports = {
  getAllService,
  createSerpvice,
  detailsService,
  updateService,
  deleteService
}
