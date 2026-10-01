document.addEventListener('DOMContentLoaded', () => {
    const btnDarkMode = document.createElement('button');
    btnDarkMode.id = 'btn-dark-mode';
    btnDarkMode.setAttribute('aria-label', 'Alternar modo escuro');
    btnDarkMode.title = 'Alternar Modo Escuro';
    btnDarkMode.className = 'btn-floating';
    
    Object.assign(btnDarkMode.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: '1050',
        padding: '10px 16px',
        borderRadius: '50px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: '#212529',
        color: '#f8f9fa',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
    });

    document.body.appendChild(btnDarkMode);

    function atualizarInterfaceBotao(isDark) {
        if (isDark) {
            btnDarkMode.innerHTML = '<i class="bi bi-sun-fill text-warning"></i> Modo Claro';
            btnDarkMode.style.backgroundColor = '#f8f9fa';
            btnDarkMode.style.color = '#212529';
            btnDarkMode.style.border = '1px solid #dee2e6';
            btnDarkMode.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        } else {
            btnDarkMode.innerHTML = '<i class="bi bi-moon-stars-fill text-warning"></i> Modo Escuro';
            btnDarkMode.style.backgroundColor = '#212529';
            btnDarkMode.style.color = '#f8f9fa';
            btnDarkMode.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            btnDarkMode.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
        }
    }

    function aplicarTema(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode', 'bg-dark', 'text-light');
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('itapets_dark_mode', 'ativo');
        } else {
            document.body.classList.remove('dark-mode', 'bg-dark', 'text-light');
            document.documentElement.removeAttribute('data-bs-theme');
            localStorage.setItem('itapets_dark_mode', 'inativo');
        }
        atualizarInterfaceBotao(isDark);
    }

    const modoSalvo = localStorage.getItem('itapets_dark_mode') === 'ativo';
    aplicarTema(modoSalvo);

    btnDarkMode.addEventListener('click', () => {
        const atualmenteEscuro = document.body.classList.contains('dark-mode');
        aplicarTema(!atualmenteEscuro);
    });
});
