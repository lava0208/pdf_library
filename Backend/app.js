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

//...
const Doc = require('./models/history')
const userRouter = require('./routes/userRoute');
const historyRouter = require('./routes/historyRoute');

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

const options = {
  key: fs.readFileSync("./cert/privkey1.pem"),
  cert: fs.readFileSync("./cert/fullchain1.pem"),
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

app.post('/sendlink', upload.single('pdfFile'), (req, res) => {
  const pdfFilePath = getCurrentFile();
  const pdfFileData = fs.readFileSync(pdfFilePath);
  const base64Data = pdfFileData.toString('base64');
  const dataUri = `data:application/pdf;base64,${base64Data}`;

  if (!req.file) {
    return res.status(400).send('No PDF file uploaded.');
  }

  const formData = req.body.pdfFormData;
  const textData = req.body.pdfTextData;
  const name = req.body.name;
  const description = req.body.description;

  // Get the array of selected emails from the request body
  const selectedEmails = req.body.emails.split(",");

  if (!selectedEmails || selectedEmails.length === 0) {
    return res.status(400).send('No recipient email addresses provided.');
  }

  // Iterate over each selected email and send an email
  selectedEmails.forEach(email => {
    let newDataSet = [];
    const uniqueId = uuid.v4();
    const uniqueLink = `https://pdf-vision.com/pdfviewer/?id=${uniqueId}`;

    newDataSet.push({
      pdfData: dataUri,
      formData: formData,
      textData: textData,
      name: name,
      email: email,
      description: description
    })
  
    formDataMap.set(uniqueId, newDataSet);

    // Send email to client with the unique link
    const mailOptions = {
      from: 'Stephan Hapi <codevisiondeveloper@gmail.com>',
      to: email,
      subject: 'Please sign here',
      text: `Dear ${name}, Here is the link to access the PDF form: ${uniqueLink}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });

  res.send('Emails sent with the PDF form link');
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

app.post('/history', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No PDF file uploaded.');
    }

    const pdfFilePath = getCurrentFile(); // This function should return the path to the PDF file
    const pdfFileData = fs.readFileSync(pdfFilePath);
    const base64Data = pdfFileData.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Data}`;

    const uniqueId = uuid.v4();
    let newDataSet = [];

    const formData = req.body.pdfFormData;
    const textData = req.body.pdfTextData;

    newDataSet.push({
      pdfData: dataUri,
      formData: formData,
      textData: textData,
    })

    formDataMap.set(uniqueId, newDataSet);

    const history = JSON.parse(req.body.history); // Parse the history JSON string

    const uniqueLink = `https://pdf-vision.com/pdfviewer/?id=${uniqueId}&draft=true`;

    // Create and save the new document
    const newDocument = new Doc({
      uniqueId,
      pdfData: dataUri,
      formData,
      textData,
      history,
      uniqueLink
    });

    await newDocument.save();

    res.status(201).json({ message: 'Document saved successfully', uniqueLink });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred: ' + error.message);
  }
});

app.put('/history/:uniqueId', upload.single('pdfFile'), async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const updateData = {};
    if (req.file) {
      const pdfFilePath = req.file.path;
      const pdfFileData = fs.readFileSync(pdfFilePath);
      const base64Data = pdfFileData.toString('base64');
      const dataUri = `data:application/pdf;base64,${base64Data}`;
      updateData.pdfData = dataUri;
    }
    if (req.body.pdfFormData) {
      updateData.formData = req.body.pdfFormData;
    }
    if (req.body.pdfTextData) {
      updateData.textData = req.body.pdfTextData;
    }
    if (req.body.history) {
      let history = typeof req.body.history === 'string' ? JSON.parse(req.body.history) : req.body.history;
      updateData.history = history;
    }

    const updatedDocument = await Doc.findOneAndUpdate({ uniqueId }, { $set: updateData }, { new: true });

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred: ' + error.message);
  }
});

app.get('/history/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const document = await Doc.findOne({ uniqueId });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred: ' + error.message);
  }
});

app.get('/history', async (req, res) => {
  try {
    const documents = await Doc.find({});
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred: ' + error.message);
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(userRouter);
app.use(historyRouter);

mongoose.connect(mongoURI).then(() => {
  console.log("Mongodb connected!");
}).catch((error) => {
  console.error(error);
})

// Start the server
// app.listen(8081, () => {
//   console.log('Server is running on port 8081');
// });
https.createServer(options, app).listen(8081, "94.72.120.252", () => {
  console.log(`Server running`);
});