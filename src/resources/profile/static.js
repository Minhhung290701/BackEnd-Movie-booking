exports.STATUS = {
    ACTIVE: 'active',
    // PENDING: 'pending', // chờ verify email - tạm thời không sử dụng, vì admin sẽ tạo account ở trạng thái active luôn
    INACTIVE: 'inactive', // hết thời gian bảo lưu
    // BLOCKED: 'blocked', // vì lý do nào đó không cho hoạt động nữa - tạm thời không sử dụng, vì chưa có nhu cầu
    DELETED: 'deleted',
}

exports.ACCOUNT_TYPE = {
    PASSWORD: 'password',
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    APPLE: 'apple',
}

exports.GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    UNISEX: 'unisex',
}

exports.CLASS = {
    STANDARD:'standard',
    VIP:'vip'
}
