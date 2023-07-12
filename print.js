const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const port = 8000;


app.use(
    cors()
  );
  
// Parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/dotmatrix/print', (req, res) => {
    try {
      console.log('Printing request received.');
  
      const { printer_data } = req.body; // Assuming the HTML string is passed in the request body
  
      // Add <pre> tags to the HTML string to preserve the formatting
      const htmlStringWithPreTags = `<pre>${printer_data}</pre>`;
  
      // Print the HTML string using print-js
      printJS({ printable: htmlStringWithPreTags, type: 'html' });
  
      console.log('Print job sent to printer.');
      res.status(200).send('Print job sent to printer.');
  
    } catch (error) {
      console.error('Printing error:', error);
      res.status(500).send('An error occurred while printing.');
    }
  });
  


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  