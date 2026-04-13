const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            message: 'Hello from Jenkins CI/CD Pipeline!',
            version: process.env.APP_VERSION || '1.0.0',
            timestamp: new Date().toISOString()
        }));
    } else if (req.url === '/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ status: 'healthy' }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});// new feature
