const testPost = async () => {
  try {
    const response = await fetch('https://aham-grham-website.vercel.app/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Product',
        price: 99,
        category: 'Test',
        description: 'Test description'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', data);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
};

testPost();
