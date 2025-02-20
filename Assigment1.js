const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const logFilePath = path.join(__dirname, 'requests.log');


app.use((req, res, next) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname,
        query: req.query,
        headers: req.headers,
        userAgent: req.get('User-Agent'),
    };

    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    next();
});

app.use((req, res, next) => {
    fs.stat(logFilePath, (err, stats) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error checking log file size:', err);
        } else if (!err && stats.size >= 1 * 1024 * 1024) {
            const rotatedLogPath = logFilePath.replace('.log', `-${Date.now()}.log`);
            fs.rename(logFilePath, rotatedLogPath, (renameErr) => {
                if (renameErr) {
                    console.error('Error rotating log file:', renameErr);
                }
            });
        }
    });
    next();
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/test', (req, res) => {
    res.send('Testing logging functionality.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
