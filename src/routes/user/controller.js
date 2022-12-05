const {VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURNURL} = process.env
const moment = require('moment-timezone');
const {promisify} = require('util');
const getIP = promisify(require('external-ip')());
const htmlTemplate = require('./html-template')

const { Account, Profile, FilmSchedule , Ticket, Film, Cinema} = require('../../resources')
const { utils, errors, Debug } = require('../../libs');
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
        avatarUrl: profile?.avatarUrl,
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
    const VNP_RETURNURL1 = ctx.request.body.vnpReturnUrl ? ctx.request.body.vnpReturnUrl :g 'https://movie.cdn.aqaurius6666.space/dat-ve-thanh-cong'
    const {profile} = ctx.state
    const {filmScheduleId, seats, amount, bankCode} = ctx.request.body

    const filmSchedule = await FilmSchedule.Model.getFilmScheduleById(filmScheduleId)
    //debug.log(filmSchedule)


    if(!filmSchedule || !filmSchedule?._id) {
        throw new NotFoundError('Not found filmSchedule')
    }

    await Promise.all(
        seats.map(async seat => {
            if(filmSchedule.seats[seat-1].isBooked) {
                throw new DataError('Ghế đã được đặt')
            }
        })
    )

    const checkAmout = seats.length*50000

    if(profile.memberClass == 'vip') {
        checkAmout = checkAmout*0.9
    }

    if(checkAmout !== amount) {
        throw new DataError('Số tiền không hợp lệ')
    }

    const ticket = await Ticket.Model.createTicket({
        profileId: profile._id,
        filmScheduleId:filmScheduleId,
        seats:seats,
        amount:amount,
    })
    //debug.log(2)

    let ipAddr = await getIP()
    //debug.log(ticket._id)
    let orderId = ticket._id.toString()
    var vnp_Params = {};


    vnp_Params['vnp_Version'] = '2';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = VNP_TMNCODE;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan hoa don';
    vnp_Params['vnp_OrderType'] = 'topup';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = VNP_RETURNURL1;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = parseInt(moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss')).toString();
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    /* var querystring = require('qs');
    delete vnp_Params.level
    delete vnp_Params.timestamp

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed; */

    var querystring = require('qs');
    var signData = VNP_HASHSECRET + querystring.stringify(vnp_Params, { encode: false });
    //console.log(signData)

    var sha256 = require('sha256');

    var secureHash = sha256(signData);

    vnp_Params['vnp_SecureHashType'] =  'SHA256';
    vnp_Params['vnp_SecureHash'] = secureHash;


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

exports.vnpIpn = async ctx => {
    var vnp_Params = Object.assign({},ctx.query) ;
    //debug.log(vnp_Params)
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params?.vnp_SecureHash
    delete vnp_Params?.vnp_SecureHashType

    vnp_Params = this.sortObject(vnp_Params);

    var querystring = require('qs');
    delete vnp_Params.level
    delete vnp_Params.timestamp

/*     var signData = querystring.stringify(vnp_Params, { encode: false });
    debug.log(signData)
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
    var checksum = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");     
    debug.log(checksum) */

    let signData = VNP_HASHSECRET + querystring.stringify(vnp_Params, { encode: false });

    //debug.log(signData)

    let sha256 = require('sha256');

    let checksum = sha256(signData);
    //debug.log(checksum)

    if(secureHash === secureHash){
        var ticketId = vnp_Params['vnp_TxnRef'];
        const ticket = await Ticket.Model.findById(ticketId)
        var rspCode = vnp_Params['vnp_ResponseCode'];
        await Ticket.Model.responseBooking(ticketId,rspCode)
        if(rspCode == '00') {
            const emailSubject = 'Booking ticket Success - Beta'
            let profile = await Profile.Model.bookingSuccess( ticket.profileId,ticket.amount)
            let filmSchedule = await FilmSchedule.Model.bookingSuccess(ticket.filmScheduleId,ticket.seats )
            debug.log(profile)
            debug.log(filmSchedule)
            utils.sendMail(profile.email, emailSubject, null, htmlTemplate.booingTicketSuccess(ticket, filmSchedule))
        }
        ctx.body = 'done'
    }
    else {
        ctx.body = 'failure'
    }
}

/* exports.vnpReturn = async ctx => {
    var vnp_Params = Object.assign({},ctx.query) ;
    //debug.log(vnp_Params)
    var secureHash = vnp_Params['vnp_SecureHash'];
    
    delete vnp_Params?.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType

    vnp_Params = this.sortObject(vnp_Params);


    var querystring = require('qs');
    delete vnp_Params.level
    delete vnp_Params.timestamp

     var signData = querystring.stringify(vnp_Params, { encode: false });
    debug.log(signData)
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
    var checksum = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");     
    debug.log(checksum) 

    let signData = VNP_HASHSECRET + querystring.stringify(vnp_Params, { encode: false });

    debug.log(signData)

    let sha256 = require('sha256');

    let checksum = sha256(signData);
    debug.log(checksum)

    if(secureHash === checksum){
        var orderId = vnp_Params[vnp_TxnRef];
        var rspCode = vnp_Params[vnp_ResponseCode];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        ctx.body = 'success'
    }
    else {
        debug.log(secureHash,checksum)
        ctx.body = 'faild'
    }
}
 */



exports.getTickets = async ctx => {
    const {profile} = ctx.state
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit

    const {tickets, total} = await Ticket.Model.getTickets(profile._id,limit,skip)

    let infoTickets = []

    for(let ticket of tickets) {
        const filmSchedule = await FilmSchedule.Model.getFilmScheduleById(ticket.filmScheduleId)
        const film = await Film.Model.getFilmById(filmSchedule.filmId)
        const cinema = await Cinema.Model.getCinema(filmSchedule.cinemaId)

        infoTickets.push({
            _id: ticket._id,        
            amount: ticket.amount,
            film:{
                _id: film._id,
                name: film.name,
                avatarUrl: film.avatarUrl
            },
            cinema:{
                _id: cinema._id,
                name: cinema.name
            },
            room: filmSchedule.room,
            seats: ticket.seats,
            time: filmSchedule.time,
            isReaded: ticket.isReaded
        })
    }

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = infoTickets
}


exports.getTicket = async ctx => {
    const {profile} = ctx.state
    const {id} = ctx.params

    const ticket = await Ticket.Model.findById(id)

    const filmSchedule = await FilmSchedule.Model.getFilmScheduleById(ticket.filmScheduleId)
    const film = await Film.Model.getFilmById(filmSchedule.filmId)
    const cinema = await Cinema.Model.getCinema(filmSchedule.cinemaId)

    ctx.body = {
            _id: ticket._id,        
            amount: ticket.amount,
            film:{
                _id: film._id,
                name: film.name,
                avatarUrl: film.avatarUrl
            },
            cinema:{
                _id: cinema._id,
                name: cinema.name
            },
            room: filmSchedule.room,
            seats: ticket.seats,
            time: filmSchedule.time,
            isReaded: ticket.isReaded
    }
}


exports.readTicket = async ctx => {
    const {profile} = ctx.state
    const {id} = ctx.request.body

    const ticket = await Ticket.Model.findById(id)

    await Ticket.Model.readTicket(id)

    ctx.body = 'success'
}