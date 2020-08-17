const sgMail = require('@sendgrid/mail')
const { json } = require('body-parser')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.contactForm = (req,res) => {
    const {email, name, message} = req.body
    const emailData = {
        to: 'shubhamanchaliya84@gmail.com',
        from: email,
        subject: `Contact form - ${process.env.APP_NAME}`,
        text: `Email received from contact form \n sender name : ${name} \n  sender email : ${email} \n sender message : ${message}`,
        html: `
        <h4>Email received from contact form:</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        
        `
    }
    sgMail.send(emailData).then(() => {
        return res.json({
            message: 'success'
        })
        
    }, error => {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
          res.json({
              error: 'something went wrong'
          })
        }
        
    })
    

}