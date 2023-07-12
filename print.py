from flask import Flask, request
import win32print
import tempfile
import os

app = Flask(__name__)

@app.route('/print', methods=['POST'])
def print_pdf():
    if 'file' not in request.files:
        return 'No file uploaded.', 400

    file = request.files['file']
    if file.filename == '':
        return 'No file selected.', 400

    temp_file = tempfile.NamedTemporaryFile(delete=False)
    temp_file.write(file.read())
    temp_file.close()

    printer_name = win32print.GetDefaultPrinter()

    # Print the PDF file
    win32print.ShellExecute(0, "print", temp_file.name, '/d:"%s"' % printer_name, ".", 0)

    # Remove the temporary file
    os.remove(temp_file.name)

    return 'PDF sent to printer.'

if __name__ == '__main__':
    app.run(port=8001, debug=True)
