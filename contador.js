const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('./src/data/pecas-compativeis.json', 'utf8'));
    
    let total = 0;
    
    console.log('=== CONTAGEM DETALHADA ===\n');
    
    Object.entries(data).forEach(([categoria, pecas]) => {
        const count = Object.keys(pecas).length;
        total += count;
        console.log(`${categoria}: ${count} peças`);
        
        // Listar as peças da categoria
        Object.keys(pecas).forEach((peca, index) => {
            console.log(`  ${index + 1}. ${peca}`);
        });
        console.log('');
    });
    
    console.log(`TOTAL GERAL: ${total} peças`);
    
} catch (error) {
    console.error('Erro:', error.message);
}
