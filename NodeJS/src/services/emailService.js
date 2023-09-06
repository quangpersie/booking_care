require('dotenv').config()
import nodemailer from 'nodemailer'

let sendEmail = async (dataSend) => {
    // create reuseable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, //true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    })

    let getBodyHTMLEmail = (dataSend) => {
        let result = ''
        if (dataSend.language === 'vi') {
            result = `
            <h3>Xin chào ${dataSend.patientName} !</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hệ thống website Booking Care</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <p><b>Bác sĩ: ${dataSend.doctorName}</b></p>
            <p>Nếu các thông tin trên là chính xác, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
            <div>
                <a href=${dataSend.redirectLink} target="_blank">Click here</a>
            </div>
            <div>Xin chân thành cảm ơn</div>
            `
        }
        if (dataSend.language === 'en') {
            result = `
            <h3>Dear ${dataSend.patientName} !</h3>
             <p>You received this email because you booked an online medical appointment on the Booking Care website system</p>
             <p>Information for scheduling medical examination:</p>
             <div><b>Time: ${dataSend.time}</b></div>
             <p><b>Doctor: ${dataSend.doctorName}</b></p>
             <p>If the above information is correct, please click on the link below to confirm and complete the appointment booking procedure</p>
             <div>
                <a href=${dataSend.redirectLink} target="_blank">Click here</a>
             </div>
             <div>Sincerely thanks !</div>
            `
        }

        return result
    }

    await transporter.sendMail({
        from: '"Booking Care Center 🏥" <tdq1711@gmail.com>',
        to: dataSend.receiverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmail(dataSend)
    })
}

module.exports = {
    sendEmail: sendEmail
}