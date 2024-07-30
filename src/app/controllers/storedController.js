const moment = require('moment');
const faceSchema = require('../models-db/face') 

class storedController {
    async revenue(req, res, next) {
        try {
            const startDate = new Date('2024-07-09');
            const endDate = new Date();
    
            // Query for records with capturedAt between startDate and endDate
            const blogs = await faceSchema.find({
                scannedSuccessfully: false,
                capturedAt: { $gte: startDate, $lte: endDate }
            }, 'price capturedAt created_at');
    
            // Group blogs by date
            const groupedBlogs = {};
            blogs.forEach(blog => {
                const capturedDate = moment(blog.capturedAt).format('YYYY-MM-DD');
                if (!groupedBlogs[capturedDate]) {
                    groupedBlogs[capturedDate] = {
                        date: moment(blog.capturedAt).format('DD/MM/YYYY'),
                        total: 0,
                        price: 0,
                        blogs: []
                    };
                }
                groupedBlogs[capturedDate].blogs.push({
                    price: blog.price,
                    capturedAt: blog.capturedAt,
                    scannedSuccessfully: blog.scannedSuccessfully
                });
                groupedBlogs[capturedDate].total++;
                groupedBlogs[capturedDate].price += blog.price;
            });
    
            // Convert grouped blogs to an array for easier handling in HBS
            const groupedBlogsArray = Object.keys(groupedBlogs).map(date => groupedBlogs[date]);
    
            if (groupedBlogsArray.length === 0) {
                return res.status(400).json({ message: "Không tìm thấy" });
            }
    
            res.render('me/stored-blogs', {
                faceSchema: groupedBlogsArray
            });
        } catch (error) {
            next(error);
        }
    }



    //pank

    async park(req, res, next) {
        try {
            // Tìm tất cả các spots đã được quét thành công
            const occupiedSpots = await faceSchema.find({ scannedSuccessfully: true });
    
            // Đếm số lượng bản ghi đã tìm thấy
            const numberOfOccupiedSpots = occupiedSpots.length;
            console.log(`Số lượng xe đã được quét thành công là: ${numberOfOccupiedSpots}`);
    
            // Chuẩn bị mảng spots để hiển thị trên giao diện
            const spots = Array.from({ length: 100 }, (_, index) => ({
                occupiedClass: index < numberOfOccupiedSpots ? 'occupied' : 'vacant'
            }));
            console.log(spots);
    
            res.render('blogs/park', { spots });
        } catch (error) {
            next(error);
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