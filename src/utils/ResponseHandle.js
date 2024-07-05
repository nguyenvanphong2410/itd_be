const responseSuccess = (res, data, status = 200, message = 'Success', error = false,) => {
    return res.status(status).json({
        status,
        error,
        message,
        data,
    })
}

const responseError = (res, status = 400,type='' , message = 'Error', error = true) => {
    return res.status(status).json({
        status,
        type,
        error,
        message,
    })
}

module.exports = {
    responseSuccess,
    responseError
}