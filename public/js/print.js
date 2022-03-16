let ProductTable;

window.addEventListener('load', ()=>{
    // Remove line
    ProductTable = document.getElementById('product-table'); 
});

window.addEventListener('keydown', e => {
    if(e.ctrlKey){
        if(['l', 'z'].includes(e.key)){
            e.preventDefault();
            switch (e.key) {
                case "l":
                    appendRow();
                    break;
            
                case "z":
                    undoRow();
                    break;
            }
        }
    }
});

const deleteRow = (el) =>{
    let index = el.parentNode.parentNode.parentNode.rowIndex;
    ProductTable.deleteRow(index);

    if(!ProductTable.tBodies[0].rows.length){
        appendRow();
    }

    calcProduct();
}

const appendRow = () =>{
    ProductTable.tBodies[0].innerHTML += `
        <tr>
            <td class="pt-3-half" contenteditable="true">1</td>
            <td class="pt-3-half" contenteditable="true"></td>
            <td class="pt-3-half" contenteditable="true" onblur="calcTotal()"></td>
            <td>
                <span class="table-remove"><a type="button" onclick="deleteRow(this)" class="text-danger my-0">删除</a></span>
            </td>
        </tr>
    `;

    calcProduct();
}

const deleteAll = () =>{
    ProductTable.tBodies[0].innerHTML = '';

    appendRow();

    calcProduct();
}

const undoRow = () =>{
    ProductTable.deleteRow(ProductTable.rows.length-1);

    if(!ProductTable.tBodies[0].rows.length){
        appendRow();
    }

    calcProduct();
}

// TOTAL
const calcProduct = () =>{
    document.querySelector('.pr').innerText = parseInt(ProductTable.tBodies[0].rows.length);
}
const calcTotal = (r = false) =>{
    let calc = 0;
    for(let row of ProductTable.tBodies[0].rows){
        calc += parseFloat(row.cells[1].innerText || 0);
    }

    if(r){
        return calc.toFixed(2);
    }

    document.querySelector('.total').innerHTML = calc.toFixed(2);
    document.querySelector('.iva').innerHTML = (calc*0.2).toFixed(2);
}


// =====================

let html_a_r = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Recibo ZLL</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet"><style>body{font-size:14px}*{margin:0;padding:0;box-sizing:border-box;font-family:'Roboto',Arial,Helvetica,sans-serif}.barcode{font-family:'Libre Barcode 39',cursive;font-size:42px}.info{margin:10px 0}#top,#bot{border-bottom:1px solid #EEE}#bot{margin:10px 0 0}table{width:100%;border-collapse:collapse}td{padding:5px}.tabletitle{padding:5px;font-size:14px;background:#EEE}.tabletitle td{text-align:center}.right{float:right}table.total td{padding:2px}</style>
</head>
<body>
    <div id="invoice-POS">
        <center id="top">
            <div class="info">
                <h1>Bazar y<br>Alimentación</h1>
            </div>
            <div class="info">
                <p>
                    CIF: xxxxxxxxx</br>
                    Tel. xxxxxxxxx</br>
                </p>
            </div>
        </center>
        <div id="bot">
            <div id="table">
                <table>
                    <tr class="tabletitle">
                        <td class="amount">
                            <h5>CANT.</h5>
                        </td>
                        <td class="item">
                            <h5>PRE.</h5>
                        </td>
                        <td class="Hours">
                            <h5>PROD.</h5>
                        </td>
                        <td class="Rate">
                            <h5>SUMA</h5>
                        </td>
                    </tr>
                    <tr class="tabletitle">

                    **#2#**
                    
                </table>
                <div class="payment" style="display:flex; justify-content: flex-end; margin-top: 10px;">
                    <table class="total" style="width: 50%; margin: 10px 0;">
                        <tr>
                            <td><b>Sub Total:</b></td>
                            <td class="right">**#3#** €</td>
                        </tr>
                        <tr>
                            <td>Añadido:</td>
                            <td class="right">**#4#** €</td>
                        </tr>
                        <tr>
                            <td style="font-size:14px"><h3>Total:</h3></td>
                            <td class="right" style="font-size:14px"><b>**#5#** €</b></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <footer style="margin: 20px 0; text-align: center;">
            <div style="margin: 20px 0 50px 0;">
                <div style="display: flex; justify-content: space-around;">
                    <div><b>Pagado: </b> **#6#** €</div>
                    <div><b>Cambio: </b> **#7#** €</div>
                </div>
            </div>
            <h4>IVA INCLUIDO</h4>
            <h4>GRACIAS POR SU COMPRA</h4>
        </footer>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <p>**#0#**</p>
            <p>**#1#**</p>
        </div>
    </div>
