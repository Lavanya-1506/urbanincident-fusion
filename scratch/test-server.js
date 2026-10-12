import http from 'http';

http.get('http://localhost:3000/', (res) => {
  console.log('HTTP Status Code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Received HTML Length:', data.length);
    console.log('Root div found:', data.includes('<div id="root">'));
    console.log('Script tag found:', data.includes('src="/src/main.tsx"'));
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});
