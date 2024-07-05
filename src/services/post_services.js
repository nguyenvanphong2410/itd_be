const Post = require("../models/Post");
const { responseSuccess, responseError } = require('../utils/ResponseHandle');
const { getPlaiceholder } = require("plaiceholder");

const createService = async (req, res) => {
  const pdf = req.file.filename;
  console.log('dpadf nha !', pdf);
  const newPostData = JSON.parse(req.body.newPost);
  const imgArray = newPostData.photos;
  console.log(imgArray);
  console.log(newPostData);
  try {
    const imgs = await Promise.all(
      imgArray.map(async (img) => {
        const imgBase64 = await getPlaiceholder(
          img.src,
          (options = {
            size: 32,
          })
        ).then(({ base64 }) => {
          return {
            src: img.src,
            base64: base64,
            public_id: img.public_id,
          };
        });

        return imgBase64;
      })
    );
    // console.log(imgs);
    const photos = [...imgs];
    const newPost = new Post({ ...newPostData, ...{ photos }, ...{ pdf } }); // ... nối 3 objects
    console.log(newPost);
    try {
      // console.log(newPost)
      const savePost = await newPost.save();
      res.status(200).json(savePost);
      // console.log(newPost);
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    console.log('uuuuuK', err)
    err;
  }
}

//updateService
const updateService = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const newPostData = JSON.parse(req.body.newPost);
    console.log(newPostData);
    console.log(newPostData.photos);
    if (
      post.username === newPostData.username ||
      newPostData.username === "admin"
    ) {
      // const imgArray = req.body.photos;
      // const photosDelete = req.body.photosDelete;
      // console.log(imgArray);
      const pdf = req.file?.filename;
      console.log(pdf, "no");
      const imgArray = newPostData.photos;
      const photosDelete = newPostData.photosDelete;
      console.log(imgArray);
      try {
        const imgs = await Promise.all(
          imgArray.map(async (img) => {
            const imgBase64 = await getPlaiceholder(
              img.src,
              (options = {
                size: 32,
              })
            ).then(({ base64 }) => {
              return {
                src: img.src,
                base64: base64,
                public_id: img.public_id,
              };
            });

            return imgBase64;
          })
        );
        console.log(imgs);
        const photos = [...imgs];
        try {
          if (pdf !== undefined) {
            const updatedPost = await Post.findByIdAndUpdate(
              req.params.id,
              {
                $set: { ...newPostData, ...{ photos }, ...{ pdf } },
              },
              { new: true }
            );
            res.status(200).json(updatedPost);
          } else {
            const updatedPost = await Post.findByIdAndUpdate(
              req.params.id,
              {
                $set: { ...newPostData, ...{ photos } },
              },
              { new: true }
            );
            res.status(200).json(updatedPost);
          }

          if (photosDelete) {
            try {
              photosDelete.map((photo) => {
                cloudinary.uploader.destroy(
                  photo.public_id,
                  { invalidate: true },
                  function (error, result) {
                    console.log(result, error);
                  }
                );
              });
            } catch (err) {
              err;
            }
          }
        } catch (err) {
          res.status(500).json(err);
        }
      } catch (err) {
        err;
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

// //updateStatusPostService
// const updateStatusPostService = async (req, res) => {
//   console.log(req.body);
//   try {
//     try {
//       const updatedPost = await Post.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: { ...req.body },
//         },
//         { new: true }
//       );
//       // res.status(200).json(updatedPost);
//       return updatedPost;
//     } catch (err) {
//       // res.status(500).json(err);
//       return responseError(res, 500, 'err', 'Cập nhật trạng thái tài liệu thất bại !!! ')
//     }
//   } catch (err) {
//     // res.status(500).json(err);
//     return responseError(res, 500, 'err', 'Cập nhật trạng thái tài liệu thất bại !!! ')
//   }
// }

//updateStatusUserService2
const updateStatusPostService = async (req, res) => {
  console.log('Trạng thái Post nhận được: ', req.body.status);
  
  try {
    const updatedStatusPost = await Post.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedStatusPost) {
      return responseError(res, 404, 'Tài liệu không tồn tại', 'User not found');
    }

    console.log('Trạng thái tài liệu đã được cập nhật:', updatedStatusPost);
    
    return res.status(200).send('Cập nhật trạng thái tài liệu thành công');
  } catch (err) {
    console.log('Lỗi updateStatusUserService', err);
    return responseError(res, 500, 'Lỗi máy chủ', 'Cập nhật trạng thái tài liệu thất bại');
  }
};

//updateViewPostService
const updateViewPostService = async (req, res) => {
  const id = req.params.id;
  console.log('id view', id);
  try {
    const updatedViewPost = await Post.findByIdAndUpdate(
      { _id: id },
      { $inc: { view: 1 } }, // Sử dụng $inc để tăng giá trị của view lên 1
      { new: true }
    );
    console.log('updatedViewPost', updatedViewPost.view);

    return updatedViewPost;
  } catch (err) {
    // res.status(500).json(err);
    return responseError(res, 500, 'err', 'Cập nhật lượt xem tài liệu thất bại !!! ')
  }
}


//getAllService
const getAllService = async (req) => {
  const username = req.query.user;
  const catName = req.query.cat;
  const q = req.query.q;
  const newest = req.query.newest;
  const page = parseInt(req.query.page || 1);
  const num_results_on_page = parseInt(req.query.num_results_on_page || 100);

  try {
    let posts, total_documents, total_pages;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      total_documents = await Post.find({ category: catName }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      posts = await Post.find({ category: catName })
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page);
    } else if (q) {
      total_documents = await Post.find({
        name: {
          $regex: q,
          $options: "i",
        },
      }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      posts = await Post.find({
        name: {
          $regex: q,
          $options: "i",
        },
      })
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page);
    } else if (newest) {
      posts = await Post.find().limit(8).sort({ createdAt: -1 });
    } else if (page) {
      total_documents = await Post.countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      posts = await Post.find()
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page)
        .sort({ createdAt: -1 });
      // posts = await Post.find().skip((page - 1) * num_results_on_page).limit(num_results_on_page);
    } else {
      posts = await Post.find().sort({ createdAt: -1 }); // ưu tiên lấy num_results_on_page do page có thể bằng 1 nên else if (page) được thực hiện
    }

    return {
      page: page,
      num_results_on_page: num_results_on_page,
      total_documents: total_documents,
      total_pages: total_pages,
      posts: posts,
    }

  } catch (err) {
    res.status(500).json(err);
  }
}

