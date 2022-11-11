const { Area, Cinema, Film, FilmSchedule, Banner} = require('../../resources')
const { utils, errors, Debug } = require('../../libs')
const {VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURNURL} = process.env

const debug = Debug()
const {
    NotFoundError,
    DataError,
    PermissionError,
    AuthenticationError,
    ValidationError,
    ConflictError,
    DuplicatedError
} = errors


exports.getBanner = async ctx => {
    const banner = await Banner.Model.getBanners()
    ctx.body = banner
}

exports.getAreas = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit
    
    const {areas, total} = await Area.Model.getAreas(limit,skip)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    await Promise.all(
        areas.map(async area=> {
            const cinemas = await Cinema.Model.getCinemasByAreaId(area._id)
            area.cinemas = cinemas
        }),
    )
    
    
    ctx.body = areas
}

/* exports.getCinemas = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const areaId = ctx.query.areaId
    const skip = parseInt(skipPage || '0') * limit

    const {cinemas, total} = await Cinema.Model.getCinemas(limit, skip, areaId)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = cinemas
} */

exports.getCinema = async ctx => {
    const {id} = ctx.params

    const cinema = await Cinema.Model.getCinema(id)

    ctx.body = cinema
}

exports.getCinemas = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit
    const areaId = ctx.query.areaId
    const {cinemas, total} = await Cinema.Model.getCinemas(limit,skip, areaId)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = cinemas
}

exports.getListFilm = async ctx => {
    const type = ctx.query.type
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit

    const {films, total} = await Film.Model.getFilms(limit,skip,type)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = films
}

exports.getFilm = async ctx => {
    const {id} = ctx.params
    const film = await Film.Model.getFilmById(id)
    debug.log(123)

    ctx.body = film
}


exports.getFilmSchedule = async ctx => {
    const {cinemaId, filmId, date} = ctx.query
    debug.log(cinemaId,filmId)
    const filmSchedules = await FilmSchedule.Model.getFilmSchedule(cinemaId, filmId, date)

    await Promise.all(
        filmSchedules.map(async filmSchedule => {
            delete filmSchedule.seats
            delete filmSchedule.createdAt
            delete filmSchedule.updatedAt
            delete filmSchedule.__v
        })
    )

    ctx.body = filmSchedules

}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('/');
  }

exports.getTime = async ctx => {
    const {id} = ctx.params
    const film = await Film.Model.getFilmById(id)

    const now = formatDate(new Date())
    let today =  new Date(now)
    let times=[]
    mili = today.getTime()
    for (let i = 0; i< 6 ; i++) {
        const date = new Date(mili+i*86400000)
        const check = await FilmSchedule.Model.checkExistInDate(film._id, date)
        if(check) {
            times.push(date)
        }
    }

    ctx.body = times
}


exports.vnpReturn = ctx => {
    var vnp_Params = ctx.query;
    var secureHash = vnp_Params['vnp_SecureHash'];
    debug.log(vnp_Params)
    
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    //vnp_Params = this.sortObject(vnp_Params);

    var querystring = require('qs');
    delete vnp_Params.level
    delete vnp_Params.timestamp
    var signData = VNP_HASHSECRET + querystring.stringify(vnp_Params,{encode:false})

    var sha256 = require('sha256');

    var signed = sha256(signData);
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