const JWT = require('jsonwebtoken')
const appName = 'AppCinema'

exports.verifyForgotPassword = (email, token) => {
    const emailContent = `<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px; margin-top: 100px;;"> 
    <tbody><tr> 
     <td align="center" valign="top" style="padding:0;Margin:0;width:560px"> 
      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px"> 
        <tbody><tr> 
         <td align="center" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:36px;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#3EFE01;text-align:center"><b>Reset Password at ${appName}</b></h1></td> 
        </tr> 
        <tr> 
         <td align="center" height="40" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="center" style="padding:0;Margin:0"><p style="Margin:0;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;line-height:21px;color:#0f2934;font-size:14px">Hello!</p></td> 
        </tr> 
        <tr> 
         <td align="center" height="20" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="center" style="padding:0;Margin:0"><p style="Margin:0;font-family:roboto,'helvetica neue',helvetica,arial,sans-serif;line-height:21px;color:#0f2934;font-size:14px">Looks like you want to reset password at&nbsp;<strong><span style="text-decoration:none;color:#3EFE01;font-size:14px" >${appName}</span></strong>,<br>Your OTP is <span style="font-size: 18px; color:#3EFE01">${token}</span> (it's available in 30 minutes)</p></td> 
        </tr> 
        <tr> 
         <td align="center" height="40" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="center" height="60" style="padding:0;Margin:0"></td> 
        </tr> 
        <tr> 
         <td align="center" height="60" style="padding:0;Margin:0"></td> 
        </tr> 
      </tbody></table>`

    return emailContent
}