</body>
</html>
`;

let html_a_b = `
    <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Recibo ZLL</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet"><style>body{font-size:14px}*{margin:0;padding:0;box-sizing:border-box;font-family:'Roboto',Arial,Helvetica,sans-serif}.barcode{font-family:'Libre Barcode 39',cursive;font-size:42px}.info{margin:10px 0}#top,#bot{border-bottom:1px solid #EEE}#bot{margin:10px 0 0}table{width:100%;border-collapse:collapse}td{padding:5px}.tabletitle{padding:5px;font-size:14px;background:#EEE}.tabletitle td{text-align:center}.right{float:right}table.total td{padding:2px}</style>
        </head>
        <body>
            <div id="invoice-POS">
                <center id="top">
                    <div class="info">
                        <h1>Bazar y<br>Alimentación</h1>
                    </div>
                    <div class="info" style="padding: 20px 0;">
                        <h3>Factura</h3>
                        <br>
                        <br>
                        <div style="display: flex;justify-content: space-around;">
                            <p>
                                xxxxx</br>
                                <b>NIF:</b> xxxxxxxx<br>
                                <br>
                                <b>CIF:</b> xxxxxxxxx</br>
                                <b>Tel.</b> xxxxxxxxx</br>
                            </p>
                            <p>
                                <b>Receptor.</b> **#8#**</br>
                            </p>
                        </div>
                        <div style="padding: 5px;margin:20px 3mm;border: 1px solid #000;">
                            <p>Fecha emision: **#1#**</p>
                            <p>Hora emision: **#0#**</p>
                            <p>Emitido para: **#8#**</p>
                        </div>
                    </div>
                </center>
                <div id="bot">
                    <div id="table">
                        <table>
                            <tr class="tabletitle">
                                <td class="amount">
                                    <h5>CANT.</h5>
                                </td>
                                <td class="item">
                                    <h5>PRE.</h5>
                                </td>
                                <td class="Hours">
                                    <h5>PROD.</h5>
                                </td>
                                <td class="Rate">
                                    <h5>SUMA</h5>
                                </td>
                            </tr>

                            **#2#**
                            
                        </table>
                        <div class="payment" style="display:flex; justify-content: flex-end; margin-top: 10px;">
                            <table class="total" style="width: 50%; margin: 10px 0;">
                                <tr>
                                    <td><b>Sub Total:</b></td>
                                    <td class="right">**#3#** €</td>
                                </tr>
                                <tr>
                                    <td>Añadido:</td>
                                    <td class="right">**#4#** €</td>
                                </tr>
                                <tr>
                                    <td style="font-size:14px"><h3>Total:</h3></td>
                                    <td class="right" style="font-size:14px"><b>**#5#** €</b></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <footer style="margin: 20px 0; text-align: center;">
                    <div style="margin: 20px 0 50px 0;">
                        <div style="display: flex; justify-content: space-around;">
                            <div><b>Pagado: </b> **#6#** €</div>
                            <div><b>Cambio: </b> **#7#** €</div>
                        </div>
                        <div style="display: flex; justify-content: space-around;margin-top: 10px;">
                            <div><b>Precio bruto:</b> **#3#** €</div>
                            <div><b>IVA (21%):</b> **#4#** €</div>
                        </div>
                    </div>
                    <div style="margin: 50px 0; text-align:justify; font-size: 12px; color: rgb(49, 48, 48);">
                        <p>En vista del cumplimiento de la normativa europea 2016/679 sobre Protección de datos (RGPD) le informamos que el tratamiento de los datos proporcionados por Ud. será responsabilidad de (Nombre de responsables, representantes o delegados de tratamiento) con el objetivo de (Finalidad del Tratamiento), y que además se compromete a no ceder o comunicar la información a terceros. Puede ejercer sus derechos de acceso, rectificación, cancelación o supresión del tratamiento a través del local dirección física.</p><br>
                        <p>El importe de dicha factura es el total del importe incluido los IVA, dichos impuestos representan el 21% del total. Cualquier duda sobre el precio puede comunicarlo al local correspondiente </p><br>
                        <p>Reclamaciones en el local: xxxxxxxxx</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <h4>Firma o cuño</h4>
                        <div style="height: 90px;margin:20px 0;border: 1px solid black;"></div>
                    </div>
                </footer>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <p>**#0#**</p>
                    <p>**#1#**</p>
                </div>
            </div>
        </body>
        </html>
`;

let html_b = `
<tr class="service">
    <td class="tableitem">
        <p class="itemtext">**#0#** x</p>
    </td>
    <td class="tableitem">
        <p class="itemtext">**#1#**</p>
    </td>
    <td class="tableitem">
        <p class="itemtext">
            <p>**#2#**</p>
        </p>
    </td>
    <td class="tableitem right">
        <p class="itemtext">**#3#**</p>
    </td>
</tr>`;


const productArr = () =>{
    let arr = [];

    for(let row of ProductTable.tBodies[0].rows){
        let m_arr = [parseInt(row.cells[0].innerText) || 0,
                     parseFloat(row.cells[1].innerText).toFixed(2) || 0,
                     row.cells[2].innerText];

        m_arr[3] = (m_arr[0] * m_arr[1]).toFixed(2);


        arr.push(m_arr);
    }

    return arr;
}
// Print 
const calcParam = () =>{
    let html = "";
    let p_arr = productArr();

    p_arr.forEach(el =>{
        let template = html_b;
        for (let i = 0; i < el.length; i++) {
            template = template.replace(`**#${i}#**`, el[i]);
        }

        html += template;
    });

    let date = new Date();
    let to = calcTotal(true);
    let param = [`${date.getHours()}:${date.getMinutes()}`, `${date.toLocaleString().split(',')[0]}`, html, (to-(to*0.2)).toFixed(2), (to*0.2).toFixed(2), to];
    param[6] = parseFloat(prompt('付款: ')).toFixed(2);
    param[7] = (param[6] - to).toFixed(2);

    return param;
}
const printReceipt = () =>{
    let main_html = html_a_r;
    calcParam().forEach((el, index) =>{
        main_html = main_html.replaceAll(`**#${index}#**`, el);
    });

    printAll(main_html);
}

const printBill = () =>{
    let main_html = html_a_b;

    let param = calcParam();
    param[8] = prompt('客户名字: ');

    param.forEach((el, index) =>{
        main_html = main_html.replaceAll(`**#${index}#**`, el);
    });

    printAll(main_html);
}


   
const printAll = html =>{

}