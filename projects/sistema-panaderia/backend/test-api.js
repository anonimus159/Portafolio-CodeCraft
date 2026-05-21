const { execSync } = require('child_process');

function test(endpoint, opts = {}) {
  const cmd = `curl -s ${opts.method ? `-X ${opts.method}` : ''} ${opts.headers || ''} ${opts.body || ''} http://localhost:3001${endpoint}`;
  try {
    const out = execSync(cmd, { encoding: 'utf8' });
    console.log(`✅ ${endpoint}:`, out.substring(0, 200));
  } catch(e) {
    console.log(`❌ ${endpoint}: error`);
  }
}

console.log('Iniciando servidor...');
require('child_process').execSync('node src/index.js', { cwd: 'D:\\INFORMACION\\Downloads\\sistema panaderia\\backend', detached: true });
setTimeout(() => {
  console.log('Testing endpoints...\n');
  test('/api/health');
  test('/api/auth/login', { 
    method: 'POST', 
    headers: '-H "Content-Type: application/json"', 
    body: '-d "{\\"email\":\"admin@restaurante.com\",\"password\":\"admin123\"}"' 
  });
  test('/api/usuarios');
}, 3000);