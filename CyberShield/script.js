// Variables globales
let cart = [];
let scanInProgress = false;
let scanInterval;
let isAuthenticated = false;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeProductFilters();
    initializeBlogFilters();
    initializeSecurityScan();
    initializeFAQ();
    initializeCart();
    detectUserSystem();
    initializeAnimations();
    initializeLogin();
    initializeLogout();
    checkAuthentication();
});

// Verificar autenticación
function checkAuthentication() {
    isAuthenticated = !!localStorage.getItem('cybershield_token');
    
    // Si estamos en index.html (página de login) y ya estamos autenticados, redirigir a principal
    if (window.location.pathname.includes('index.html') && isAuthenticated) {
        window.location.href = 'principal.html';
    } 
    // Si NO estamos autenticados y NO estamos en la página de login, redirigir al login
    else if (!isAuthenticated && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
    
    updateNavUI();
}

// Inicializar login
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simulación de autenticación (en producción, esto sería una llamada a API)
            if (username && password) {
                localStorage.setItem('cybershield_token', 'mock-token-' + Date.now());
                isAuthenticated = true;
                showNotification('¡Inicio de sesión exitoso!', 'success');
                setTimeout(() => {
                    window.location.href = 'principal.html';
                }, 1000);
            } else {
                showNotification('Por favor ingresa usuario y contraseña', 'error');
            }
        });
    }
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

// Inicializar logout
function initializeLogout() {
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('cybershield_token');
            isAuthenticated = false;
            showNotification('Sesión cerrada', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

// Actualizar UI de navegación
function updateNavUI() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && isAuthenticated) {
        // Verificar si ya existe el botón de logout
        const existingLogout = navMenu.querySelector('.logout-btn');
        if (!existingLogout) {
            const logoutItem = document.createElement('li');
            logoutItem.innerHTML = '<a href="#" class="nav-link logout-btn">Cerrar Sesión</a>';
            navMenu.appendChild(logoutItem);
            initializeLogout(); // Reinicializar el evento de logout
        }
    }
}

// Navegación móvil
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Filtros de productos
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Filtros de blog
function initializeBlogFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            blogPosts.forEach(post => {
                const postCategory = post.getAttribute('data-category');
                if (category === 'all' || postCategory === category) {
                    post.style.display = 'grid';
                    post.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
}

// Security Scan
function initializeSecurityScan() {
    const startScanBtn = document.getElementById('startScan');
    const stopScanBtn = document.getElementById('stopScan');
    
    if (startScanBtn) {
        startScanBtn.addEventListener('click', startSecurityScan);
    }
    
    if (stopScanBtn) {
        stopScanBtn.addEventListener('click', stopSecurityScan);
    }
}

function startSecurityScan() {
    if (scanInProgress) return;
    
    scanInProgress = true;
    const startBtn = document.getElementById('startScan');
    const stopBtn = document.getElementById('stopScan');
    const scanOutput = document.getElementById('scanOutput');
    const scanResults = document.getElementById('scanResults');
    
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-flex';
    
    if (scanResults) {
        scanResults.style.display = 'none';
    }
    
    const scanType = document.querySelector('input[name="scanType"]:checked').value;
    const scanDuration = getScanDuration(scanType);
    
    scanOutput.innerHTML = `
        <div class="scan-running">
            <p class="scan-status">🔍 Iniciando análisis de seguridad...</p>
            <div class="scan-progress"></div>
            <div id="scanLog"></div>
        </div>
    `;
    
    simulateScan(scanDuration);
}

function stopSecurityScan() {
    if (!scanInProgress) return;
    
    scanInProgress = false;
    clearInterval(scanInterval);
    
    const startBtn = document.getElementById('startScan');
    const stopBtn = document.getElementById('stopScan');
    const scanOutput = document.getElementById('scanOutput');
    
    startBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
    
    scanOutput.innerHTML = `
        <div class="scan-cancelled">
            <p class="scan-status">⚠️ Análisis cancelado por el usuario</p>
            <p class="scan-info">Haz clic en "Iniciar Análisis" para comenzar un nuevo escaneo</p>
        </div>
    `;
}

function getScanDuration(scanType) {
    switch(scanType) {
        case 'quick': return 15000;
        case 'full': return 30000;
        case 'custom': return 20000;
        default: return 15000;
    }
}

function simulateScan(duration) {
    const scanLog = document.getElementById('scanLog');
    const steps = [
        '🔍 Inicializando motor de análisis...',
        '📁 Escaneando archivos del sistema...',
        '🛡️ Verificando definiciones de virus...',
        '🌐 Analizando conexiones de red...',
        '🔐 Revisando configuraciones de seguridad...',
        '📊 Generando reporte de seguridad...',
        '✅ Análisis completado'
    ];
    
    let currentStep = 0;
    const stepDuration = duration / steps.length;
    
    scanInterval = setInterval(() => {
        if (!scanInProgress || currentStep >= steps.length) {
            clearInterval(scanInterval);
            if (scanInProgress) {
                completeScan();
            }
            return;
        }
        
        const logEntry = document.createElement('p');
        logEntry.textContent = steps[currentStep];
        logEntry.style.color = '#00ffff';
        logEntry.style.marginBottom = '0.5rem';
        logEntry.style.animation = 'fadeInLeft 0.3s ease forwards';
        
        scanLog.appendChild(logEntry);
        currentStep++;
        
        scanLog.scrollTop = scanLog.scrollHeight;
    }, stepDuration);
}

function completeScan() {
    scanInProgress = false;
    
    const startBtn = document.getElementById('startScan');
    const stopBtn = document.getElementById('stopScan');
    const scanResults = document.getElementById('scanResults');
    
    startBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
    
    const results = generateScanResults();
    displayScanResults(results);
    
    if (scanResults) {
        scanResults.style.display = 'block';
        scanResults.scrollIntoView({ behavior: 'smooth' });
    }
}

function generateScanResults() {
    const protectedFiles = Math.floor(Math.random() * 50000) + 10000;
    const vulnerabilities = Math.floor(Math.random() * 5) + 1;
    const threats = Math.floor(Math.random() * 3);
    
    return {
        protectedFiles,
        vulnerabilities,
        threats,
        summary: generateScanSummary(protectedFiles, vulnerabilities, threats),
        recommendations: generateRecommendations(vulnerabilities, threats)
    };
}

function generateScanSummary(protected, vulnerabilities, threats) {
    let status = 'Bueno';
    let statusColor = '#00ff88';
    
    if (threats > 0) {
        status = 'Crítico';
        statusColor = '#ff4444';
    } else if (vulnerabilities > 3) {
        status = 'Atención Requerida';
        statusColor = '#ffaa00';
    }
    
    return `
        <div style="margin-bottom: 1rem;">
            <p><strong>Estado del Sistema:</strong> <span style="color: ${statusColor};">${status}</span></p>
            <p><strong>Archivos Analizados:</strong> ${protected.toLocaleString()}</p>
            <p><strong>Tiempo de Análisis:</strong> ${Math.floor(Math.random() * 5) + 2} minutos</p>
            <p><strong>Última Actualización de Base de Datos:</strong> Hace 2 horas</p>
        </div>
    `;
}

function generateRecommendations(vulnerabilities, threats) {
    const recommendations = [];
    
    if (threats > 0) {
        recommendations.push('Ejecutar limpieza completa del sistema inmediatamente');
        recommendations.push('Actualizar todas las aplicaciones a sus últimas versiones');
    }
    
    if (vulnerabilities > 0) {
        recommendations.push('Instalar las últimas actualizaciones de seguridad del sistema');
        recommendations.push('Revisar y fortalecer las contraseñas débiles detectadas');
    }
    
    recommendations.push('Activar el firewall del sistema si no está habilitado');
    recommendations.push('Considerar la instalación de una solución antivirus premium');
    recommendations.push('Realizar copias de seguridad regulares de datos importantes');
    
    return recommendations;
}

function displayScanResults(results) {
    document.getElementById('protectedFiles').textContent = results.protectedFiles.toLocaleString();
    document.getElementById('vulnerabilities').textContent = results.vulnerabilities;
    document.getElementById('threats').textContent = results.threats;
    
    const threatCard = document.querySelector('#threats').closest('.result-card');
    const vulnCard = document.querySelector('#vulnerabilities').closest('.result-card');
    
    if (results.threats > 0) {
        document.getElementById('threats').style.color = '#ff4444';
    } else {
        document.getElementById('threats').style.color = '#00ff88';
    }
    
    if (results.vulnerabilities > 3) {
        document.getElementById('vulnerabilities').style.color = '#ffaa00';
    } else {
        document.getElementById('vulnerabilities').style.color = '#00ff88';
    }
    
    document.getElementById('scanSummary').innerHTML = results.summary;
    
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    results.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        li.style.marginBottom = '0.5rem';
        li.style.color = '#cccccc';
        recommendationsList.appendChild(li);
    });
}

