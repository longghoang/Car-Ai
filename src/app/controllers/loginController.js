const RegisterSchema = require('../models-db/register');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


class LoginController {

  constructor() {
    // Khai báo một đối tượng để lưu thông tin số lần thử đăng nhập sai của mỗi người dùng
    this.loginAttempts = {};
}

    async login(req, res, next) {
        try {
            res.render('logins/login')
        }catch(error) {
            next(error)
        }
    }


  
    async signin(req, res, next) {
      try {
        const { email, password, 'g-recaptcha-response': recaptchaResponse } = req.body;
        
        if (!email || !password) {
          return res.status(400).json({ message: "VUI LÒNG ĐIỀN EMAIL VÀ MẬT KHẨU" });
        }
    
        const user = await RegisterSchema.findOne({ email });
    
        if (!user) {
          return res.status(401).json({ message: "TÀI KHOẢN HOẶC MẬT KHẨU KHÔNG CHÍNH XÁC" });
        }
    
        if (user.loginAttempts >= 3) {
          return res.status(401).json({ message: "Tài khoản đã bị khóa vì thử đăng nhập sai quá nhiều lần. Vui lòng liên hệ quản trị viên Nguyễn Hoàng Long để được hỗ trợ" });
        }
    
         const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          user.loginAttempts++;
          await user.save();
          return res.status(401).json( {message: " MẬT KHẨU KHÔNG CHÍNH XÁC "} );
          // }
        }

        req.session.user = email;
    
        user.loginAttempts = 0;
        await user.save();
    
        const token = jwt.sign({ email: user.email }, 'secret-key', { expiresIn: '1h' });
    
        // Gui token ve cho client o cookie
        res.cookie('userId', user._id, { signed: true });
        res.cookie('jwt', token);
    
        res.redirect('/');
      } catch (error) {
        next(error);
      }
    }
    // connect.sid
    // s%3Ay5uysogtjDqbbNrBynzMfO82nzmcVK3D.%2FmpmrYQh1jF88xOv22NMej10TEOHceDpP7np3aWWdMg
    

    


    
    

    // async signin(req, res, next) {
    //   try {
    //     const { email, password } = req.body;
    
    //     if (!email || !password) {
    //       return res.status(400).json({ message: "Vui lòng điền email và mật khẩu!" });
    //     }
    
    //     const user = await RegisterSchema.findOne({ email });
    
    //     if (!user) {
    //       return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    //     }
    
      
    
    //     const token = jwt.sign({ email: user.email, userId: user._id }, 'secret-key', { expiresIn: '1h' });

    
    //     // Gửi token về cho client trong cookie
    //     res.cookie('userId', user._id, { signed: true });
    //     res.cookie('jwt', token);
    
    //     res.redirect('/');
    //   } catch (error) {
    //     next(error);
    //   }
    // }
    
}

module.exports = new LoginController()