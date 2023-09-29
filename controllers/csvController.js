const fs = require('fs');
const csvParser = require('csv-parser');
const Csv = require('../models/csv');
const path = require('path');

// TO HANDLE FILE UPLOADS
module.exports.upload = async function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).send('Please select a file first');
        }
        // IF FILE IS NOT IN CSV FORMAT
        if (req.file.mimetype !== 'text/csv') {
            return res.status(400).send('Please upload csv files only!');
        }

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async () => {
                if (req.file) {
                    const oldPath = req.file.path;
                    const newPath = path.join(__dirname, '../uploads', req.file.originalname);
                    fs.rename(oldPath, newPath, (err) => {
                        if (err) throw err;
                    });
                    const csvData = new Csv({
                        filename: req.file.originalname,
                        header_row: results[0],
                        data_rows: results.slice(1),
                    });
                    await csvData.save();
                }
                else {
                    res.status(400).send('No files uploaded')
                }
                return res.redirect('/');
            })


    }
    catch (err) {
        console.log("Error occured while uploading file", err);
    }
}

// FUNTION TO VIEW CSV FILE
module.exports.view = async function (req, res) {
    try {
        const csvFile = await Csv.findById(req.params.id);
        if (!csvFile) {
            return res.status(400).send("File not found!!");
        }

        // FETCHING FILE CONTENT AND DISPLAYING
        const uploadsPath = path.join(__dirname, '../uploads');
        const fileData = await new Promise((resolve, reject) => {
            fs.readFile(path.join(uploadsPath, csvFile.filename), 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    // PARSE THE CSV CONTENT AND DISPLAY IN VIEW
                    const rows = data.trim().split('\n');
                    const header_row = rows[0].split(',');
                    const data_rows = rows.slice(1).map(row => {
                        const row_data = {};
                        row.split(',').forEach((value, index) => {
                            row_data[header_row[index]] = value;
                        });
                        return row_data;
                    });
                    resolve({ fileName: csvFile.filename, header_row, data_rows });
                }
            });
        });
        console.log(fileData);
        res.render('csv_view', {
            fileData,
            title: 'CSV File',
            style: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">',
            script: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>',
        });

    }
    catch (err) {
        console.log("error!",err);
    }
}