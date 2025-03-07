const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
    { name: "resumes", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 }
]);

module.exports = uploadFields;
