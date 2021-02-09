const express = require('express');
require('dotenv').config();
const cors = require('cors');
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const port = process.env.PORT || 3000

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors({origin: true}))
app.use(helmet())
app.post('/api', (req, res) => {
    const {body} = req;
    const isValidMessage = body.message && body.to && body.subject
    if(!isValidMessage){
        return res.status(400).send({message: 'invalid request'})
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: body.to,
        subject: body.subject,
        text: body.message
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if(err){
            return res.status(500).send({message: error} + err.message)
        }

        return res.send({message: 'email.send'})
    })
})

app.listen(port, () => {
    console.log('app runing on port', process.env.PORT)
});
