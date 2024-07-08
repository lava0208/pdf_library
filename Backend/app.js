require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
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
const mongoURI = process.env.MONGO_URI;

const userRouter = require('./routes/userRoute');
const historyRouter = require('./routes/historyRoute');
const folderRouter = require('./routes/folderRoute');

const historyController = require('./controllers/historyController');

const app = express();
const { setCurrentFile, getCurrentFile } = require('./utils/currentFile');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
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

const options = {
  key: fs.readFileSync("./cert/privkey3.pem"),
  cert: fs.readFileSync("./cert/fullchain3.pem"),
};

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

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

app.post('/sendlink', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No PDF file uploaded.');
    }

    const pdfFilePath = getCurrentFile();  // Ensure this returns the correct path
    const pdfFileData = fs.readFileSync(pdfFilePath);
    const base64Data = pdfFileData.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Data}`;

    const { pdfFormData, pdfTextData, name, description, emails, username } = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).send('No recipient email addresses provided.');
    }

    const selectedEmails = emails.split(",");

    for (const email of selectedEmails) {
      const uniqueId = uuid.v4();
      const uniqueLink = `https://${process.env.DOMAIN}/openpdf/?id=${uniqueId}`;

      const newDataSet = [{
        pdfData: dataUri,
        formData: pdfFormData,
        textData: pdfTextData,
        name: name,
        email: email,
        description: description,
        uniqueLink: uniqueLink
      }];

      // Save to documents table
      const updateReq = {
        body: {
          id: uniqueId,
          formDataMap: newDataSet
        }
      };

      try {
        await historyController.updateDocumentFormMap(updateReq, {
          status: (statusCode) => ({
            json: (message) => {
              if (statusCode >= 400) {
                throw new Error(message.message);
              }
            },
            send: (message) => {
              if (statusCode >= 400) {
                throw new Error(message);
              }
            }
          })
        });
      } catch (error) {
        console.error('Error saving to documents:', error);
        return res.status(500).send('Internal Server Error: ' + error.message);
      }

      const mailOptions = {
        from: 'Stephan Hapi <codevisiondeveloper@gmail.com>',
        to: email,
        subject: 'Please sign here',
        text: `Dear ${name}, Here is the link to access the PDF form: ${uniqueLink}`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error('Error sending email: ', error);
      }
    }

    res.send('Emails sent with the PDF form link');
  } catch (error) {
    console.error('Error processing request: ', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
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

app.get('/getpdfform', async (req, res) => {
  const uniqueId = req.query.uniqueId;

  try {
    const formData = await historyController.getDocumentFormMap(uniqueId);

    if (formData.formDataMap) {
      res.json(formData.formDataMap);
    } else {
      res.status(404).send('Form data not found');
    }
  } catch (error) {
    return res.status(500).send('Internal Server Error: ' + error.message);
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
        filename: 'agreement.pdf',
        path: pdfFilePath
      }
    ]
  };
  // formDataMap.set(req.body.currentId, getCurrentFile());
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to send email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent with the PDF Agreement');
    }
  });
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(userRouter);
app.use(historyRouter);
app.use(folderRouter);

mongoose.connect(mongoURI).then(() => {
  console.log("Mongodb connected!");
}).catch((error) => {
  console.error(error);
})

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
https.createServer(options, app).listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server running`);
});
