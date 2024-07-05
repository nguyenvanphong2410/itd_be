const User = require("../models/User");
const { responseSuccess, responseError } = require('../utils/ResponseHandle');
const bcrypt = require("bcrypt");

const registerService = async (req, res) => {
  console.log('Nhận vào từ fe Regis', req.body)
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const checkedMssv = await User.findOne({ mssv: req.body.mssv })
    const checkedEmail = await User.findOne({ email: req.body.email })
    
    if (checkedEmail) {
      return responseError(res, 400, 'email', 'Email này đã tồn tại !!! ')
    }
    if (req.body.mssv) {

      if (checkedMssv) {
        return responseError(res, 400, 'mssv', 'Mã số này đã tồn tại !!! ')
      }
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
      fullName: req.body.fullName,
      mssv: req.body.mssv,
      address: req.body.address,
      option: req.body.option,
      class: req.body.class,

    })

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log('loi o day', err)
    return responseError(res, 500, 'err', 'Đăng ký thất bại !!!')
  }
}

const loginService = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return responseError(res, 500, 'err', 'Thông tin xác thực sai')
    };

    const validated = await bcrypt.compare(req.body.password, user.password);

    if (!validated) {
      return responseError(res, 500, 'err', 'Thông tin xác thực sai')
    };

    const { password, ...others } = user._doc;
    console.log(others)
    return others;
  } catch (err) {
    // console.log('Thất bại dang nhapg', err)
    return responseError(res, 500, 'err', 'Đăng nhập thất bại !!!')
  }
}

module.exports = {
  loginService,
  registerService
}
