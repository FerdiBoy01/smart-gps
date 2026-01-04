const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOtpEmail = async (toEmail, otpCode) => {
    const mailOptions = {
        from: `"Smart GPS Support" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Kode Verifikasi Akun Smart GPS',
        html: `
            <h3>Verifikasi Pendaftaran</h3>
            <p>Halo,</p>
            <p>Kode OTP kamu adalah: <b>${otpCode}</b></p>
            <p>Kode ini berlaku selama 5 menit.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email OTP terkirim ke ${toEmail}`);
        return true;
    } catch (error) {
        console.error('Gagal kirim email:', error);
        return false;
    }
};

module.exports = { sendOtpEmail };