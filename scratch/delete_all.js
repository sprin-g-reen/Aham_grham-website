const axios = require('axios');

async function deleteAll() {
    try {
        const res = await axios.get('http://localhost:5000/api/products');
        const products = res.data.value;
        console.log(`Found ${products.length} products.`);
        for (const p of products) {
            await axios.delete(`http://localhost:5000/api/products/${p._id}`);
            console.log(`Deleted: ${p.name} (${p._id})`);
        }
        console.log('All products removed.');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

deleteAll();
