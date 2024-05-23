const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const html2pdf = require('html-pdf');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const pdfkit = require('pdfkit');
const sizeOf = require('image-size');
const topdf = require('libreoffice-to-pdf');
const https = require('https');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const mongoose = require("mongoose");
const mongoURI = require('./config').mongoURI;
const router = require('./routes/userRoute');

const app = express();
const { setCurrentFile, getCurrentFile } = require('./utils/currentFile');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'codevisiondeveloper@gmail.com',
    pass: 'liktvdrrrxgsnery'
  }
});

const formDataMap = new Map();

// Set up the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder for uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get the file extension
    const currentFileName = file.fieldname + '-' + Date.now() + ext;
    cb(null, currentFileName); // Rename the file with original extension
    console.log(currentFileName);
    setCurrentFile("uploads/" + currentFileName);
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Handle POST requests to /upload_word
app.post('/upload_word', [upload.single('file')], async (req, res) => {
  // Convert Word document to HTML
  mammoth.convertToHtml({ path: getCurrentFile() })
    .then(function (result) {
      const html = result.value;

      // Convert HTML to PDF
      html2pdf.create(html, { format: 'Letter' }).toFile('uploads/word2pdf.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: 'output.pdf' }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
  res.send('success');
});
// Handle GET requests to /download_word
app.get('/download_word', function (req, res) {
  const filePath = path.join(__dirname, 'uploads', 'word2pdf.pdf');
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename=example.pdf',
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

async function generateHtmlFromWorkbook(workbook) {
  let htmlContent = '<html><body>';

  // Iterate through each worksheet in the workbook
  workbook.eachSheet((worksheet, sheetId) => {
    // Start a new HTML table for each worksheet
    htmlContent += `<table border="1"><caption>${worksheet.name}</caption><tbody>`;

    // Iterate through each row in the worksheet
    worksheet.eachRow((row, rowNumber) => {
      htmlContent += '<tr>';
      // Iterate through each cell in the row
      row.eachCell((cell, colNumber) => {
        htmlContent += `<td>${cell.value}</td>`;
      });
      htmlContent += '</tr>';
    });

    htmlContent += '</tbody></table>';
  });

  htmlContent += '</body></html>';

  return htmlContent;
}

app.get('/', function (req, res) {
  res.send("Success");
})

// Handle POST requests to /upload_excel
app.post('/upload_excel', [upload.single('file')], async function (req, res) {
  // Load an existing workbook
  const workbook = new ExcelJS.Workbook();
  workbook.xlsx.readFile(getCurrentFile())
    .then(async function () {
      // Convert the workbook to HTML
      const htmlContent = await generateHtmlFromWorkbook(workbook);

      // Use puppeteer to convert the HTML to PDF
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      await page.pdf({ path: 'uploads/excel2pdf.pdf', format: 'A4' });

      await browser.close();
      console.log('PDF file created');
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
  res.send('success');
})

// Handle GET requests to /download_excel
app.get('/download_excel', function (req, res) {
  const filePath = path.join(__dirname, 'uploads', 'excel2pdf.pdf');
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename=example.pdf',
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

// Handle POST requests to /upload_image
app.post('/upload_image', [upload.single('file')], async function (req, res) {
  const imageDimensions = sizeOf(getCurrentFile());
  const pdfDoc = new pdfkit({ size: [imageDimensions.width, imageDimensions.height] });
  const writeStream = fs.createWriteStream('uploads/image2pdf.pdf');
  pdfDoc.pipe(writeStream);

  pdfDoc.image(getCurrentFile(), 0, 0, { width: imageDimensions.width, height: imageDimensions.height });

  pdfDoc.end();
  writeStream.on('finish', function () {
    console.log('PDF file created');
  });
  res.send('success');
})

// Handle GET requests to /download_image
app.get('/download_image', function (req, res) {
  const filePath = path.join(__dirname, 'uploads', 'image2pdf.pdf');
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename=example.pdf',
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

app.post('/sendlink',upload.single('pdfFile'), (req, res) => {

  
  const pdfFilePath = getCurrentFile();
  const pdfFileData = fs.readFileSync(pdfFilePath);
  const base64Data = pdfFileData.toString('base64');
  const str = String(base64Data)
  const dataUri = `data:application/pdf; base64, ${str}`;

  const uniqueId = uuid.v4();
  let newDataSet = [];

  if (!req.file) {
    return res.status(400).send('No PDF file uploaded.');
  }

  const formData = req.body.pdfFormData;
  const textData = req.body.pdfTextData;
  newDataSet.push({
    pdfData: dataUri,
    formData: formData,
    textData: textData,
    name: req.body.name,
    email: req.body.email,
    description: req.body.description
  })

  formDataMap.set(uniqueId, newDataSet);

  const uniqueLink = `http://127.0.0.1/pdfviewer/?id=${uniqueId}`;

  console.log(uniqueLink)
  // Send email to client with the unique link
  const mailOptions = {
    from: 'Stephan Hapi <codevisiondeveloper@gmail.com>',
    to: `${req.body.email}`,
    subject: 'Please sign here',
    text: `Dear ${req.body.name}! Here is the link to access the PDF form: ${uniqueLink}`
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to send email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent with the PDF form link');
    }
  });

});

app.get('/getpdfdata', (req, res) => {
  const uniqueId = req.query.uniqueId;
  const formData = formDataMap.get(uniqueId);

  if (formData) {
    res.json(formData);
  } else {
    res.status(404).send('Form data not found');
  }
});

app.post('/savedocument', upload.single('pdfFile'), (req, res) => {
  const pdfFilePath = getCurrentFile();
  const mailOptions = {
    from: 'Stephan Hapi <codevisiondeveloper@gmail.com>',
    to: `${req.body.email}`,
    subject: 'Thanks for your signing',
    text: `Dear ${req.body.name}! You just signed this document.`,
    attachments: [
      {
        filename: 'Agreement.pdf',
        path: pdfFilePath
      }
    ]
  };
  // formDataMap.set(req.body.currentId, getCurrentFile());
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to send email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent with the PDF Agreement');
    }
  });
})

app.use(router);
mongoose.connect(mongoURI).then(() => {
  console.log("Mongodb connected!");
}).catch((error) => {
  console.error(error);
})

// Start the server
app.listen(8081, () => {
  console.log('Server is running on port 8081');
});
// https.createServer(options, app).listen(8081, "127.0.0.1", () => {
//   console.log(`Server running at https://127.0.0.1/`);
// });