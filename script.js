document.addEventListener('DOMContentLoaded', function() {
    console.log('🩸 Адаптер Краплова загружен');
    
    initBloodEffects();
    initAvatarAnimation();
    initAudioEffects();
    initBloodCursor();
    createBloodRain();
    createDynamicDrops();
    
    // Статус мигание
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        setInterval(() => {
            const randomHue = Math.floor(Math.random() * 30) + 330;
            statusDot.style.boxShadow = `0 0 25px hsl(${randomHue}, 100%, 50%)`;
        }, 1500);
    }
});

function initBloodEffects() {
    const buttons = document.querySelectorAll('.blood-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('active');
            createBloodParticles(this);
            playBloodSound();
            
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
            this.style.transform = 'translateY(-5px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            logBloodClick(this.href);
            createBloodExplosion(this);
        });
    });
}

function initAvatarAnimation() {
    const avatar = document.getElementById('avatar');
    if (!avatar) return;
    
    // Добавляем анимацию дыма
    setInterval(() => {
        const smoke = document.createElement('div');
        smoke.className = 'blood-smoke';
        smoke.style.position = 'absolute';
        smoke.style.top = `${50 + Math.random() * 40}%`;
        smoke.style.left = `${50 + Math.random() * 40}%`;
        smoke.style.width = `${20 + Math.random() * 30}px`;
        smoke.style.height = smoke.style.width;
        smoke.style.background = `radial-gradient(circle, rgba(255, 0, 43, ${0.1 + Math.random() * 0.2}) 0%, transparent 70%)`;
        smoke.style.borderRadius = '50%';
        smoke.style.zIndex = '1';
        smoke.style.pointerEvents = 'none';
        
        const container = document.querySelector('.avatar-container');
        container.appendChild(smoke);
        
        // Анимация дыма
        smoke.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0.7 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${-100 - Math.random() * 50}px) scale(${1 + Math.random() * 2})`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        setTimeout(() => {
            if (smoke.parentNode) {
                smoke.parentNode.removeChild(smoke);
            }
        }, 4000);
    }, 1500);
    
    // Анимация крови на аватаре
    setInterval(() => {
        const blood = document.querySelector('.avatar-blood');
        if (blood) {
            const hue = 330 + Math.random() * 30;
            blood.style.background = `
                radial-gradient(circle at ${20 + Math.random() * 60}% ${20 + Math.random() * 60}%, 
                transparent 40%, 
                hsla(${hue}, 100%, 50%, ${0.3 + Math.random() * 0.3}) 70%)
            `;
        }
    }, 2000);
}

function createBloodParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particles = 12;
    
    for (let i = 0; i < particles; i++) {
        createParticle(centerX, centerY, 1);
    }
}

function createParticle(x, y, type = 1) {
    const particle = document.createElement('div');
    particle.className = 'blood-particle';
    
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${3 + Math.random() * 6}px`;
    particle.style.height = particle.style.width;
    particle.style.background = type === 1 ? '#ff002b' : 'hsl(330, 100%, 50%)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    particle.style.boxShadow = `0 0 ${10 + Math.random() * 10}px #ff002b`;
    particle.style.filter = `blur(${Math.random()}px)`;
    
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
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
        duration: 800 + Math.random() * 1000,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 2000);
}

function createBloodExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particles = 25;
    
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            createParticle(centerX, centerY, 2);
        }, i * 30);
    }
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

function playBloodSound() {
    const audio = document.getElementById('hover-sound');
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.15;
        audio.play().catch(e => console.log('Автовоспроизведение заблокировано'));
    }
}

function initBloodCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'blood-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.border = '2px solid #ff002b';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.2s, height 0.2s, border-color 0.2s';
    cursor.style.boxShadow = '0 0 15px #ff002b';
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
        const pulse = 1 + Math.sin(Date.now() / 500) * 0.1;
        cursor.style.transform = `translate(-50%, -50%) scale(${pulse})`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    document.querySelectorAll('a, .blood-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = '#ffffff';
            cursor.style.boxShadow = '0 0 25px #ff002b, 0 0 50px #ff002b';
            cursor.style.background = 'radial-gradient(circle, rgba(255, 0, 43, 0.2) 0%, transparent 70%)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '24px';
            cursor.style.height = '24px';
            cursor.style.borderColor = '#ff002b';
            cursor.style.boxShadow = '0 0 15px #ff002b';
            cursor.style.background = 'transparent';
        });
    });
}

function createBloodRain() {
    setInterval(() => {
        const drop = document.createElement('div');
        drop.className = 'blood-drop';
        
        drop.style.position = 'fixed';
        drop.style.top = '-20px';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.width = `${1 + Math.random() * 3}px`;
        drop.style.height = `${30 + Math.random() * 40}px`;
        drop.style.background = 'linear-gradient(to bottom, #ff002b, rgba(255, 0, 43, 0.3))';
        drop.style.pointerEvents = 'none';
        drop.style.zIndex = '2';
        drop.style.borderRadius = '1px';
        drop.style.filter = 'blur(0.5px)';
        
        document.body.appendChild(drop);
        
        drop.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px)`, opacity: 0 }
        ], {
            duration: 1500 + Math.random() * 1500,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        setTimeout(() => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        }, 3000);
    }, 80);
}

function createDynamicDrops() {
    // Создаем брызги на земле
    for (let i = 0; i < 15; i++) {
        const splatter = document.createElement('div');
        splatter.className = 'blood-splatter-ground';
        
        splatter.style.position = 'fixed';
        splatter.style.bottom = '0';
        splatter.style.left = `${Math.random() * 100}vw`;
        splatter.style.width = `${20 + Math.random() * 60}px`;
        splatter.style.height = splatter.style.width;
        splatter.style.background = `radial-gradient(circle, rgba(255, 0, 43, ${0.05 + Math.random() * 0.1}) 0%, transparent 70%)`;
        splatter.style.pointerEvents = 'none';
        splatter.style.zIndex = '1';
        splatter.style.filter = 'blur(3px)';
        
        document.body.appendChild(splatter);
    }
}

function logBloodClick(url) {
    console.log(`🩸 Клик по ссылке: ${url}`);
    
    const clickEffect = document.createElement('div');
    clickEffect.style.position = 'fixed';
    clickEffect.style.top = '50%';
    clickEffect.style.left = '50%';
    clickEffect.style.transform = 'translate(-50%, -50%)';
    clickEffect.style.color = '#ff002b';
    clickEffect.style.fontSize = '4rem';
    clickEffect.style.fontWeight = 'bold';
    clickEffect.style.zIndex = '10000';
    clickEffect.style.pointerEvents = 'none';
    clickEffect.style.textShadow = '0 0 30px #ff002b';
    clickEffect.textContent = 'BLOOD';
    document.body.appendChild(clickEffect);
    
    clickEffect.animate([
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(3)' }
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
    .blood-particle, .blood-drop, .blood-smoke, .blood-splatter-ground {
        pointer-events: none;
        user-select: none;
    }
    
    .blood-particle {
        position: fixed;
        z-index: 1000;
    }
    
    .blood-drop {
        position: fixed;
        z-index: 2;
    }
    
    .blood-smoke {
        position: absolute;
        z-index: 1;
    }
    
    .blood-splatter-ground {
        position: fixed;
        z-index: 1;
    }
    
    #blood-cursor {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @media (max-width: 768px) {
        #blood-cursor {
            display: none;
        }
    }
    
    body {
        cursor: none;
    }
    
    a, button {
        cursor: none;
    }
    
    /* Эффект винтажного монитора */
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
        opacity: 0.3;
        mix-blend-mode: overlay;
    }
`;
document.head.appendChild(style);