//getDocumentCategoryService
const getDocumentCategoryService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, name_category } = req.query;

    const sRegex = search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 8;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const nameCategory = String(name_category);
    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: true,
          category: nameCategory,
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                category: 1,
                year: 1,
                status: 1,
                view: 1,
                author: 1,
                publisher: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}


//getDocumentsService
const getDocumentsService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view } = req.query;
    const sRegex = search ? {
      $or: [
        {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          username: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          author: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          category: {
            $regex: req.query.search,
            $options: 'i',
          },
        },

      ]

    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 12;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"

    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                categories: 1,
                category: 1,
                year: 1,
                status: 1,
                view: 1,
                author: 1,
                publisher: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getDocumentsCheckedService
const getDocumentsCheckedService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view } = req.query;
    const sRegex = search ? {
      $or: [
        {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          username: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          author: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          category: {
            $regex: req.query.search,
            $options: 'i',
          },
        },

      ]

    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 12;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"

    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: true,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                categories: 1,
                category: 1,
                year: 1,
                status: 1,
                view: 1,
                author: 1,
                publisher: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getAllDocumentsService
const getAllDocumentService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view } = req.query;
    const sRegex = search ? {
      $or: [
        {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          username: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          category: {
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          author: {
            $regex: req.query.search,
            $options: 'i',
          },
        },

      ]

    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 12;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"

    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: true,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                categories: 1,
                category: 1,
                year: 1,
                status: 1,
                view: 1,
                author: 1,
                publisher: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getAllDocumentNewService
const getAllDocumentNewService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view } = req.query;
    const sRegex = search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 12;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"

    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: true,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                categories: 1,
                year: 1,
                status: 1,
                view: 1,
                author: 1,
                publisher: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getAllDocumentViewService
const getAllDocumentViewService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view } = req.query;
    const sRegex = search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 12;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "view";
    const sortOrder = sort_order === "desc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"

    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: true,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                category: 1,
                year: 1,
                status: 1,
                publisher: 1,
                view: 1,
                author: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}


