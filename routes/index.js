var express = require('express');
var router = express.Router();
var PDFDocument = require('pdfkit')
var Lob = require('Lob')
var fs = require('fs')
TestLob = new Lob("test_73946c981c8a199cd73fcefde1c60058536")

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'BreezeLetter' });
});

router.get('/sendpdf2', function(req, res) {
  createLobObject(generatePDF2())
  res.render('index', {title: 'Letter sent' });
});
router.get('/sendpdf', function(req, res) {
  createLobObject(generatePDF1())
  res.render('index', {title: 'Letter sent' });
});

generatePDF1 = function() {

  filename = "/tmp/output-" + new Date().getTime() + ".pdf";
  var doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filename));
  doc.fontSize(20);
  doc.text("Title of my document", 100, 100)
     .font('Times-Roman');
  // and some justified text wrapped into columns

  randomText = "The quick brown fox jumped over the lazy dogs.";

  doc.text('And here is some wrapped text...', 100, 200)
     .font('Times-Roman', 10)
     .moveDown()
  // end and display the document in the iframe to the right

  doc.text(randomText, 100, 300);

  doc.end();
  console.log(filename);
  return filename;
};

createLobObject = function(filename) {
  console.log(filename);
  TestLob.objects.create({
    name: 'TestGenerated-' + filename,
    file: "@" + filename,
    setting_id: 100
  }, function (err, res) {
    console.log("----------Lob response: ")
    console.log(err, res);
  });
};
generatePDF2 = function() {

  // Create a document
  var doc = new PDFDocument();

  // Pipe it's output somewhere, like to a file or HTTP response
  // See below for browser usage
  filename = "/tmp/output-" + new Date().getTime() + ".pdf"
  doc.pipe(fs.createWriteStream(filename))

  // Embed a font, set the font size, and render some text
//  doc.font('fonts/PalatinoBold.ttf')
//     .fontSize(25)
//     .text('Some text with an embedded font!', 100, 100);

  // Add another page
  doc.addPage()
     .fontSize(25)
     .text('Here is some vector graphics...', 100, 100);

  // Draw a triangle
  doc.save()
     .moveTo(100, 150)
     .lineTo(100, 250)
     .lineTo(200, 250)
     .fill("//FF3300")

  // Apply some transforms and render an SVG path with the 'even-odd' fill rule
  doc.scale(0.6)
     .translate(470, -380)
     .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
     .fill('red', 'even-odd')
     .restore();

  // Add some text with annotations
  doc.addPage()
     .fillColor("blue")
     .text('Here is a link!', 100, 100)
     .underline(100, 100, 160, 27, {color: "//0000FF"})
     .link(100, 100, 160, 27, 'http://google.com/');

  // Finalize PDF file
  doc.end();
  return filename;


};

module.exports = router;
