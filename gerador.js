// gerador.js
const fs = require('fs');
const path = require('path');

const projetosDir = path.join(__dirname, 'projetos');
const outputJson = path.join(__dirname, 'projetos.json');

function gerarIndice() {
    if (!fs.existsSync(projetosDir)) {
        console.error('A pasta /projetos não existe.');
        return;
    }

    const projetos = [];
    const pastas = fs.readdirSync(projetosDir);

    pastas.forEach(pasta => {
        const caminhoPasta = path.join(projetosDir, pasta);
        if (fs.statSync(caminhoPasta).isDirectory()) {
            const arquivosNaPasta = fs.readdirSync(caminhoPasta);
            
            // Lê os componentes do json, se existir
            let componentes = [];
            if (arquivosNaPasta.includes('componentes.json')) {
                const compData = fs.readFileSync(path.join(caminhoPasta, 'componentes.json'));
                componentes = JSON.parse(compData);
            }

            // Mapeia os arquivos encontrados (ignorando o componentes.json)
            const arquivosEncontrados = arquivosNaPasta.filter(arq => arq !== 'componentes.json');

            projetos.push({
                pastaNome: pasta,
                arquivos: arquivosEncontrados,
                componentes: componentes
            });
        }
    });

    fs.writeFileSync(outputJson, JSON.stringify(projetos, null, 2));
    console.log(`Índice gerado com sucesso! ${projetos.length} projetos encontrados.`);
}

gerarIndice();