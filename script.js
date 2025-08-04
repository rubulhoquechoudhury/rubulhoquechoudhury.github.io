// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('nav-open');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Close mobile menu immediately
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
        
        // Let the smooth scrolling handler manage the rest
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// Prevent menu close when clicking inside the menu
navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Back to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Active navigation link based on scroll position
const sections = document.querySelectorAll('section');
let isInitialLoad = true; // Flag to prevent observer interference during initial load

const observerOptions = {
    threshold: 0.2,
    rootMargin: '-70px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    // Skip observer updates during initial load
    if (isInitialLoad) return;
    
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const targetId = entry.target.id;
            updateActiveNavLink(targetId);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Function to update active navigation link
function updateActiveNavLink(activeId) {
    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current nav link
    const activeLink = document.querySelector(`[href="#${activeId}"]`);
    if (activeLink && activeLink.classList.contains('nav-link')) {
        activeLink.classList.add('active');
    }
}

// Function to set initial active navigation link on page load
function setInitialActiveNavLink() {
    // Check if there's a hash in the URL first
    let currentSection = 'home';
    const hash = window.location.hash.substring(1);
    
    if (hash && document.getElementById(hash)) {
        currentSection = hash;
        console.log(`URL hash detected: ${hash}`);
    } else {
        // Use scroll position to determine current section
        const scrollPosition = window.scrollY + 100; // Add offset for navbar height
        let bestMatch = { id: 'home', distance: Infinity };
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + (sectionHeight / 2);
            const distanceFromViewport = Math.abs(scrollPosition - sectionCenter);
            
            // Check if section is in viewport
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight + 100) {
                // If multiple sections are in viewport, choose the one closest to center
                if (distanceFromViewport < bestMatch.distance) {
                    bestMatch = { id: section.id, distance: distanceFromViewport };
                    currentSection = section.id;
                }
            }
        });
        
        console.log(`Initial scroll position: ${scrollPosition}, detected section: ${currentSection}`);
    }
    
    updateActiveNavLink(currentSection);
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1); // Remove the '#'
        const targetSection = document.querySelector(`#${targetId}`);
        
        if (targetSection) {
            // Immediately update active state
            updateActiveNavLink(targetId);
            
            // Close mobile menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            
            // Smooth scroll to section
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Contact form handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple form validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission (in a real app, you'd send this to a server)
    showNotification('Thank you! Your message has been sent.', 'success');
    contactForm.reset();
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill-card, .project-card, .stat');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        animationObserver.observe(element);
    });
};

// Typing animation for hero title
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    animateOnScroll();
    
    // Typing animation for hero name (optional - uncomment to use)
    // const heroName = document.querySelector('.hero-name');
    // if (heroName) {
    //     const originalText = heroName.textContent;
    //     typeWriter(heroName, originalText, 150);
    // }
});

// Particle animation for hero background (optional enhancement)
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }
    
    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system (optional - uncomment to use)
// const heroSection = document.querySelector('.hero');
// if (heroSection) {
//     new ParticleSystem(heroSection);
// }

// Preloader (optional)
const createPreloader = () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    const spinnerStyles = `
        .preloader-spinner {
            text-align: center;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = spinnerStyles;
    document.head.appendChild(style);
    
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
};

// Initialize preloader (optional - uncomment to use)
// createPreloader();

// Dark mode toggle (optional feature)
const createDarkModeToggle = () => {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.title = 'Toggle Dark Mode';
    
    toggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        box-shadow: var(--shadow-medium);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toggle);
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Save preference
        localStorage.setItem('darkMode', isDark);
    });
    
    // Load saved preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
};

// Initialize dark mode toggle (optional - uncomment to use)
// createDarkModeToggle();

// Lazy loading for images (when you add real images)
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Performance optimization - debounce scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Handle scroll events here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize active navigation link on page load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are properly positioned
    setTimeout(() => {
        isInitialLoad = true;
        setInitialActiveNavLink();
        // Allow observer to work after initial setup
        setTimeout(() => {
            isInitialLoad = false;
        }, 500);
    }, 200);
});

// Also set on window load as a fallback
window.addEventListener('load', () => {
    setTimeout(() => {
        if (isInitialLoad) {
            setInitialActiveNavLink();
            setTimeout(() => {
                isInitialLoad = false;
            }, 500);
        }
    }, 200);
});

// Contact item click functionality with ripple effect
document.addEventListener('DOMContentLoaded', () => {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        // Add ripple effect on click
        item.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(99, 102, 241, 0.2);
                border-radius: 50%;
                transform: scale(0);
                animation: contactRipple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const contactRippleStyles = `
        @keyframes contactRipple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    
    const contactStyleSheet = document.createElement('style');
    contactStyleSheet.textContent = contactRippleStyles;
    document.head.appendChild(contactStyleSheet);
});

console.log('Portfolio website loaded successfully! 🚀');
