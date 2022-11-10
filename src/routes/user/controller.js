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
    debug.log(vnp_Params)


    var querystring = require('qs');
    delete vnp_Params.level
    delete vnp_Params.timestamp
    var signData = VNP_HASHSECRET + querystring.stringify(vnp_Params,{encode:false})
    debug.log(signData)
    var sha256 = require('sha256');

    var secureHash = sha256(signData);
    debug.log(secureHash)

    vnp_Params['vnp_SecureHashType'] =  'SHA256';
    vnp_Params['vnp_SecureHash'] = secureHash;

    let vnpUrl = VNP_URL + '?' + querystring.stringify(vnp_Params, { encode: true }); 
    debug.log(querystring.stringify(vnp_Params, { encode: true }))

    debug.log(vnpUrl)

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