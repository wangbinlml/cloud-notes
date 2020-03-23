const express = require('express');
const router = express.Router();
var markdownpdf = require("markdown-pdf");
const officegen = require('officegen');
const moment = require('moment');
const fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get("/docx", async (req, res, next) => {

    // Create an empty Word object:
    let docx = officegen('docx')

    // Officegen calling this function after finishing to generate the docx document:
    docx.on('finalize', function (written) {
        console.log(
            'Finish to create a Microsoft Word document.'
        )
    })

    // Officegen calling this function to report errors:
    docx.on('error', function (err) {
        console.log(err)
    })

    // Create a new paragraph:
    let pObj = docx.createP()

    pObj.addText('Simple')
    pObj.addText(' with color', {color: '000088'})
    pObj.addText(' and back color.', {color: '00ffff', back: '000088'})

    pObj = docx.createP()

    pObj.addText('Since ')
    pObj.addText('officegen 0.2.12', {
        back: '00ffff',
        shdType: 'pct12',
        shdColor: 'ff0000'
    }) // Use pattern in the background.
    pObj.addText(' you can do ')
    pObj.addText('more cool ', {highlight: true}) // Highlight!
    pObj.addText('stuff!', {highlight: 'darkGreen'}) // Different highlight color.

    pObj = docx.createP()

    pObj.addText('Even add ')
    pObj.addText('external link', {link: 'https://github.com'})
    pObj.addText('!')

    pObj = docx.createP()

    pObj.addText('Bold + underline', {bold: true, underline: true})

    pObj = docx.createP({align: 'center'})

    pObj.addText('Center this text', {
        border: 'dotted',
        borderSize: 12,
        borderColor: '88CCFF'
    })

    pObj = docx.createP()
    pObj.options.align = 'right'

    pObj.addText('Align this text to the right.')

    pObj = docx.createP()

    pObj.addText('Those two lines are in the same paragraph,')
    pObj.addLineBreak()
    pObj.addText('but they are separated by a line break.')

    docx.putPageBreak()

    pObj = docx.createP()

    pObj.addText('Fonts face only.', {font_face: 'Arial'})
    pObj.addText(' Fonts face and size.', {font_face: 'Arial', font_size: 40})

    docx.putPageBreak()

    pObj = docx.createP()

    // We can even add images:
    pObj.addImage('/Users/wangbin/workspace/api-docs/public/images/01_cloud-d77f99e2dc.png')

    // Let's generate the Word document into a file:

    let out = fs.createWriteStream('/Users/wangbin/workspace/api-docs/example.docx')

    out.on('error', function (err) {
        console.log(err)
    })


    var result = docx.generate(out);// 服务端生成word
    res.writeHead(200, {
        // 注意这里的type设置，导出不同文件type值不同application/vnd.openxmlformats-officedocument.wordprocessingml.document
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        'Content-disposition': 'attachment; filename=out' + moment(new Date().getTime()).format('YYYYMMDDhhmmss') + '.docx'
    });
    docx.generate(res);// 客户端导出word

});
module.exports = router;
