// Enhanced Hamburger Menu with Modern Mobile Features
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
let isMenuOpen = false;

// Enhanced toggle menu function
function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    navMenu.classList.toggle('active', isMenuOpen);
    menuToggle.classList.toggle('active', isMenuOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    // Add ARIA attributes for accessibility
    menuToggle.setAttribute('aria-expanded', isMenuOpen);
    navMenu.setAttribute('aria-hidden', !isMenuOpen);
    
    // Reset menu item animations when opening
    if (isMenuOpen) {
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            // Reset animation state
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            // Force reflow
            void item.offsetWidth;
            // Remove inline styles to let CSS animation take over
            item.style.opacity = '';
            item.style.transform = '';
        });
        
        // Trap focus within menu
        trapFocus(navMenu);
        // Focus first menu item
        setTimeout(() => {
            const firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) firstLink.focus();
        }, 300);
    } else {
        // Return focus to toggle button
        menuToggle.focus();
        removeFocusTrap();
    }
}

// Enhanced close menu function
function closeMenu() {
    if (!isMenuOpen) return;
    
    isMenuOpen = false;
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
    
    // Update ARIA attributes
    menuToggle.setAttribute('aria-expanded', false);
    navMenu.setAttribute('aria-hidden', true);
    
    // Remove focus trap
    removeFocusTrap();
    
    // Reset menu item animations by removing and re-adding animation classes
    const menuItems = navMenu.querySelectorAll('li');
    menuItems.forEach(item => {
        // Force reflow to reset animation
        item.style.animation = 'none';
        void item.offsetWidth; // Trigger reflow
        item.style.animation = '';
    });
}

// Focus trap functionality for accessibility
let focusableElements = [];
let firstFocusableElement = null;
let lastFocusableElement = null;

function trapFocus(container) {
    focusableElements = container.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    container.addEventListener('keydown', handleFocusTrap);
}

function removeFocusTrap() {
    if (navMenu) {
        navMenu.removeEventListener('keydown', handleFocusTrap);
    }
    focusableElements = [];
    firstFocusableElement = null;
    lastFocusableElement = null;
}

function handleFocusTrap(e) {
    const isTabPressed = e.key === 'Tab';
    
    if (!isTabPressed) return;
    
    if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
        }
    } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
        }
    }
}

// Event listeners
menuToggle.addEventListener('click', toggleMenu);

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Enhanced outside click handling with touch support
document.addEventListener('click', (e) => {
    if (isMenuOpen && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        closeMenu();
    }
});

// Touch handling for mobile
document.addEventListener('touchstart', (e) => {
    if (isMenuOpen && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        closeMenu();
    }
}, { passive: true });

// Enhanced keyboard handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
    }
    
    // Handle menu toggle with Enter/Space when focused
    if ((e.key === 'Enter' || e.key === ' ') && 
        document.activeElement === menuToggle) {
        e.preventDefault();
        toggleMenu();
    }
});

// Enhanced window resize handling
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
    }
});

// Add smooth scrolling offset for mobile menu
function adjustScrollOffset() {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? 100 : 80;
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - adjustScrollOffset();
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu after navigation
            if (isMenuOpen) {
                setTimeout(closeMenu, 100);
            }
        }
    });
});

// Enhanced Intersection Observer for Wix-style animations with better scroll detection
const observerOptions = {
    threshold: 0.1, // Trigger when 10% visible (more sensitive)
    rootMargin: '0px 0px -50px 0px' // Start animation 50px before element enters viewport
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add visible class with a small delay for smoother animation
            setTimeout(() => {
                entry.target.classList.add('animate-visible');
            }, 50);
            // Don't observe again after animation
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// More aggressive observer for elements that should animate immediately
const immediateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            immediateObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.05,
    rootMargin: '0px'
});

// Animate service cards with stagger effect - enhanced for scroll
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.classList.add('animate-fade-up');
    card.classList.add(`stagger-${(index % 6) + 1}`);
    // Observe each card individually for better scroll detection
    animationObserver.observe(card);
    
    // Also animate card children
    const cardTitle = card.querySelector('.service-title');
    const cardDesc = card.querySelector('.service-description');
    const cardIcon = card.querySelector('.service-icon');
    
    if (cardTitle) {
        cardTitle.classList.add('animate-fade-down');
        animationObserver.observe(cardTitle);
    }
    if (cardDesc) {
        cardDesc.classList.add('animate-fade-up');
        animationObserver.observe(cardDesc);
    }
    if (cardIcon) {
        cardIcon.classList.add('animate-fade-scale');
        animationObserver.observe(cardIcon);
    }
});

// Animate about section with fade-left - ensure it's visible
const aboutSection = document.querySelector('.about-content');
if (aboutSection) {
    aboutSection.classList.add('animate-fade-left');
    animationObserver.observe(aboutSection);
    immediateObserver.observe(aboutSection); // Also use immediate observer
}

// Animate about text with fade-right
const aboutText = document.querySelector('.about-text');
if (aboutText) {
    aboutText.classList.add('animate-fade-right');
    animationObserver.observe(aboutText);
    
    // Animate about descriptions
    const descriptions = aboutText.querySelectorAll('.about-description');
    descriptions.forEach((desc, index) => {
        desc.classList.add('animate-fade-up');
        desc.classList.add(`stagger-${index + 1}`);
        animationObserver.observe(desc);
    });
}

// Animate about image with fade-scale
const aboutImage = document.querySelector('.about-image');
if (aboutImage) {
    aboutImage.classList.add('animate-fade-scale');
    animationObserver.observe(aboutImage);
}

// Animate section headers with more visibility
document.querySelectorAll('.section-header').forEach((header, index) => {
    header.classList.add('animate-fade-down');
    header.classList.add(`stagger-${(index % 3) + 1}`);
    animationObserver.observe(header);
    
    // Also animate title and subtitle separately
    const title = header.querySelector('.section-title');
    const subtitle = header.querySelector('.section-subtitle');
    
    if (title) {
        title.classList.add('animate-fade-down');
        title.classList.add(`stagger-${(index % 3) + 1}`);
        animationObserver.observe(title);
    }
    if (subtitle) {
        subtitle.classList.add('animate-fade-up');
        subtitle.classList.add(`stagger-${(index % 3) + 2}`);
        animationObserver.observe(subtitle);
    }
});

// Animate value cards
document.querySelectorAll('.value-card').forEach((card, index) => {
    card.classList.add('animate-fade-up');
    card.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(card);
});

// Animate contact info items
document.querySelectorAll('.info-item').forEach((item, index) => {
    item.classList.add('animate-fade-left');
    item.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(item);
});

// Animate contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.classList.add('animate-fade-right');
    animationObserver.observe(contactForm);
}

// Animate page headers
document.querySelectorAll('.page-header').forEach(header => {
    header.classList.add('animate-fade-down');
    animationObserver.observe(header);
});

// Animate page title and subtitle separately
document.querySelectorAll('.page-title').forEach((title, index) => {
    title.classList.add('animate-fade-down');
    title.classList.add(`stagger-${(index % 3) + 1}`);
    animationObserver.observe(title);
});

document.querySelectorAll('.page-subtitle').forEach((subtitle, index) => {
    subtitle.classList.add('animate-fade-up');
    subtitle.classList.add(`stagger-${(index % 3) + 2}`);
    animationObserver.observe(subtitle);
});

// Animate footer sections
document.querySelectorAll('.footer-section').forEach((section, index) => {
    section.classList.add('animate-fade-up');
    section.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(section);
});

// Animate footer bottom
const footerBottom = document.querySelector('.footer-bottom');
if (footerBottom) {
    footerBottom.classList.add('animate-fade-up');
    animationObserver.observe(footerBottom);
}

// Animate CTA sections with children
document.querySelectorAll('.cta-section').forEach(cta => {
    cta.classList.add('animate-fade-scale');
    animationObserver.observe(cta);
    
    // Animate CTA title and text separately
    const ctaTitle = cta.querySelector('.cta-title');
    const ctaText = cta.querySelector('.cta-text');
    const ctaButton = cta.querySelector('.btn');
    
    if (ctaTitle) {
        ctaTitle.classList.add('animate-fade-down');
        animationObserver.observe(ctaTitle);
    }
    if (ctaText) {
        ctaText.classList.add('animate-fade-up');
        animationObserver.observe(ctaText);
    }
    if (ctaButton) {
        ctaButton.classList.add('animate-fade-scale');
        animationObserver.observe(ctaButton);
    }
});

// Animate map section
const mapSection = document.querySelector('.map-section');
if (mapSection) {
    mapSection.classList.add('animate-fade-up');
    animationObserver.observe(mapSection);
    
    const mapPlaceholder = mapSection.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.classList.add('animate-fade-scale');
        animationObserver.observe(mapPlaceholder);
    }
}

