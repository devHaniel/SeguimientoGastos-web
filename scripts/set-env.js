const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const configPath = path.resolve(__dirname, '..', 'src', 'app', 'config.ts');

let apiUrl = process.env.API_URL || 'http://localhost:3000/api';

if (!process.env.API_URL && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex !== -1) {
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (key === 'API_URL') {
          apiUrl = value;
        }
      }
    }
  }
}

const content = `export const config = {
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(configPath, content, 'utf-8');
console.log(`config.ts generated with API_URL=${apiUrl}`);
