const RegisterSchema = require('../models-db/register');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

class RegisterController {
    async register(req, res, next) {
        try {
            res.render('logins/register')
        }catch(error) {
            next(error)
        }
    }

    async signup(req, res, next) {
      try {
        const { email, password, verify } = req.body;
    
        if (!email || !password) {
          return res.status(404).json({ message: "Email hoặc mật khẩu bị lỗi" });
        }
    
        const resisters = await RegisterSchema.findOne({ email: email });
    
        if (resisters) {
          return res.status(404).json({ message: "Email đã tồn tại" });
        }
    
        if (password != verify) {
          return res.status(404).json({ message: "Xác nhận mật khẩu thất bại" });
        }
    
        if (password.length < 8) {
          return res
            .status(404)
            .json({ message: "Mật khẩu phải chứa ít nhất 8 ký tự" });
        }
    
        
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    
        if (!hasUppercase || !hasSpecialCharacter) {
          return res.status(404).json({
            message:
              "Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 ký tự đặc biệt",
          });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const register = new RegisterSchema({ email, password: hashedPassword });
    
        await register.save();
    
        res.redirect('/login?message=' + encodeURIComponent('Đăng ký thành công'));
      } catch (error) {
        next(error);
      }
    }
    
      ///

      async sendemail(req, res, next) {
        try {
            res.render('logins/forgotpassword')
        }catch(error) {
            next(error)
        }
    }


      /// forgot password

      

    async forgot(req, res) {
        try {

          function generateRandomNumber() {
            const randomNumber = Math.floor(Math.random() * 9000) + 1000; 
            return randomNumber.toString();
          }
          
          
          const verificationCode = generateRandomNumber();
          const { email  } = req.body;

          const emailDb = await RegisterSchema.findOne({ email: email })

          if(!emailDb) {
            return res.json('Tài khoản này chưa được đăng ký')
          }
      
          const transporter = nodemailer.createTransport({
            port: 587,
            service: 'gmail',
            auth: {
              user: 'nguyenlonglqmb@gmail.com',
              pass: 'mufneepfkiqccqnd'
            },
            secure: true
          });
      
          
          await transporter.sendMail({
            from: 'nguyenlonglqmb@gmail.com', 
            to: emailDb.email, 
            subject: 'Hello', 
            text: `Mã xác nhận của bạn là: ${verificationCode}`, 
          });

          const expiryDate = new Date(Date.now() + 60 * 10000);
          const expiryDate2 = new Date(Date.now() + 360 * 10000); 

          
          // Đặt cookie 
          res.cookie('codeVerify', verificationCode, { expires: expiryDate, signed: true });
          res.cookie('emailID', email, { expires: expiryDate2, signed: true });
          
          res.json('send code complete')

        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Failed to send code', error: error.message });

        }
      }

      ///view changepass

      async nextpass(req, res, next) {
        try {
            res.render('logins/changepass')
        }catch(error) {
            next(error)
        }
    }

      // changepass

      async changepass(req, res, next) {
        try {
          const { email, newpass, verifypass } = req.body

          if(newpass != verifypass) {
            return res.json('Mật khẩu không khớp')
          }

          const hashedPassword = await bcrypt.hash(newpass, 10);

         
          

          await RegisterSchema.updateOne({ email: email }, { password: hashedPassword })

          res.redirect('/')
            
        }catch(error) {
            next(error)
        }
    }

    // confirm
    async confirm(req, res, next) {
      try {
        const codeVerify = req.signedCookies.codeVerify

        if(!codeVerify){
          return res.status(404).json({ message: "Code is not Verify" })
        }

        const { code } = req.body

        if(code === codeVerify) {
          

          res.redirect('/register/sendemail/nextpass')
        } else {
          return res.json('Mã xác nhận không tồn tại')
        }

          
      }catch(error) {
          next(error)
      }
  }


  async viewchange(req, res, next) {
    try{
      res.render('logins/viewchange')
    } catch(err){
      next(err)
    }
  }









/////////////

async manager(req, res, next) {
  try{
    res.render('logins/managerregister')
  } catch(err){
    next(err)
  }
}


//// approve

async approve(req, res, next) {
  try{
   res.json("ok")

  } catch(err) {
    next(err)
  }
} 






}

module.exports = new RegisterController()





/////////




