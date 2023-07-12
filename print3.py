# PRINTER_NAME = "EPSON LQ-1150II ESC/P2"

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import pdfkit


 


app = Flask(__name__)
CORS(app)

@app.route('/dotmatrix/print', methods=['POST'])
def index():

    printer_data = request.form['printer_data']
    # print(printer_data)
    datas = printer_data.split('\n')
    invoice_number = datas[7].strip()
    customer_name = [x for x in datas[8].split("  ") if x != ''][0].strip()
    customer_address = [x for x in datas[9].split("  ") if x != ''][0].strip()
    date = [x for x in datas[9].split("  ") if x != ''][1].strip()
    payment_terms = [x for x in datas[12].split("  ") if x != ''][0].strip()
    sales_man = [x for x in datas[12].split("  ") if x != ''][0].strip()


    #find index of the list item which contains <img style=
    for data in datas:
        if '<img style=' in data:
            end_index = datas.index(data)
    line_items = []
    for i in range(16, end_index):
        if (datas[i] != '    ' and datas[i] != ' ' and datas[i] != '' and datas[i] != '         ' ):
            line_list = [x for x in datas[i].strip().split("  ") if x != '']
            if len(line_list) == 7:
                alist = [x.strip() for x in datas[i].split("  ") if x != '']
                dict = {
                    "sl_no":alist[0],
                    "item_name":alist[1],
                    "qty":alist[2],
                    "unit_price":alist[3],
                    "unit":alist[4],
                    "vat":alist[5],
                    "total":alist[6]
                }
                line_items.append(dict)
            elif len(line_list) > 7:
                n = len(line_list)
                alist = [x.strip() for x in datas[i].split("  ") if x != '']
                item_name = " ".join([item for item in alist[1:n-5]])
                print(item_name)
                dict = {
                    "sl_no":alist[0],
                    "item_name":item_name,
                    "qty":alist[n-5],
                    "unit_price":alist[n-4],
                    "unit":alist[n-3],
                    "vat":alist[n-2],
                    "total":alist[n-1]
                }
                line_items.append(dict)


    image_binary = [x for x in datas[end_index].split("  ") if x != ''][0]
    total_in_words = [x for x in datas[end_index].split("  ") if x != ''][1]
    gross_value = [x for x in datas[end_index].split("  ") if x != ''][2]
    total_in_words += " " + [x for x in datas[end_index+1].split("  ") if x != ''][0].strip()
    n = len([x for x in datas[end_index+1].split("  ") if x != '']) 
    discount = [x for x in datas[end_index+1].split("  ") if x != ''][n-1].strip()
    delivery_date = [x for x in datas[end_index+2].split("  ") if x != ''][0].strip()
    total_case = [x for x in datas[end_index+2].split("  ") if x != ''][1].strip()
    total_weight = [x for x in datas[end_index+2].split("  ") if x != ''][2].strip()
    taxable_value = [x for x in datas[end_index+3].split("  ") if x != ''][0].strip()
    net_value = [x for x in datas[end_index+5].split("  ") if x != ''][0].strip()
    print({"invoice_number":invoice_number, 
        "customer_name":customer_name, 
        "customer_address":customer_address, 
        "date":date,
        "payment_terms":payment_terms,
        "sales_man":sales_man,
        "line_items":line_items,
        "image_binary":image_binary,
        "total_in_words":total_in_words,
        "gross_value":gross_value,
        "discount":discount,
        "delivery_date":delivery_date,
        "total_case":total_case,
        "total_weight":total_weight,
        "taxable_value":taxable_value,
        "net_value":net_value
        })


    out = {'status':'OK'}
    return jsonify(out)

if __name__ == '__main__':
    app.run(port=8000, debug=True)

