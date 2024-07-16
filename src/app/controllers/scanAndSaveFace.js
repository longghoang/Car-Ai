
// const FaceModel = require('../models-db/face');
// const faceSchema = require('../models-db/face');
// const NodeWebcam = require('node-webcam');
// const bcrypt = require('bcrypt');
// const path = require('path'); // Import module 'path'
// const fs = require('fs');

// const faceapi = require('face-api.js');
// const { createCanvas, loadImage } = require('canvas');
// const nodeWebcam = require('node-webcam');

// // Load face-api.js models
// const { canvas, faceDetectionNet, faceDetectionOptions } = faceapi;

// class FaceController {

//     async captureface(req, res, next) {
//             try {
//                 res.render('logins/captureface')
                
//             } catch (error) {
//                 next(error);
//             }
//         } 

//     async scanAndSaveFace(req, res, next) {
//         try {
//             // Khởi tạo mô hình nhận diện khuôn mặt
//             await faceapi.nets.ssdMobilenetv1.loadFromUri('../../../models2');
//             await faceapi.nets.faceLandmark68Net.loadFromUri('../../../models2');
//             await faceapi.nets.tinyFaceDetector.loadFromUri('../../../models2');


//             // Sử dụng node-webcam để chụp ảnh từ webcam
//             const Webcam = nodeWebcam.create();
//             const picture = await new Promise((resolve, reject) => {
//                 Webcam.capture((err, data) => {
//                     if (err) reject(err);
//                     resolve(data);
//                 });
//             });

//             // Sử dụng face-api.js để nhận diện khuôn mặt từ ảnh chụp
//             const img = await loadImage(picture);
//             const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)
//                                               .withFaceLandmarks()
//                                               .withFaceDescriptors();

//             if (detections.length === 0) {
//                 throw new Error('Không tìm thấy khuôn mặt trong ảnh.');
//             }

//             // Lấy vector descriptor của khuôn mặt đầu tiên (giả sử chỉ lưu 1 khuôn mặt đầu tiên tìm thấy)
//             const faceDescriptor = detections[0].descriptor;

//             // Lưu vào cơ sở dữ liệu MongoDB bằng Mongoose
//             const newFace = new FaceModel({
//                 userId: userId,
//                 descriptor: faceDescriptor
//             });

//             await newFace.save();

//             res.status(200).json({ message: 'Khuôn mặt đã được đăng ký thành công.' });
//         } catch (error) {
//             next(error);
//         }
//     }
// }

// module.exports = new FaceController();
























////////////////////////////


const faceSchema = require('../models-db/face');
const NodeWebcam = require('node-webcam');
const path = require('path'); // Import module 'path'
const fs = require('fs');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


class RegisterController {
//ui

async captureface(req, res, next) {
    try {

        
        res.render('logins/captureface')
        
    } catch (error) {
        next(error);
    }
}


async saveFaceData(req, res, next) {
    try {
        const { descriptors, licensePlate } = req.body;
        if (!descriptors || descriptors.length === 0) {
            return res.status(400).json({ error: 'No face data provided.' });
        }

        
        
        const newFace = new faceSchema({ descriptors, licensePlate, scannedSuccessfully: true });
        

        await newFace.save();
        res.status(200).json({ message: 'Face data saved successfully!' });
    } catch (error) {
        next(error);
    }
}

/// so sanh
async compareData(req, res, next) {
    try {
        const { descriptors, licensePlate } = req.body;

        console.log(licensePlate)

        if (!descriptors || descriptors.length === 0) {
            return res.status(400).json({ error: 'No face data provided.' });
        }

        if (!licensePlate) {
            return res.status(400).json({ error: 'No license plate provided.' });
        }

        // Lấy danh sách các mặt đã quét thành công (scannedSuccessfully: true)
        const allFaces = await faceSchema.find({ scannedSuccessfully: true });

        const results = [];

        for (let storedFace of allFaces) {
            const storedDescriptors = storedFace.descriptors.map(descriptor => new Float32Array(descriptor));

            const labeledDescriptors = new faceapi.LabeledFaceDescriptors(storedFace._id.toString(), storedDescriptors);

            const faceMatcher = new faceapi.FaceMatcher([labeledDescriptors]);

            let bestMatch = null;

            for (let descriptor of descriptors) {
                const queryDescriptor = new Float32Array(descriptor);
                const match = faceMatcher.findBestMatch(queryDescriptor);

                if (!bestMatch || match.distance < bestMatch.distance) {
                    bestMatch = match;
                }
            }

            // Lưu kết quả vào mảng results
            results.push({
                match: bestMatch.label,
                distance: bestMatch.distance,
                licensePlate: storedFace.licensePlate
            });

            // Nếu khoảng cách nhỏ hơn ngưỡng (ví dụ: 0.4), cập nhật trạng thái scannedSuccessfully
            if (bestMatch.distance < 0.4 && storedFace.licensePlate === licensePlate) {
                storedFace.scannedSuccessfully = false; 
                await storedFace.save();
            }
        }

        // Trả về kết quả
        res.status(200).json({ results });
    } catch (error) {
        next(error);
    }
}


}



module.exports = new RegisterController();



