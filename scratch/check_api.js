const http = require('http');

http.get('https://aham-grham-website.vercel.app/api/products', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('RAW JSON:', data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
