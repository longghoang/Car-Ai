const BlogPost = require('../models-db/blog') 
const moment = require('moment');

class storedController {
    async stored(req, res, next) {
        try{

            const userId = req.signedCookies.userId

            const blogs = await BlogPost.find({ userId }).lean()

            const blogsData = blogs.map(blogData => {
                const createdDate = moment.utc(blogData.created_at).format('DD/MM/YYYY');

                return { ...blogData, createdDate }
            })

            if(!blogsData) {
                return res.status(400).json({ message: "Không tìm thấy bài viết" })
            }


            res.render('me/stored-blogs', {
                blogsData: blogsData
            })
        }catch(error) {
            next(error)
        }
    }

    async trash(req, res, next) {
        try{
            const blogs = await BlogPost.findDeleted({ }).lean()

            const blogsData = blogs.map(blogData => {
                const createdDate = moment.utc(blogData.created_at).format('DD/MM/YYYY');

                return { ...blogData, createdDate }
            })

            if(!blogsData) {
                return res.status(400).json({ message: "Không tìm thấy bài viết" })
            }


            res.render('me/trash-blogs', {
                blogsData: blogsData
            })
        }catch(error) {
            next(error)
        }
    }
}

module.exports = new storedController()