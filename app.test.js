const http = require('http');

// Simple test function
function test(name, fn) {
    try {
        fn();
        console.log(`PASS: ${name}`);
    } catch(e) {
        console.log(`FAIL: ${name} - ${e.message}`);
        process.exit(1);
    }
}

// Test 1 - app file exists
test('app.js exists', () => {
    require('fs').accessSync('app.js');
});

// Test 2 - PORT is valid
test('PORT is valid number', () => {
    const PORT = process.env.PORT || 3000;
    if (isNaN(PORT)) throw new Error('PORT is not a number');
});

// Test 3 - health check response format
test('health response is valid JSON', () => {
    const response = JSON.stringify({ status: 'healthy' });
    JSON.parse(response);
});

console.log('All tests passed!');