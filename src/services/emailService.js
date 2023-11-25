import nodemailer from 'nodemailer'

export default class emailService {

    async sendEmail(tickect) {

        try {

            const idstring = tickect._id.toHexString();
            const { code, purchase_datetime, amount, purchaser } = tickect

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'claudie.funk69@ethereal.email',
                    pass: '77VaKZY8tzXPWsqQuK'
                }
            });

            var message = {
                from: "sender@server.com",
                to: "claudie.funk69@ethereal.email",
                subject: ` Ticket  ${code}`,
                text: "Gracias por su compra. Ticket generado a continuacion los detalles",
                html: ` <h1>Purchase Details</h1>
                <p>Purchase ID:  ${idstring}</p>
                <p>Email:  ${purchaser}</p>
                <p>Code:  ${code}</p>
                <p>Total Amount:  ${amount}</p>
                <p>Total Time:  ${purchase_datetime}</p>`,
                
                attachments: [{
                    path: './package.json'
                }]
            };

            await transporter.sendMail(message);

            return "SUC|hola se envio"

        } catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }
    }
}