// FAQ
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Carrito de compras
function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            addToCart(productName, productPrice);
            updateCartUI();
            showCartNotification(productName);
        });
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cybershield_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        cartCount.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            cartCount.style.animation = '';
        }, 300);
    }
}

function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #00ffff, #0088ff);
            color: #0a0a0a;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease forwards;
            max-width: 300px;
        ">
            <strong>✅ Agregado al carrito</strong><br>
            ${productName}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Detectar sistema del usuario
function detectUserSystem() {
    const systemOS = document.getElementById('systemOS');
    if (systemOS) {
        const userAgent = navigator.userAgent;
        let os = 'Sistema Desconocido';
        
        if (userAgent.indexOf('Windows') !== -1) {
            os = 'Windows';
        } else if (userAgent.indexOf('Mac') !== -1) {
            os = 'macOS';
        } else if (userAgent.indexOf('Linux') !== -1) {
            os = 'Linux';
        } else if (userAgent.indexOf('Android') !== -1) {
            os = 'Android';
        } else if (userAgent.indexOf('iOS') !== -1) {
            os = 'iOS';
        }
        
        systemOS.textContent = os;
    }
}

// Animaciones de entrada
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.product-card, .feature-card, .blog-post, .team-member, .value-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Newsletter
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            showNotification('¡Gracias por suscribirte! Recibirás nuestras últimas noticias de ciberseguridad.', 'success');
            
            this.reset();
        });
    }
}

// Función para mostrar notificaciones generales
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: '#00ff88',
        error: '#ff4444',
        warning: '#ffaa00',
        info: '#00ffff'
    };
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: #0a0a0a;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease forwards;
            max-width: 350px;
            font-weight: 600;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Cargar carrito desde localStorage al iniciar
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cybershield_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Smooth scrolling para enlaces internos
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Efectos de parallax suaves
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Inicializar funciones adicionales
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    initializeNewsletter();
    initializeSmoothScrolling();
    initializeParallax();
});

// Animaciones CSS adicionales
const additionalStyles = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

@keyframes fadeInLeft {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.cart-notification {
    animation: bounceIn 0.5s ease forwards;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Función para manejar errores de carga de imágenes
function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400';
        });
    });
}

document.addEventListener('DOMContentLoaded', handleImageErrors);

// Función para optimizar rendimiento
function optimizePerformance() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

document.addEventListener('DOMContentLoaded', optimizePerformance);