// Animate ALL sections with fade-in - ensure services and about sections animate
document.querySelectorAll('section:not(.hero):not(.page-header)').forEach((section, index) => {
    // Add animation class to section
    section.classList.add('animate-fade-up');
    section.classList.add(`stagger-${(index % 6) + 1}`);
    animationObserver.observe(section);
    
    // Also observe with immediate observer for better detection
    immediateObserver.observe(section);
    
    // Specifically handle services and about sections
    if (section.classList.contains('services') || section.classList.contains('about')) {
        // Force animation on these sections
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        sectionObserver.observe(section);
    }
});

// Animate all paragraphs and text elements with scroll
document.querySelectorAll('p:not(.hero-subtitle):not(.page-subtitle):not(.cta-text):not(.footer-text)').forEach((p, index) => {
    if (!p.closest('.service-card') && !p.closest('.value-card') && !p.closest('.footer')) {
        p.classList.add('animate-fade-up');
        p.classList.add(`stagger-${(index % 5) + 1}`);
        animationObserver.observe(p);
    }
});

// Animate all headings (h2, h3, h4) that aren't already animated
document.querySelectorAll('h2:not(.section-title):not(.page-title), h3:not(.service-title):not(.value-title):not(.cta-title), h4:not(.footer-heading)').forEach((heading, index) => {
    if (!heading.closest('.service-card') && !heading.closest('.value-card') && !heading.closest('.info-content') && !heading.closest('.footer')) {
        heading.classList.add('animate-fade-down');
        heading.classList.add(`stagger-${(index % 4) + 1}`);
        animationObserver.observe(heading);
    }
});

// Animate info content headings
document.querySelectorAll('.info-content h4').forEach((heading, index) => {
    heading.classList.add('animate-fade-right');
    heading.classList.add(`stagger-${(index % 3) + 1}`);
    animationObserver.observe(heading);
});

// Animate info content paragraphs
document.querySelectorAll('.info-content p').forEach((p, index) => {
    p.classList.add('animate-fade-left');
    p.classList.add(`stagger-${(index % 3) + 2}`);
    animationObserver.observe(p);
});

// Animate all images and placeholders
document.querySelectorAll('.image-placeholder, .map-placeholder').forEach((img, index) => {
    img.classList.add('animate-fade-scale');
    img.classList.add(`stagger-${(index % 3) + 1}`);
    animationObserver.observe(img);
});

// Animate all buttons that aren't in hero
document.querySelectorAll('.btn:not(.hero-buttons .btn)').forEach((btn, index) => {
    btn.classList.add('animate-fade-up');
    btn.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(btn);
});

// Animate all lists
document.querySelectorAll('ul:not(.nav-menu):not(.footer-links), ol').forEach((list, index) => {
    list.classList.add('animate-fade-left');
    list.classList.add(`stagger-${(index % 3) + 1}`);
    animationObserver.observe(list);
    
    // Animate list items individually
    list.querySelectorAll('li').forEach((li, liIndex) => {
        li.classList.add('animate-fade-up');
        li.classList.add(`stagger-${(liIndex % 5) + 1}`);
        animationObserver.observe(li);
    });
});

// Animate all containers and wrappers
document.querySelectorAll('.container, .wrapper, .content').forEach((container, index) => {
    if (!container.closest('.hero') && !container.closest('.navbar')) {
        container.classList.add('animate-fade-up');
        container.classList.add(`stagger-${(index % 4) + 1}`);
        animationObserver.observe(container);
    }
});

// Animate service features list items individually
document.querySelectorAll('.service-features li').forEach((li, index) => {
    li.classList.add('animate-fade-left');
    li.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(li);
});

// Animate stats items individually
document.querySelectorAll('.stat-item').forEach((stat, index) => {
    stat.classList.add('animate-fade-up');
    stat.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(stat);
});

// Animate technology items
document.querySelectorAll('.tech-item').forEach((tech, index) => {
    tech.classList.add('animate-fade-scale');
    tech.classList.add(`stagger-${(index % 8) + 1}`);
    animationObserver.observe(tech);
});

// Animate service detail sections
document.querySelectorAll('.service-detail-section').forEach((section, index) => {
    section.classList.add('animate-fade-up');
    section.classList.add(`stagger-${(index % 3) + 1}`);
    animationObserver.observe(section);
});

// Animate news cards
document.querySelectorAll('.news-card').forEach((card, index) => {
    card.classList.add('animate-fade-up');
    card.classList.add(`stagger-${(index % 6) + 1}`);
    animationObserver.observe(card);
});

// Animate category cards
document.querySelectorAll('.category-card').forEach((card, index) => {
    card.classList.add('animate-fade-scale');
    card.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(card);
});

// Animate product cards
document.querySelectorAll('.product-card').forEach((card, index) => {
    card.classList.add('animate-fade-up');
    card.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(card);
});

// Animate benefit cards
document.querySelectorAll('.benefit-card').forEach((card, index) => {
    card.classList.add('animate-fade-up');
    card.classList.add(`stagger-${(index % 4) + 1}`);
    animationObserver.observe(card);
});

// Initialize all animations on page load - ensure visible elements are shown immediately
document.addEventListener('DOMContentLoaded', () => {
    // Immediately show elements that are already in viewport
    const checkVisibleElements = () => {
        document.querySelectorAll('.animate-fade-up, .animate-fade-down, .animate-fade-left, .animate-fade-right, .animate-fade-scale').forEach((el) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200;
            
            if (isVisible && !el.classList.contains('animate-visible')) {
                // Element is already visible, animate immediately
                el.classList.add('animate-visible');
            }
        });
    };
    
    // Check immediately
    checkVisibleElements();
    
    // Check again after a short delay
    setTimeout(checkVisibleElements, 100);
    setTimeout(checkVisibleElements, 500);
    
    // Also check on scroll
    window.addEventListener('scroll', checkVisibleElements, { passive: true });
});

// Enhanced scroll-triggered animations
const scrollAnimations = () => {
    const elements = document.querySelectorAll('.animate-fade-up, .animate-fade-down, .animate-fade-left, .animate-fade-right, .animate-fade-scale');
    
    elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < window.innerHeight - elementVisible && !element.classList.contains('animate-visible')) {
            element.classList.add('animate-visible');
        }
    });
};

// Throttled scroll listener for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        scrollAnimations();
    });
}, { passive: true });

// Enhanced contact form handling with animations
const contactFormElement = document.getElementById('contactForm');

if (contactFormElement) {
    // Add focus animations to form inputs
    const formInputs = contactFormElement.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    contactFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitButton = contactFormElement.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Animate button
        submitButton.style.transform = 'scale(0.95)';
        submitButton.textContent = 'Invio in corso...';
        submitButton.disabled = true;
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone')?.value || '',
            message: document.getElementById('message').value,
            subject: document.getElementById('subject')?.value || ''
        };
        
        // Simulate form submission
        setTimeout(() => {
            console.log('Form submitted:', formData);
            
            // Show success animation
            submitButton.style.transform = 'scale(1)';
            submitButton.textContent = '✓ Invio Completato!';
            submitButton.style.background = '#4caf50';
            
            // Show success message
            setTimeout(() => {
                alert('Grazie per il tuo messaggio! Ti risponderemo il prima possibile.');
                
                // Reset form and button
                contactFormElement.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
                
                // Remove focused class from all inputs
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
            }, 1000);
        }, 1500);
    });
}

// SENIOR-LEVEL COUNTER ANIMATION SYSTEM
class CounterAnimator {
    constructor() {
        this.animatedCounters = new Set();
        this.observers = new Map();
        this.isInitialized = false;
    }

    // Robust counter animation with proper easing
    animateCounter(element, target, suffix = '', duration = 2000) {
        if (!element || !target || target <= 0) {
            console.error('Invalid counter parameters:', { element, target, suffix });
            return Promise.reject('Invalid parameters');
        }

        return new Promise((resolve) => {
            const startTime = performance.now();
            const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                
                const currentValue = Math.floor(target * easedProgress);
                element.textContent = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target + suffix;
                    resolve(target);
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    // Initialize counter for a specific element
    initializeCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        
        if (!target || target <= 0) {
            console.warn('Invalid target for counter:', element);
            return;
        }

        // Set initial state
        element.textContent = '0' + suffix;
        
        // Create intersection observer for this element
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedCounters.has(element)) {
                    this.animatedCounters.add(element);
                    
                    // Add staggered delay based on element position
                    const delay = Array.from(element.parentElement.children).indexOf(element) * 150;
                    
                    setTimeout(() => {
                        this.animateCounter(element, target, suffix, 2000)
                            .then(() => console.log(`Counter animated: ${target}${suffix}`))
                            .catch(err => console.error('Counter animation failed:', err));
                    }, delay);
                    
                    // Disconnect observer after animation starts
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        });

        observer.observe(element);
        this.observers.set(element, observer);
    }

