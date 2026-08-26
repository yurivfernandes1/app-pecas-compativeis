const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/admin/AdminConfig.tsx',
  'src/pages/admin/AdminProdutos.tsx',
  'src/pages/admin/AdminCategorias.tsx',
  'src/pages/admin/AdminListaNegra.tsx',
  'src/pages/admin/AdminUsuarios.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import
    if (!content.includes('AdminTabs')) {
      content = content.replace(
        "import styled from 'styled-components';",
        "import styled from 'styled-components';\nimport AdminTabs from '../../components/AdminTabs';"
      );
    }
    
    // Replace the local styled components
    content = content.replace(/const NavLinks = styled\.div`[\s\S]*?`;\n+/, '');
    content = content.replace(/const NavLink = styled(\(.+\)|\.[a-z]+)`[\s\S]*?`;\n+/, '');
    
    // For AdminCategorias, NavLink has a type param <{ $active?: boolean }>
    content = content.replace(/const NavLink = styled(\(.+\)|\.[a-z]+)<[^>]+>`[\s\S]*?`;\n+/, '');

    // Replace the JSX block
    content = content.replace(/<NavLinks>[\s\S]*?<\/NavLinks>/g, '<AdminTabs />');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
