const BlogPost = require('../models-db/blog');
const RegisterSchema = require('../models-db/register')
const moment = require('moment');

class NewsController {
  
  async index(req, res, next) {
    try {
      const email = req.session.email || '';
      const pageNumber = req.query.page || 1; // Trang hiện tại, mặc định là 1
      const pageSize = 6; // Số lượng bài viết trên mỗi trang
  
      const userId = req.signedCookies.userId;
  
      // Truy vấn số lượng bài viết của tài khoản đang đăng nhập
      const totalPosts = await BlogPost.countDocuments({ userId });
  
      const totalPages = Math.ceil(totalPosts / pageSize);
  
      const blogPosts = await BlogPost.find({ userId })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();
  
      const Blog = blogPosts.map(blogPost => {
        const createdDate = moment(blogPost.created_at).format('HH:mm:ss, DD/MM/YYYY');
        return { ...blogPost.toObject(), createdDate };
      });
  
      // Tạo mảng pages
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          pageNumber: i,
          isCurrent: i === pageNumber,
        });
      }
  
      res.render('home', {
        Blog: Blog,
        pages: pages,
        layout: 'main',
        email: email
      });
    } catch (error) {
      next(error);
    }
  }
  

///
  async read(req, res, next) {
    try {
      const postId = req.query._id;

      const readPost = await BlogPost.findOne({ _id: postId });


      if (!readPost) {
        // Nếu không tìm thấy bài viết
        return res.status(404).json({ message: 'Bài viết không tồn tại' });
      }

      const readPostObject  = readPost.toObject()

      res.render('blogs/read', { readPost: readPostObject });
    } catch (error) {
      next(error);
    }
}
///

async search(req, res, next) {
  try {
    // const searchQuery = decodeURIComponent(req.query.search)

    const sessionID = req.cookies.jwt 
    return res.json(`"sID được gửi cho Hacker: " ${sessionID}`)
    

    const searchResult = await BlogPost.findOne({ title: { $regex: new RegExp(searchQuery, 'i') } }) //không phân biệt chữ hoa 

    
    if(!searchResult) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" })
    }
    
    const resultToObject = searchResult.toObject()
    res.render('blogs/search_result', {
      resultSearch: resultToObject
    })
  }catch(error) {
    next(error)
  }
}

//
async account(req, res, next) {
  try {
      const userId = req.signedCookies.userId

      const userEmail = await RegisterSchema.findOne({_id: userId})


      if(!userEmail) {
        return res.status(404).json({message: "Email not found"})
      }

      const nameEmail = userEmail.email

      const totalPosts = await BlogPost.countDocuments({ userId });

      if(!totalPosts) {
        var post = ('Bạn chưa đăng bài viết nào !')
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