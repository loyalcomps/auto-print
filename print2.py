# PRINTER_NAME = "EPSON LQ-1150II ESC/P2"

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import pdfkit
import win32api
import win32print

def print_pdf(pdf_file_path):
    with open(pdf_file_path, 'rb') as pdf_file:
        name = win32print.GetDefaultPrinter() 
        printdefaults = {"DesiredAccess": win32print.PRINTER_ALL_ACCESS} 
        handle = win32print.OpenPrinter(name, printdefaults)
        level = 2
        attributes = win32print.GetPrinter(handle, level)
        #attributes['pDevMode'].Duplex = 1  #no flip
        #attributes['pDevMode'].Duplex = 2  #flip up
        attributes['pDevMode'].Duplex = 3   #flip over
        win32print.SetPrinter(handle, level, attributes, 0)
        win32print.GetPrinter(handle, level)['pDevMode'].Duplex
        win32api.ShellExecute(0,'print','out.pdf',None,'/manualstoprint',0)

 


app = Flask(__name__)
CORS(app)

@app.route('/dotmatrix/print', methods=['POST'])
def index():
    prefix = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            font-size: 36px;
                        }
                    </style>
                </head>
                <body>
                <pre>
            """
    printer_data = prefix + request.form['printer_data'] + "</pre></html>"


    print(printer_data)
    # convert printer_data to pdf using wkhtmltopdf
    pdfkit.from_string(printer_data, 'out.pdf', options={'orientation': 'landscape', 'page-size': 'A4'})
    print_pdf('out.pdf')
    out = {'status':'OK'}
    return jsonify(out)

if __name__ == '__main__':
    app.run(port=8000, debug=True)

