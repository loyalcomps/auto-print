const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const wkhtmltopdf = require('wkhtmltopdf');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/dotmatrix/print', async (req, res) => {
  try {
    console.log('Printing request received.');

    const { printer_data } = req.body; // Assuming the HTML string is passed in the request body

    // Add <pre> tags to the HTML string to preserve the formatting
    const htmlStringWithPreTags = `<pre>${printer_data}</pre>`;

    console.log(printer_data);

    const pdfPath = './print.pdf'; // Specify the path and filename for the saved PDF file

    // Generate the PDF from the HTML string and save it to the file with pagesize A4 in landscape mode
    wkhtmltopdf(htmlStringWithPreTags, { output: pdfPath, pageSize: "A4", orientation:"Landscape" }, error => {
      if (error) {
        console.error('PDF Conversion error:', error);
        res.status(500).send('An error occurred while printing.');
      } else {
        console.log('PDF file saved successfully.');

        // Read the PDF file as a buffer
        const pdfBuffer = fs.readFileSync(pdfPath);

        // Send the PDF file to the Flask app
        axios.post('http://localhost:8001/print', pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf'
          }
        })
          .then(response => {
            console.log('Print job sent to printer.');
            res.status(200).send('Print job sent to printer.');
          })
          .catch(error => {
            console.error('Printing error:', error);
            res.status(500).send('An error occurred while printing.');
          });
      }
    });
  } catch (error) {
    console.error('Printing error:', error);
    res.status(500).send('An error occurred while printing.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
