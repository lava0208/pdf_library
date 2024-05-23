const mongoURI = 'mongodb://154.38.178.246:27017/pdf-vision';
const jwtSecret = 'pdfvision';
const maxAge = 3600 * 5;

module.exports = {
    mongoURI,
    jwtSecret,
    maxAge
}