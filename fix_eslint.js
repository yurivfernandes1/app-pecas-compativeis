const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/admin/AdminConfig.tsx',
  'src/pages/admin/AdminUsuarios.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace("import { useNavigate, NavLink as RouterNavLink } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';");
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
