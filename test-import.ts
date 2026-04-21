import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PDFParse = require('pdf-parse');
console.log('Import keys:', Object.keys(PDFParse));
console.log('Is PDFParse.PDFParse a function?', typeof PDFParse.PDFParse === 'function');
