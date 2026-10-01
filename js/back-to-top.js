document.addEventListener('DOMContentLoaded', () => {
    const btnTop = document.createElement('button');
    btnTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    btnTop.id = 'btn-back-to-top';
    btnTop.title = 'Voltar ao Topo';
    
    Object.assign(btnTop.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '1000',
        padding: '10px 15px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#0d6efd',
        color: '#fff',
        cursor: 'pointer',
        display: 'none',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'opacity 0.3s'
    });

    document.body.appendChild(btnTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnTop.style.display = 'block';
        } else {
            btnTop.style.display = 'none';
        }
    });

    btnTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
