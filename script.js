document.addEventListener('DOMContentLoaded', function() {
    console.log('⚡ Адаптер Краплова загружен');
    
    initTechEffects();
    initAvatarAnimation();
    initAudioEffects();
    initTechCursor();
    createMatrixRain();
    createHexGrid();
    
    // Статус мигание
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        setInterval(() => {
            const hue = Math.floor(Math.random() * 60) + 120;
            statusDot.style.boxShadow = `0 0 25px hsl(${hue}, 100%, 50%)`;
        }, 1500);
    }
});

function initTechEffects() {
    const buttons = document.querySelectorAll('.tech-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('active');
            createTechParticles(this);
            playTechSound();
            
            // Интенсивная пульсация при наведении
            const pulse = this.querySelector('.btn-pulse');
            if (pulse) {
                pulse.style.animation = 'pulse 1s ease-out infinite';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('active');
            
            // Возвращаем обычную пульсацию
            const pulse = this.querySelector('.btn-pulse');
            if (pulse) {
                pulse.style.animation = 'pulse 3s ease-out infinite';
            }
        });
        
        button.addEventListener('click', function(e) {
            // Эффект нажатия
            this.style.transform = 'scale(0.95) rotate(-10deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            logTechClick(this.href);
            createTechExplosion(this);
        });
    });
}

function initAvatarAnimation() {
    const avatar = document.getElementById('avatar');
    if (!avatar) return;
    
    // Добавляем анимацию частиц
    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'tech-particle';
        particle.style.position = 'absolute';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.width = `${1 + Math.random() * 3}px`;
        particle.style.height = particle.style.width;
        particle.style.background = `hsl(${120 + Math.random() * 60}, 100%, 50%)`;
        particle.style.borderRadius = '50%';
        particle.style.zIndex = '1';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = `0 0 ${5 + Math.random() * 10}px currentColor`;
        
        const container = document.querySelector('.avatar-container');
        container.appendChild(particle);
        
        // Анимация частицы
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${-100 - Math.random() * 50}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1500 + Math.random() * 1500,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 3000);
    }, 1000);
    
    // Анимация свечения аватара
    setInterval(() => {
        const glow = document.querySelector('.avatar-glow');
        if (glow) {
            const hue = 120 + Math.random() * 60;
            glow.style.background = `
                radial-gradient(circle at ${20 + Math.random() * 60}% ${20 + Math.random() * 60}%, 
                transparent 40%, 
                hsla(${hue}, 100%, 50%, ${0.1 + Math.random() * 0.1}) 70%)
            `;
        }
    }, 2000);
}

function createTechParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particles = 15;
    
    for (let i = 0; i < particles; i++) {
        createParticle(centerX, centerY);
    }
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'tech-particle';
    
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${2 + Math.random() * 4}px`;
    particle.style.height = particle.style.width;
    particle.style.background = `hsl(${120 + Math.random() * 60}, 100%, 50%)`;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    particle.style.boxShadow = `0 0 ${10 + Math.random() * 10}px currentColor`;
    
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    const distance = 60 + Math.random() * 90;
    
    particle.animate([
        {
            transform: `translate(0, 0) scale(1)`,
            opacity: 1
        },
        {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
            opacity: 0
        }
    ], {
        duration: 600 + Math.random() * 800,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 1500);
}

function createTechExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particles = 20;
    
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            createHexParticle(centerX, centerY);
        }, i * 20);
    }
}

function createHexParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'hex-particle';
    
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = `conic-gradient(from 0deg, 
        hsl(${120 + Math.random() * 60}, 100%, 50%), 
        hsl(${120 + Math.random() * 60}, 100%, 70%), 
        hsl(${120 + Math.random() * 60}, 100%, 50%))`;
    particle.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    
    particle.animate([
        {
            transform: `translate(0, 0) rotate(0deg) scale(1)`,
            opacity: 1
        },
        {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(720deg) scale(0)`,
            opacity: 0
        }
    ], {
        duration: 800 + Math.random() * 800,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 1600);
}

function initAudioEffects() {
    try {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            window.audioContext = new (AudioContext || webkitAudioContext)();
        }
    } catch (e) {
        console.log('Аудио не поддерживается');
    }
}

function playTechSound() {
    const audio = document.getElementById('hover-sound');
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.1;
        audio.play().catch(e => console.log('Автовоспроизведение заблокировано'));
    }
}

function initTechCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'tech-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.border = '2px solid #00ff88';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.2s, height 0.2s, border-color 0.2s';
    cursor.style.boxShadow = '0 0 15px #00ff88';
    cursor.style.backdropFilter = 'blur(1px)';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        // Пульсация курсора
        const pulse = 1 + Math.sin(Date.now() / 600) * 0.1;
        cursor.style.transform = `translate(-50%, -50%) scale(${pulse})`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    document.querySelectorAll('a, .tech-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '35px';
            cursor.style.height = '35px';
            cursor.style.borderColor = '#ffffff';
            cursor.style.boxShadow = '0 0 20px #00ff88, 0 0 40px #00ff88';
            cursor.style.background = 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = '#00ff88';
            cursor.style.boxShadow = '0 0 15px #00ff88';
            cursor.style.background = 'transparent';
        });
    });
}

function createMatrixRain() {
    setInterval(() => {
        const drop = document.createElement('div');
        drop.className = 'matrix-char';
        
        drop.style.position = 'fixed';
        drop.style.top = '-20px';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.color = '#00ff88';
        drop.style.fontFamily = 'Courier New, monospace';
        drop.style.fontSize = `${14 + Math.random() * 8}px`;
        drop.style.fontWeight = 'bold';
        drop.style.pointerEvents = 'none';
        drop.style.zIndex = '2';
        drop.style.textShadow = '0 0 10px #00ff88';
        
        // Случайный символ матрицы
        const chars = '01アイウエオカキクケコサシスセソタチツテト';
        drop.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
        
        document.body.appendChild(drop);
        
        drop.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'linear'
        });
        
        setTimeout(() => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        }, 4000);
    }, 50);
}

function createHexGrid() {
    // Создаем шестиугольную сетку на заднем фоне
    for (let i = 0; i < 20; i++) {
        const hex = document.createElement('div');
        hex.className = 'hex-bg';
        
        hex.style.position = 'fixed';
        hex.style.top = `${Math.random() * 100}vh`;
        hex.style.left = `${Math.random() * 100}vw`;
        hex.style.width = `${40 + Math.random() * 60}px`;
        hex.style.height = hex.style.width;
        hex.style.background = `conic-gradient(from 0deg, 
            transparent, 
            rgba(0, 255, 136, ${0.01 + Math.random() * 0.03}), 
            transparent)`;
        hex.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        hex.style.pointerEvents = 'none';
        hex.style.zIndex = '0';
        hex.style.filter = 'blur(1px)';
        hex.style.opacity = '0.1';
        
        document.body.appendChild(hex);
    }
}

function logTechClick(url) {
    console.log(`⚡ Клик по ссылке: ${url}`);
    
    const clickEffect = document.createElement('div');
    clickEffect.style.position = 'fixed';
    clickEffect.style.top = '50%';
    clickEffect.style.left = '50%';
    clickEffect.style.transform = 'translate(-50%, -50%)';
    clickEffect.style.color = '#00ff88';
    clickEffect.style.fontSize = '3rem';
    clickEffect.style.fontWeight = 'bold';
    clickEffect.style.zIndex = '10000';
    clickEffect.style.pointerEvents = 'none';
    clickEffect.style.textShadow = '0 0 30px #00ff88';
    clickEffect.textContent = 'K R A P L O V';
    document.body.appendChild(clickEffect);
    
    clickEffect.animate([
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(2)' }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });
    
    setTimeout(() => {
        if (clickEffect.parentNode) {
            clickEffect.parentNode.removeChild(clickEffect);
        }
    }, 1200);
}

// Добавляем CSS для эффектов
const style = document.createElement('style');
style.textContent = `
    .tech-particle, .matrix-char, .hex-particle, .hex-bg {
        pointer-events: none;
        user-select: none;
    }
    
    .tech-particle {
        position: fixed;
        z-index: 1000;
    }
    
    .matrix-char {
        position: fixed;
        z-index: 2;
    }
    
    .hex-particle {
        position: fixed;
        z-index: 1000;
    }
    
    .hex-bg {
        position: fixed;
        z-index: 0;
    }
    
    #tech-cursor {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @media (max-width: 768px) {
        #tech-cursor {
            display: none;
        }
    }
    
    body {
        cursor: none;
    }
    
    a, button {
        cursor: none;
    }
    
    /* Эффект киберпанк-сканирования */
    body::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background: 
            repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15) 0px,
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
        opacity: 0.2;
        mix-blend-mode: overlay;
        animation: scan 10s linear infinite;
    }
    
    @keyframes scan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
    }
`;
document.head.appendChild(style);