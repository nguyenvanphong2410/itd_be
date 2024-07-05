const AuthServices = require('../services/auth_services')
const { responseSuccess, responseError } = require('../utils/ResponseHandle');
const User = require("../models/User");
const register = async (req, res) => {
    try {

        const response = await AuthServices.registerService(req, res);
        if (!res.headersSent) {
            return res.status(200).json(response);
        }
    } catch (e) {
        if (!res.headersSent) {
            return responseError(res, 500, 'err', 'Đăng ký thất bại !!');
        }
    }
}

//login
const login = async (req, res) => {
    try {
        const response = await AuthServices.loginService(req, res);
        //Lấy ra 1 email
        const checkUser = await User.findOne({ email: req.body.email })
        if (checkUser.status === false) {
            return responseError(res, 400, 'lock', 'Tài khoản bị khóa !!! ')
        }
        if (!res.headersSent) {
            return res.status(200).json(response);
        }
    } catch (e) {
        if (!res.headersSent) {
            return responseError(res, 500, 'err', 'Đăng nhập thất bại !!');
        }
    }
};


module.exports = {
    login,
    register,
}