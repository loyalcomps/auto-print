const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');
const { print } = require('pdf-to-printer');
const ejs = require('ejs');

const wkhtmltopdf = require('wkhtmltopdf');

const app = express();
const port = 8000;

app.set('view engine', 'ejs');

app.use(
    cors()
  );
  
// Parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
  }
);

app.post('/dotmatrix/print', async (req, res) => {
  try {
    console.log('Printing request received.');

    const data  = req.body['data']; // Assuming the HTML string is passed in the request body




    console.log(data);
    const pdfPath = './print.pdf'; // Specify the path and filename for the saved PDF file

    const QRCode = require('qrcode');

    const qc = data['qr_code_str'];
    
    console.log(qc);

    QRCode.toDataURL(qc, function (err, url) {
      data['qrcode_url'] = url;
      if (err) {
        QRCode.toDataURL("Error in getting qr code data", function (err, url) {
          data['qrcode_url'] = url;
        });
        // console.error('Error generating QR code', err);
        // return;
      }

      console.log(url);
    });


    ejs.renderFile('./views/print.ejs', data, (err, html) => {
      console.log(html);
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while creating html.');
        return;
      }
      wkhtmltopdf(html, { output: pdfPath, orientation:"Landscape", disableSmartShrinking:false, enableExternalLinks:true}, error => {
        if (error) {
          console.error('PDF Conversion error:', error);
          res.status(500).send('An error occurred while printing.');
        } else {
          console.log('PDF file saved successfully.');
          res.status(200).send('PDF created successfully.');
        }
      });
    });

    // await print('./print.pdf', { orientation: 'landscape', paperSize: 'sindal' });
    // res.status(200).send('Print job sent to printer.');

  } catch (error) {
    console.error('Printing error2:', error);
    res.status(500).send('An error occurred while printing.');
  }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });