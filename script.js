/* ============================================
   Traveling Destinasi Lokal Indonesia
   JavaScript for Interactive Features
   ============================================ */

// ============================================
// Loading Animation
// ============================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        // Initialize animations after loading
        initAnimations();
    }, 1000);
});

// ============================================
// Navigation Bar - Sticky with Glassmorphism
// ============================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for glassmorphism effect
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Parallax Effect for Hero Background
// ============================================
const heroBackground = document.querySelector('[data-parallax]');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// ============================================
// Intersection Observer for Fade-in Animations
// ============================================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in classes
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// ============================================
// Animated Counter for Statistics
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target % 1 === 0 ? Math.floor(target) : target.toFixed(1);
            clearInterval(timer);
        } else {
            element.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        }
    }, 16);
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============================================
// Destination Filter Functionality
// ============================================
function filterDestinations(filterValue) {
    const destinationCards = document.querySelectorAll('.destination-card');
    
    destinationCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
            // Show card with animation
            card.classList.remove('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // Hide card with animation
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-30px)';
            
            setTimeout(() => {
                card.classList.add('hidden');
            }, 300);
        }
    });
}

// Initialize filter buttons
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            filterDestinations(filterValue);
        });
    });
}

// Initialize filter buttons on page load
initFilterButtons();

// Filter from footer links
function initFooterFilterLinks() {
    const footerFilterLinks = document.querySelectorAll('.footer-links a[data-filter]');
    footerFilterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = link.getAttribute('data-filter');
            
            // Update filter buttons
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === filterValue) {
                    btn.classList.add('active');
                }
            });
            
            // Apply filter
            filterDestinations(filterValue);
            
            // Smooth scroll to destinations section
            const destinationsSection = document.getElementById('destinations');
            if (destinationsSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = destinationsSection.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize footer filter links
initFooterFilterLinks();

// ============================================
// Testimonial Carousel
// ============================================
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');
let currentTestimonial = 0;

// Create dots for carousel
testimonialCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    carouselDots.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function showTestimonial(index) {
    // Remove active class from all cards and dots
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current card and dot
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentTestimonial = index;
}

function goToTestimonial(index) {
    if (index >= 0 && index < testimonialCards.length) {
        showTestimonial(index);
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}

// Event listeners for carousel controls
if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);

// Auto-play carousel (optional)
let carouselInterval;
function startCarousel() {
    carouselInterval = setInterval(nextTestimonial, 5000);
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// Start auto-play
startCarousel();

// Pause on hover
const carouselContainer = document.getElementById('carouselContainer');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
}

// ============================================
// Back to Top Button
// ============================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// Smooth Scroll Behavior Enhancement
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// Card Hover Effects Enhancement
// ============================================
function initCardHoverEffects() {
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('hidden')) {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize card hover effects
initCardHoverEffects();

// ============================================
// Button Hover Effects
// ============================================
const buttons = document.querySelectorAll('.btn, .filter-btn, .carousel-btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// Performance Optimization - Throttle Scroll Events
// ============================================
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttle to scroll events
const throttledScroll = throttle(() => {
    // Parallax and navbar effects are already handled above
}, 16);

window.addEventListener('scroll', throttledScroll);

// ============================================
// Initialize on DOM Content Loaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial states
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
    
    // Re-initialize filter buttons and card effects
    initFilterButtons();
    initFooterFilterLinks();
    initCardHoverEffects();
    
    // Initialize animations if page is already loaded
    if (document.readyState === 'complete') {
        initAnimations();
    }
});

// ============================================
// Error Handling for Images
// ============================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Fallback image or placeholder
        this.src = 'https://via.placeholder.com/800x600/8B6F47/FFFFFF?text=Destinasi+Indonesia';
        this.alt = 'Gambar destinasi tidak tersedia';
    });
});

// ============================================
// Console Welcome Message
// ============================================
console.log('%c🌴 Explore Indonesia 🌴', 'color: #8B6F47; font-size: 20px; font-weight: bold;');
console.log('%cSelamat datang di website traveling destinasi lokal Indonesia!', 'color: #2D5016; font-size: 14px;');

