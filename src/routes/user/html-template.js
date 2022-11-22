//const JWT = require('jsonwebtoken')
const appName = 'Cinema'

exports.booingTicketSuccess = (ticket, filmSchedule) => {
    const emailContent = `<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px; margin-top: 100px;;"> 
    <tbody><tr> 
     <td align="center" valign="top" style="padding:0;Margin:0;width:560px"> 
      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px"> 
        <tbody><tr> 
         <td align="left" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:36px;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#3EFE01;text-align:left"><b>Booking tickets Success</b></h1></td> 
        </tr> 
        <tr> 
         <td align="left" height="20" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="left" style="padding:0;Margin:0"><p style="margin:0;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;line-height:21px;color:#0f2934; font-size: 18px">Chúc mừng bạn đã đặt thành công vé xem phim online tại ứng dụng Beta</span></strong>
         <br><span style="font-size: 18px; color:#000000">Mã đặt vé: ${ticket._id}</span> 
         <br><span style="font-size: 18px; color:#000000">Rạp ${filmSchedule.cinema.name}</span>
         <br><span style="font-size: 18px; color:#000000">Phòng chiếu phim: ${filmSchedule.room}</span>
         <br><span style="font-size: 18px; color:#000000">Tên phim: ${filmSchedule.film.name}</span>
         <br><span style="font-size: 18px; color:#000000">Thời gian chiếu: ${filmSchedule.time}</span>
         <br><span style="font-size: 18px; color:#000000">Số ghế: ${ticket.seats.toString()}</span>
      </p></td> 
      </tbody></table>`

    return emailContent
}