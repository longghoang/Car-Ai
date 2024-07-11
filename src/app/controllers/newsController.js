const TicketRegistrationSchema = require('../models-db/ticket');
const RegisterSchema = require('../models-db/register');
const BlogPost = require('../models-db/blog');
const faceSchema = require('../models-db/face')
const moment = require('moment');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



class NewsController {

  async help(req, res, next) {
    try {
      const faqs = [
        { question: 'Làm thế nào để đăng ký hệ thống quản lý gửi xe?', answer: 'Để đăng ký, nhấn vào nút "Đăng ký" trên trang chủ và điền thông tin của bạn.' },
        { question: 'Làm thế nào để thêm xe mới?', answer: 'Đi tới phần "Xe cộ", và nhấn vào "Thêm xe". Điền các thông tin cần thiết và lưu lại.' },
        { question: 'Làm thế nào để cập nhật thông tin cá nhân?', answer: 'Nhấn vào biểu tượng hồ sơ của bạn và chọn "Chỉnh sửa hồ sơ". Thực hiện các thay đổi cần thiết và lưu lại.' },
        { question: 'Làm thế nào để báo cáo sự cố?', answer: 'Đi tới phần "Hỗ trợ" và nhấn vào "Báo cáo sự cố". Điền thông tin chi tiết và gửi.' },
        { question: 'Chấp nhận các phương thức thanh toán nào?', answer: 'Chúng tôi chấp nhận thẻ tín dụng, thẻ ghi nợ và ngân hàng trực tuyến.' },
        { question: 'Làm thế nào để liên hệ hỗ trợ khách hàng?', answer: 'Bạn có thể liên hệ hỗ trợ khách hàng bằng cách gọi một trong các số điện thoại được liệt kê trong phần liên hệ.' }
    ];
    

        const contacts = [
            { phone: '0865-055-902' },
            { phone: '0358-666-123' },
            { phone: '0123-456-789' }
        ];

        res.render('blogs/help', { faqs, contacts });
    } catch (error) {
        next(error);
    }
}

////

async ticket(req, res, next) {
  try {
    
      res.render('logins/ticket');
  } catch (error) {
      next(error);
  }
}

async registerTicket(req, res, next) {
  try {
   
      const jwtUser = req.signedCookies.userId; 

      console.log("dang ky", jwtUser)

  
      const homeDelivery = req.body.homeDelivery === 'on';


      const data = {
          ...req.body,
          homeDelivery,
          jwtUser,
      };

      const newTicket = new TicketRegistrationSchema(data);
      await newTicket.save();


      res.redirect('/');
  } catch (error) {
      next(error);
  }
}



//tiketManager  


async tiketManager(req, res, next) {
  try {
    const jwtUser = req.signedCookies.userId; 

    console.log(jwtUser)

    // Lấy tất cả các vé từ cơ sở dữ liệu
    const tickets = await TicketRegistrationSchema.find({ jwtUser });

     console.log(tickets)

    

    // Lọc và chuyển đổi dữ liệu
    const formattedTickets = tickets.map(ticket => ({
      cardType: ticket.cardType,
      fullName: ticket.fullName,
      birthDate: moment(ticket.birthDate).format('DD/MM/YY'), 
      address: ticket.address,
      phone: ticket.phone,
      registrationDate: moment(ticket.registrationDate).format('DD/MM/YY'), 
      homeDelivery: ticket.homeDelivery ? 'có' : 'không',
      receiveLocation: ticket.receiveLocation,
    }));


    const hasTickets = formattedTickets.length > 0;


    res.render('blogs/ticketmanager', { tickets: formattedTickets, hasTickets  });
  } catch (error) {
    next(error);
  }
}




































  
  async index(req, res, next) {
    try {
      res.render('home');
    } catch (error) {
      next(error);
    }
  }
  

///


//
async account(req, res, next) {
  try {
      const userId = req.signedCookies.userId

      const userEmail = await RegisterSchema.findOne({_id: userId})


      if(!userEmail) {
        return res.status(404).json({message: "Email not found"})
      }

      const nameEmail = userEmail.email

      const totalPosts = await faceSchema.countDocuments({ scannedSuccessfully: true });
      console.log(totalPosts)

      let post;
    if (totalPosts === 0) {
      post = 'Chưa có xe nào được gửi';
    }



      res.render('blogs/account', {
        nameEmail: nameEmail,
        totalPosts: totalPosts,
        post: post
      })
      

  }catch(error) {
    next(error)
  }
}





}

module.exports = new NewsController();