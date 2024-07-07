const mongoose = require('mongoose');

async function conect() {
    try {
        await mongoose.connect('mongodb+srv://nguyenlonglqmb:Long%40123@cluster0pentest.a1gqpns.mongodb.net/' ,{
            dbName: "My_Blog",
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Conect success')
    } catch(error) {
        console.log('Conect fail')
    }
}

module.exports = { conect }

// 