    // Initialize all counters on the page
    initializeAllCounters() {
        if (this.isInitialized) {
            console.log('Counters already initialized');
            return;
        }

        const counters = document.querySelectorAll('.stat-number[data-target]');
        console.log(`Found ${counters.length} counters to initialize`);

        if (counters.length === 0) {
            console.warn('No counters found with data-target attribute');
            return;
        }

        counters.forEach(counter => {
            this.initializeCounter(counter);
        });

        this.isInitialized = true;
        console.log('All counters initialized successfully');
    }

    // Reset all counters (for testing)
    reset() {
        this.animatedCounters.clear();
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.isInitialized = false;
        
        // Reset counter display
        document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
            const suffix = counter.getAttribute('data-suffix') || '';
            counter.textContent = '0' + suffix;
        });
    }
}

// Create global counter animator instance
const counterAnimator = new CounterAnimator();

// SENIOR-LEVEL COUNTER INITIALIZATION
function initializeCounters() {
    console.log('🚀 Initializing counter animation system...');
    
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => counterAnimator.initializeAllCounters(), 100);
        });
    } else {
        // DOM is already ready
        setTimeout(() => counterAnimator.initializeAllCounters(), 100);
    }
    
    // Also initialize after window load as fallback
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!counterAnimator.isInitialized) {
                console.log('🔄 Fallback initialization after window load');
                counterAnimator.initializeAllCounters();
            }
        }, 200);
    });
    
    // Debug helper - expose to global scope for testing
    window.debugCounters = () => {
        console.log('🔍 Counter Debug Info:');
        console.log('- Initialized:', counterAnimator.isInitialized);
        console.log('- Animated counters:', counterAnimator.animatedCounters.size);
        console.log('- Active observers:', counterAnimator.observers.size);
        
        const counters = document.querySelectorAll('.stat-number[data-target]');
        console.log('- Total counters found:', counters.length);
        counters.forEach((counter, i) => {
            console.log(`  Counter ${i}:`, {
                target: counter.getAttribute('data-target'),
                suffix: counter.getAttribute('data-suffix'),
                current: counter.textContent,
                visible: counter.getBoundingClientRect().top < window.innerHeight
            });
        });
    };
    
    // Reset function for testing
    window.resetCounters = () => {
        console.log('🔄 Resetting all counters');
        counterAnimator.reset();
        setTimeout(() => counterAnimator.initializeAllCounters(), 100);
    };
}

// INITIALIZE EVERYTHING WHEN DOM IS READY
(function() {
    console.log('🎯 Starting application initialization...');
    
    // Initialize counter system
    initializeCounters();
    
    // Initialize other animations and features
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    
    function initializeApp() {
        console.log('✅ Application initialized');
        
        // Test counters after 3 seconds if they haven't animated
        setTimeout(() => {
            const counters = document.querySelectorAll('.stat-number[data-target]');
            const hasAnimated = Array.from(counters).some(counter => 
                parseInt(counter.textContent) > 0
            );
            
            if (!hasAnimated && counters.length > 0) {
                console.log('⚠️ Counters not animated after 3s, forcing initialization');
                window.resetCounters();
            }
        }, 3000);
    }
})();

// Enhanced parallax effect for hero section with smooth scrolling
let ticking = false;
let lastScrollY = 0;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroShapes = document.querySelectorAll('.hero-shapes .shape');
    
    if (hero && scrolled < window.innerHeight) {
        // Parallax for hero background
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        
        // Parallax for hero content (slower)
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.opacity = Math.max(0.5, 1 - (scrolled / window.innerHeight) * 0.5);
        }
        
        // Parallax for shapes (different speeds)
        heroShapes.forEach((shape, index) => {
            const speed = 0.3 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    }
    
    // Add scroll-based animations to elements
    const scrollProgress = scrolled / (document.documentElement.scrollHeight - window.innerHeight);
    
    // Animate elements based on scroll position
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-visible');
        }
    });
    
    lastScrollY = scrolled;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// Smooth reveal animation for page load
// Add loaded class immediately to ensure content is visible
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.classList.add('loaded');
        });
    } else {
        // DOM is already ready
        document.body.classList.add('loaded');
    }
    
    // Also add on window load as backup
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Immediate fallback - add loaded class right away
    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 50);
})();

// Page transition effect
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in to main content
    const mainContent = document.querySelector('main') || document.body;
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    mainContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 150);
});

// Set active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
    }
});

// Add active state to nav links based on scroll position (for single-page sections)
const sections = document.querySelectorAll('section[id]');

if (sections.length > 0) {
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    const linkHref = link.getAttribute('href');
                    if (linkHref.startsWith('#')) {
                        link.classList.remove('active');
                        if (linkHref === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    }
                });
            }
        });
    });
}

