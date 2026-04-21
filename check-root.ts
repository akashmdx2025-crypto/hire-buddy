import http from 'http';

const check = () => {
  const req = http.get('http://0.0.0.0:3000/', (res) => {
    console.log('Root Status:', res.statusCode);
    res.on('data', (chunk) => {
      console.log('Body snippet:', chunk.toString().substring(0, 100));
    });
    res.on('end', () => process.exit(0));
  });

  req.on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
};

check();
