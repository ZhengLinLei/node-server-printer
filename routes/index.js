const express = require('express');
const router = express.Router();

const Controller = require('../controllers/controller');

// Personalizate
router.get('/', (req, res) =>{
    // Replace all here to your project main frontend files
    res.render('index', {
        title: "Welcome!"
    })
});

/* ... */

// Module default
router.get('/config', async (req, res) =>{
    // Get printer list to config
    let def = await Controller.getPrinter();        // Get the Default Printer
    let printers = await Controller.getPrinters();    // Get the list of Printers

    res.render('config', {
        def,
        printers
    });
});
router.post('/config', (req, res) =>{
    // You can modify this method, or disable the config page
    // You can call all this options with controller file with code

    // Set user default preferences
    let body_param = Controller.DATA_DEFAULT;

    body_param.forEach(el =>{
        // Save each body param
        if(!Controller.setConfig(el, req.body[el])){
            res.json({
                "status":  "error",
                "message": "Saving data in file <controller>"
            });
        }
    });

    res.json({"status":  "ok"});
});

router.get('/zheng', async (req, res) => {
    let def = await Controller.getPrinter(); 
    res.render('print', {
        def
    });
});
router.get('/cashDrawer', (req, res) =>{
    res.render('cashDrawer');
});

router.get('/openCashDrawer', (req, res) =>{
    // DISABLE OR ACTIVE THIS OPTION
    const activate = true;

    if(activate){
        try {
            Controller.openCashDrawer()
            res.json({"status":  "ok"});
        } catch (error) {
            res.json({
                "status":  "error",
                "code": "escpos-error",
                "message": error
            });
        }
    }

});

router.post('/print/:type/:printer?', async (req, res) =>{
    // The type paerameter must be [file, html]
    // File .jpg, .pdf, .png; <file> event
    // Html in string

    // Optional printer parameter, you can set the default printer name by calling 
    // 1 |
    // 2 | let printerName = 'ExampleName';
    // 3 | Controller.setConfig('printer', printerName);
    // 4 |
    // 5 | // Remmenber that you must have imported the <controller> file in path '/controllers/controller.js' from root folder relative path

    // In post body must specify the options to print
    // Template options in https://github.com/artiebits/pdf-to-printer#printpdf-options--promisevoid (win32) and  https://github.com/artiebits/unix-print#printpdf-printer-options--promisevoid (UNIX)

    // Example options to declare for printing: POST (printOptions: <json>)
    // let option = {
    //     printer: 'Zebra', [can be declared in GET parameter, if you specify this option, the system will choose this option as first printer]
    //     pages: "1-3,5", [The number of page that the client want to print: syntax <num-num> will print the pages from "num" to "num", <num, num> will only print the "num" and "num" pages]
    //     subset: "odd | even", [Will print odd pages only when value is "odd". Will print even pages only when "even"] 
    //     scale: "noscale | shrink | fit",
    //     copies: 1 [Specifies how many copies will be printed]
    //     ... [More options in https://github.com/artiebits/pdf-to-printer#printpdf-options--promisevoid]
    // }
    
    // By the way if you want to create a pdf file with `html` type option. Please specify '/print/html/:printer?' and pass the conversion option
    // Example option: POST (pdfOptions: <json>)
    // let config = {
    //     // Export options
    //     "directory": "/tmp",       // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'
    //     // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
    //     "height": "10.5in",        // allowed units: mm, cm, in, px
    //     "width": "8in",            // allowed units: mm, cm, in, px
    //     - or -
    //     "format": "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
    //     "orientation": "portrait", // portrait or landscape
    //     // Page options
    //     "border": "0",             // default is 0, units: mm, cm, in, px
    //     //- or -
    //     "border": {
    //         "top": "2in",            // default is 0, units: mm, cm, in, px
    //         "right": "1in",
    //         "bottom": "2in",
    //         "left": "1.5in"
    //     },
    //     paginationOffset: 1,       // Override the initial pagination number
    //     "header": {
    //         "height": "45mm",
    //         "contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
    //     },
    //     "footer": {
    //         "height": "28mm",
    //         "contents": {
    //         first: 'Cover page',
    //         2: 'Second page', // Any page number is working. 1-based index
    //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
    //         last: 'Last Page'
    //         }
    //     },
    //     // Rendering options
    //     "base": "file:///home/www/your-asset-path/", // Base path that's used to load files (images, css, js) when they aren't referenced using a host
    //     // Zooming option, can be used to scale images if `options.type` is not pdf
    //     "zoomFactor": "1", // default is 1
    //     // File options
    //     "type": "pdf",           // allowed file types: png, jpeg, pdf
    //     "quality": "75",         // only used for types png & jpeg
    //      ... More information in: https://www.npmjs.com/package/html-pdf?activeTab=readme
    // }
    // 


    if(Controller.ACCEPTED_TYPE_FILE.includes(req.query.type)){

        // Pass the parameters
        let tmpFile;


        switch (req.query.type) {
            case Controller.ACCEPTED_TYPE_FILE[0]:
                tmpFile = await Controller.uploadedFile(req.files);
                break;
            
            case Controller.ACCEPTED_TYPE_FILE[1]:
                tmpFile = await Controller.createdFile(req.body.html, (req.body.pdfOptions || {}));

                if(!tmpFile){
                    res.json({
                        "status": "error",
                        "code": "pdf-conversion",
                        "message": "An unexpected error when was processing to convert html to pdf"
                    });

                    return false;
                }
                break;

            default:
                res.json({
                    "status":  "error",
                    "code": "type-error",
                    "message": "Upload the file or html string"
                });
                break;
        }

        Controller.printFile(tmpFile, (req.body.printOptions || {}), () =>{
            // Successfully printed
            res.json({
                "status": "ok",
                "message": "Metadata succesfully printed"
            })
        })
    }else{
        res.json({
            "status":  "error",
            "code": "type-error",
            "message": "You are trying to pass a type parameter different between [file | html]"
        });
    }
});

module.exports = router;