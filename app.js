const express = require('express');
const FileSystem = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');

const app = express();
const port = 8000;

app.set('view engine', 'ejs');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/dotmatrix/print', async (req, res) => {
  try {
    console.log('Printing request received.');

    const data = req.body['data'];
    const pdfPath = './print.pdf';

    const qc = data['qr_code_str'];

    // QRCode.toDataURL(qc, (err, url) => {
    //   if (err) {
    //     console.error('Error generating QR code', err);
    //     QRCode.toDataURL("Error in getting qr code data", function (err, url) {
    //       data['qrcode_url'] = url;
    //     });
    //     return;
    //   }

    //   data['qrcode_url'] = url;
      
      ejs.renderFile('./views/print.ejs', data, async (err, html) => {
        if (err) {
          console.error('Error rendering EJS template:', err);
          res.status(500).send('An error occurred while creating html.');
          return;
        }

        FileSystem.writeFileSync('./views/print.html', html);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf({ path: pdfPath, format: 'A4' });
        await browser.close();

        console.log('PDF file saved successfully.');
        res.status(200).send('PDF created successfully.');
      });
    // });

  } catch (error) {
    console.error('Printing error:', error);
    res.status(500).send('An error occurred while printing.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
