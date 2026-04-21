import http from 'http';

const check = () => {
  const req = http.get('http://0.0.0.0:3000/api/health', (res) => {
    console.log('Server is UP! Status:', res.statusCode);
    process.exit(0);
  });

  req.on('error', (err) => {
    console.error('Server is DOWN:', err.message);
    process.exit(1);
  });

  req.setTimeout(2000, () => {
    console.error('Timeout reaching server');
    process.exit(1);
  });
};

check();