//getAllDocumentPendingService
const getAllDocumentPendingService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view, name_user } = req.query;
    const sRegex = search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 8;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"
    const nameUser = String(name_user);
    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: false,
          username: nameUser,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                categories: 1,
                year: 1,
                status: 1,
                view: 1,
                author: 1,
                publisher: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getAllDocumentPendingOverService
const getAllDocumentPendingOverService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view } = req.query;
    const sRegex = search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 1000;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"
    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: false,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                category: 1,
                year: 1,
                status: 1,
                view: 1,
                author: 1,
                publisher: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}


//getAllDocumentCheckedService
const getAllDocumentCheckedService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view, name_user } = req.query;

    const sRegex = search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 8;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"
    const nameUser = String(name_user);
    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: true,
          username: nameUser,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                categories: 1,
                year: 1,
                status: 1,
                view: 1,
                author: 1,
                publisher: 1,
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

//getAllDocumentNameService
const getAllDocumentNameService = async (req, res) => {
  try {
    let { search, sort_by, sort_order, page, page_size, number_view, compare_view, name_user } = req.query;
    const sRegex = search ? {
      name: {
        $regex: req.query.search,
        $options: 'i',
      },
    } : null;
    const pageSize = Number(page_size) ? Number(page_size) : 8;
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const skip = pageSize * (pageNumber - 1);
    const sortBy = sort_by || "createdAt";
    const sortOrder = sort_order === "asc" ? 1 : -1;
    const numberView = Number(number_view) > 0 ? Number(number_view) : 0
    const compareView = String(compare_view) ? String(compare_view) : "$gt"
    const nameUser = String(name_user);
    const result = await Post.aggregate([
      {
        $match: {
          deletedAt: null,
          status: true,
          username: nameUser,
          ...sRegex,
          ...(numberView && compareView && { view: { [compareView]: numberView } }),
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
                name: 1,
                desc: 1,
                pdf: 1,
                photos: 1,
                username: 1,
                categories: 1,
                year: 1,
                status: 1,
                view: 1,
                publisher: 1,
                author: 1,
                // thumbnail: { $concat: ["http://localhost:3001/api/author/img/", "$thumbnail"] },
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
      documents: result[0].documents,
    };
  } catch (err) {
    console.log('loi', err)
    res.status(500).json(err)
  }
}

const getDetailsService = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    console.log('id post', req.params.id)
    return post;
  } catch (err) {
    return responseError(res, 500, 'err', 'Lấy một tài liệu thất bại !!! ')
  }
}

//deleteService
const deleteService = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if (post.username === req.body.username || post.isAdmin === true) {
    try {
      await post.delete();
      cloudinary.uploader.destroy(
        post.public_id,
        { invalidate: true },
        function (error, result) {
          console.log(result, error);
        }
      );
      try {
        post.photos.map((photo) => {
          cloudinary.uploader.destroy(
            photo.public_id,
            { invalidate: true },
            function (error, result) {
              console.log(result, error);
            }
          );
        });
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        err;
      }
    } catch (err) {
      res.status(500).json(err);
    }
    // } else {
    //   res.status(401).json("You can delete only your post!");
    // }
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  createService,
  updateService,
  updateStatusPostService,
  updateViewPostService,
  getAllService,
  getDocumentCategoryService,
  getDocumentsService,
  getDocumentsCheckedService,
  getAllDocumentService,
  getAllDocumentNewService,
  getAllDocumentViewService,
  getAllDocumentPendingService,
  getAllDocumentPendingOverService,
  getAllDocumentCheckedService,
  getAllDocumentNameService,
  getDetailsService,
  deleteService
}
