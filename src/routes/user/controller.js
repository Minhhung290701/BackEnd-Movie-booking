const VNPay = require('node-vnpay')
let vnpay = new VNPay({
    secretKey: 'KDZYFWWFKTFUYBHMAAMJXVPFNGMDRBCQ',
    returnUrl: 'https://www.facebook.com/',
    merchantCode: '7ZKZXL9R',
    hashAlgorithm: 'sha256' // optional 
});
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


exports.bookingWeb = async ctx => {
    const {filmScheduleId, seats} = ctx.request.body
    let payURL = await vnpay.genPayURL({
        transactionRef: 'PT20200520103101_007',
        orderInfo: 'Thanh toan hoa don dich vu',
        orderType: '100000',
        amount: 100000,
        bankCode: 'NCB'
    })

    ctx.body = payURL
}