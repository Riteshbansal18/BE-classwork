const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const port = 3000;

app.use((req, res, next) => {
    const logData = `
        Timestamp: ${new Date().toISOString()},
        IP: ${req.ip},
        URL: ${req.originalUrl},
        Protocol: ${req.protocol},
        HTTP Method: ${req.method},
        Hostname: ${req.hostname}
    `;

    fs.appendFile(path.join(__dirname, 'requests.log'), logData + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });

    next();
});

app.get('/', (req, res) => {
    res.send('back end assignment');
});

app.listen(port, () => {
    console.log(Server is running on port ${port});
});
