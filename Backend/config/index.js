const mongoURI = 'mongodb://127.0.0.1:27017/pdf-vision';
const jwtSecret = 'pdfvision';
const maxAge = 3600 * 5;

module.exports = {
    mongoURI,
    jwtSecret,
    maxAge
}