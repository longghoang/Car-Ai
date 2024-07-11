const mongoose = require('mongoose');

async function conect() {
    try {
        await mongoose.connect('mongodb+srv://nguyenlonglqmb:Long%40123@cluster0pentest.a1gqpns.mongodb.net/' ,{
            dbName: "My_Blog",
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connect success')
    } catch(error) {
        console.log('Connect fail')
    }
}

module.exports = { conect }

// 