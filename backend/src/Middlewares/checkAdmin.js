

const checkAdmin = (req, res, next) => {

    const user = req.user.decode;
    if(user.isAdmin){
        next();
    }else{
        return res.status(403).json({
            status: 403,
            message: "Bạn không có quyền vào trang này"
        })
    }
}

module.exports = checkAdmin;