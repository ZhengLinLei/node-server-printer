// Define your model constructor
const CONFIG = require('../config/server');
const Printer = require(CONFIG.os == 'win32' ? 'pdf-to-printer' : 'unix-print');

const fs = require('fs');

const Model = {
    Printer: Printer,

    DATA_DEFAULT: ['printer'],

    tmpNameGenerator: (length) => {
        // https://stackoverflow.com/a/1349426/17844375

        // Return random length string

        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    getDefaultPrintingOptions: () => {
        let options;

        Model.DATA_DEFAULT.forEach(el =>{
            let output = fs.readFileSync(`../data/${el}.txt`, 'utf8');

            options[el] = output;
        });

        // Replace [default] to default
        return options;
    },

    printFile: (filepath, options, def, fnc) =>{
        let optionsDef = Model.getDefaultPrintingOptions();
        
        // Configurate options 
        options.printer = options.printer || (optionsDef['printer'] != "[default]")? optionsDef['printer']: def['printer'];

        Printer.print(filepath, options).then(fnc);

        return true;
    }
}

module.exports = Model;