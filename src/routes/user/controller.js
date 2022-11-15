const {VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURNURL} = process.env
const moment = require('moment-timezone');
const {promisify} = require('util');
const getIP = promisify(require('external-ip')());

const { Account, Profile } = require('../../resources')
const { utils, errors, Debug } = require('../../libs')
const debug = Debug()
const {
    NotFoundError,
    DataError,
    PermissionError,
    AuthenticationError,
    ValidationError,
    ConflictError,
} = errors

exports.updateProfile = async ctx => {
    const profile = ctx.state.profile
    const fields = ctx.request.body

    const newProfile = await Profile.Model.updateProfile(profile._id,fields)

    ctx.body = newProfile
}

exports.getProfile = async ctx => {
    const p = ctx.state.profile

    debug.log(p)
    
    const profile = await Profile.Model.getProfileById(p._id)

    ctx.body = {
        _id:profile._id,
        name:profile.name,
        gender: profile?.gender,
        birthday: profile?.birthday,
        description: profile?.description,
        totalPay: profile.totalPay,
        memberClass: profile.memberClass

    }
}

exports.login = async ctx => {
    const { callingCode, phoneNumber, password } = ctx.request.body

    const account = await Account.Model.getUserByPhoneNumber(phoneNumber, callingCode)

    if (!account) {
        throw new ValidationError('User not found')
    }

    if (!utils.verifyPassword(password, account.hashPassword)) {
        throw new ValidationError('Password is incorrect')
    }

    delete account.hashPassword

    ctx.body = {
        ...account,
        accessToken: utils.generateAccessToken(account),
        refreshToken: utils.generateRefreshToken(account),
    }
}


exports.booking = async ctx => {
    const {filmScheduleId, seats, amount, bankCode} = ctx.request.body
    let ipAddr = await getIP()

    //const dateFormat = require('dateformat');
    let orderId = filmScheduleId    

    var vnp_Params = {};


    vnp_Params['vnp_Version'] = '2';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = VNP_TMNCODE;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan hoa don';;
    vnp_Params['vnp_OrderType'] = 'topup';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = VNP_RETURNURL;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = parseInt(moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss')).toString();
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    var querystring = require('qs');
    delete vnp_Params.level
    delete vnp_Params.timestamp

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    let vnpUrl = VNP_URL + '?' + querystring.stringify(vnp_Params, { encode: true });

    ctx.body = vnpUrl
}

exports.sortObject = (o) => {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

exports.vnpReturn = ctx => {
    var vnp_Params = ctx.query;
    debug.log(vnp_Params)
    var secureHash = vnp_Params['vnp_SecureHash'];
    
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    //vnp_Params = this.sortObject(vnp_Params);


    var querystring = require('qs');
    delete vnp_Params.level
    delete vnp_Params.timestamp
    var signData = querystring.stringify(vnp_Params, { encode: false });
    debug.log(signData)
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");     
    debug.log(signed)

    if(secureHash === signed){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        ctx.body = 'success'
    }
    else {
        ctx.body = 'faild'
    }
}


exports.vnpIpn = ctx => {
    var vnp_Params = ctx.query;
    debug.log(vnp_Params)
    var secureHash = vnp_Params['vnp_SecureHash'];
    
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    //vnp_Params = this.sortObject(vnp_Params);


    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        ctx.body = 'success'
    }
    else {
        ctx.body = 'faild'
    }


}