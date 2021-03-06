const fs = require('fs');
const fs_e = require('fs-extra');
const path = require('path');

var pdf = require('html-pdf');

const escpos = require('escpos');

// Model
const Model = require('../models/model');

const Controller = {
    // Clean '/tmp/' folder
    cleanTMP_: () => {
        console.log('[server] Cleaning Temporal Files...');
        fs_e.emptyDirSync('./tmp');
    },

    DATA_DEFAULT: Model.DATA_DEFAULT,
    // Set config
    setConfig: (param, value) => {

        if(Model.DATA_DEFAULT.includes(param)){
            // Open data files
            fs.writeFileSync(path.join(__dirname, `../data/${param}.txt`), value);

            return true;
            // All datas are stored in '/data' folder from root folder relative path
        }

        console.log(`Parameter: ${param}; doesn't exist, please check the allowed options in Model.DATA_DEFAULT array`);
        return false;
        
    },

    // Printers
    getPrinters: async () => {
        // win32: https://github.com/artiebits/pdf-to-printer#getprinters--promiseprinter
        // unix: https://github.com/artiebits/unix-print#getprinters--promiseprinter
        return await Model.Printer.getPrinters()
        .then(e => {
            return e;
        });
    },

    getPrinter: async () => {
        // win32: https://github.com/artiebits/pdf-to-printer#getdefaultprinter--promiseprinter--null
        // unix: https://github.com/artiebits/unix-print#getdefaultprinter--promiseprinter--null
        let pr = fs.readFileSync('./data/printer.txt', 'utf8');
        if(pr == "[default]"){
            return await Model.Printer.getDefaultPrinter();
        }else{
            return {
                name: pr
            };
        }
    },

    ACCEPTED_TYPE_FILE: ['file', 'html'],

    // Print documents

    // Move and print
    uploadedFile: req => {
        // Move uploaded file to tmp folder ans return the path name to print
        let file = req.files.file;

        let name = Model.tmpNameGenerator(5) + file.name;

        file.mv('./tmp/' + name);

        return name;
    },

    // Create pdf file
    createdFile: async (html, options) => {
        let name = Model.tmpNameGenerator(8) + '.pdf';

        try {
            await pdf.create(html, options).toFile('./tmp/' + name); // Asynchronus function
            return name;
        } catch (error) {
            return false;
        }
    },

    // Final proccess: Print
    printFile: (filename, options, fnc) => {
        Model.printFile('../tmp/'+filename, options, {
            "printer": Controller.getPrinter().name
        }, fnc);
    },


    // Open the cash drawer for receipt printer
    openCashDrawer: () => {
        const device 	= new escpos.USB(); // 0x0416, 0x5011
        var printer 	= new escpos.Printer(device);

        printer.cashdraw();

        return true;
    }
}

module.exports = Controller;