document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const gridProjetos = document.getElementById('gridProjetos');
    const projectDetails = document.getElementById('projectDetails');
    const searchInput = document.getElementById('searchInput');
    const componentFilter = document.getElementById('componentFilter');

    let projetosData = [];
    let todosComponentes = new Set();

    const toTitleCase = (str) => {
        return str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
    };

    const fileLabels = {
        'circuito': 'Circuito Esquemático',
        'blocos': 'Código em Blocos',
        'image': 'Código em Blocos', 
        'real': 'Montagem Real',
        'codigo': 'Código C++'
    };

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    fetch('projetos.json')
        .then(response => {
            if (!response.ok) throw new Error('Falha ao carregar projetos.json');
            return response.json();
        })
        .then(data => {
            projetosData = data;
            
            if (projectId && projectDetails) {
                renderizarDetalhesProjeto(projectId);
            } else if (gridProjetos) {
                extrairComponentes();
                renderizarProjetos(projetosData);
            }
        })
        .catch(error => {
            console.error(error);
            if(gridProjetos) gridProjetos.innerHTML = `<p style="color:var(--pink-dark)">Erro ao carregar projetos. Execute 'node gerador.js'.</p>`;
            if(projectDetails) projectDetails.innerHTML = `<p style="color:var(--pink-dark)">Projeto não encontrado.</p>`;
        });

    function extrairComponentes() {
        projetosData.forEach(proj => {
            if (proj.componentes) {
                proj.componentes.forEach(comp => todosComponentes.add(comp));
            }
        });

        Array.from(todosComponentes).sort().forEach(comp => {
            const option = document.createElement('option');
            option.value = comp;
            option.textContent = comp;
            if(componentFilter) componentFilter.appendChild(option);
        });
    }

    function renderizarProjetos(projetos) {
        if (!gridProjetos) return;
        gridProjetos.innerHTML = '';

        if (projetos.length === 0) {
            gridProjetos.innerHTML = '<p>Nenhum projeto encontrado.</p>';
            return;
        }

        projetos.forEach(proj => {
            const titulo = toTitleCase(proj.pastaNome);
            const card = document.createElement('a');
            
            card.href = `projeto.html?id=${encodeURIComponent(proj.pastaNome)}`;
            card.className = 'card fade-in';
            card.style.textDecoration = 'none';

            const tagsHtml = (proj.componentes || []).map(comp => `<span class="tag">${comp}</span>`).join('');
            
            // Busca especificamente a imagem do circuito
            let imagemPreviewHtml = '';
            const fileCircuito = proj.arquivos.find(arq => {
                const nomeSemExt = arq.substring(0, arq.lastIndexOf('.')).toLowerCase();
                const extensao = arq.split('.').pop().toLowerCase();
                return nomeSemExt === 'circuito' && ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extensao);
            });

            if (fileCircuito) {
                const caminhoImg = `projetos/${proj.pastaNome}/${fileCircuito}`;
                imagemPreviewHtml = `<img src="${caminhoImg}" alt="Preview do Circuito" class="card-preview-img">`;
            } else {
                // Placeholder se não houver foto do circuito
                imagemPreviewHtml = `<div class="card-preview-placeholder"><i data-lucide="image"></i></div>`;
            }

            card.innerHTML = `
                ${imagemPreviewHtml}
                <div class="card-content">
                    <h3>${titulo}</h3>
                    <div class="tags">${tagsHtml}</div>
                </div>
            `;
            gridProjetos.appendChild(card);
        });
        lucide.createIcons();
    }

    if (searchInput) searchInput.addEventListener('input', filtrar);
    if (componentFilter) componentFilter.addEventListener('change', filtrar);

    function filtrar() {
        const termoBusca = searchInput.value.toLowerCase();
        const componenteSelecionado = componentFilter.value;

        const filtrados = projetosData.filter(proj => {
            const tituloMatch = proj.pastaNome.toLowerCase().includes(termoBusca);
            const compMatchBusca = (proj.componentes || []).some(c => c.toLowerCase().includes(termoBusca));
            const passaBusca = tituloMatch || compMatchBusca;
            const passaDropdown = componenteSelecionado === 'Todos' || (proj.componentes || []).includes(componenteSelecionado);
            return passaBusca && passaDropdown;
        });
        renderizarProjetos(filtrados);
    }

    function renderizarDetalhesProjeto(idPasta) {
        const proj = projetosData.find(p => p.pastaNome === idPasta);
        
        if (!proj) {
            projectDetails.innerHTML = '<h2>Projeto não encontrado.</h2>';
            return;
        }

        const titulo = toTitleCase(proj.pastaNome);
        document.title = `${titulo} - Detalhes`;

        const tagsHtml = (proj.componentes || []).map(comp => `<span class="tag">${comp}</span>`).join('');
        
        let midiasHtml = '';
        let btnDownloadHtml = '';

        proj.arquivos.forEach(arq => {
            const nomeSemExt = arq.substring(0, arq.lastIndexOf('.')).toLowerCase();
            const extensao = arq.split('.').pop().toLowerCase();
            const caminho = `projetos/${proj.pastaNome}/${arq}`;

            if (extensao === 'ino') {
                btnDownloadHtml = `
                    <a href="${caminho}" download="${arq}" class="btn-download block-btn">
                        <i data-lucide="download"></i> Baixar Código (${arq})
                    </a>
                `;
            } 
            else if (['mp4', 'mov', 'webm'].includes(extensao)) {
                midiasHtml += `
                    <div class="media-box">
                        <h4>Vídeo da Montagem</h4>
                        <video controls>
                            <source src="${caminho}" type="video/${extensao}">
                        </video>
                    </div>`;
            } 
            else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extensao)) {
                const rotulo = fileLabels[nomeSemExt] || 'Imagem do Projeto';
                midiasHtml += `
                    <div class="media-box">
                        <h4>${rotulo}</h4>
                        <img src="${caminho}" alt="${rotulo}" class="zoomable-img">
                    </div>`;
            }
        });

        projectDetails.innerHTML = `
            <div class="project-header">
                <h1>${titulo}</h1>
                <div class="tags" style="margin-top: 15px;">${tagsHtml}</div>
            </div>
            
            <div class="project-body">
                <div class="project-media-grid">
                    ${midiasHtml || '<p>Nenhuma mídia disponível para este projeto.</p>'}
                </div>
                
                <div class="project-actions">
                    ${btnDownloadHtml || '<p class="no-code">Nenhum arquivo .ino encontrado nesta pasta.</p>'}
                </div>
            </div>
        `;
        lucide.createIcons();

        // --- LÓGICA DO MODAL DE IMAGENS ---
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('zoomedImage');
        const captionText = document.getElementById('caption');
        const closeModal = document.querySelector('.close-modal');

        if (modal) {
            // Pega todas as imagens geradas dentro de media-box
            const imagensParaZoom = document.querySelectorAll('.media-box img.zoomable-img');

            // Adiciona o evento de clique em cada imagem
            imagensParaZoom.forEach(img => {
                img.addEventListener('click', function() {
                    modal.style.display = "flex"; // Muda de none para flex
                    
                    // Um pequeno atraso garante que a transição CSS de opacidade funcione
                    setTimeout(() => {
                        modal.classList.add('show');
                    }, 10);

                    modalImg.src = this.src;
                    captionText.innerHTML = this.alt;
                });
            });

            // Função para fechar o modal
            const fecharModal = () => {
                modal.classList.remove('show');
                // Aguarda a transição de opacidade antes de esconder o elemento
                setTimeout(() => {
                    if (!modal.classList.contains('show')) {
                        modal.style.display = "none";
                    }
                }, 300);
            };

            // Fecha ao clicar no "X"
            if (closeModal) {
                closeModal.addEventListener('click', fecharModal);
            }

            // Fecha ao clicar na área escura (fora da imagem)
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    fecharModal();
                }
            });

            // Fecha ao pressionar a tecla "Esc"
            document.addEventListener('keydown', function(e) {
                if (e.key === "Escape" && modal.classList.contains('show')) {
                    fecharModal();
                }
            });
        }
    }
});