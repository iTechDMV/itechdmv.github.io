// iTechDMV Main JavaScript File
// Handles all interactive functionality across the website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initScrollAnimations();
    initStatCounters();
    initServiceFilters();
    initServiceCalculator();
    initContactForm();
    initFAQ();
    initMap();
    initChatWidget();
    
    console.log('iTechDMV website initialized successfully');
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Statistics Counter Animation
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.dataset.count);
                animateCounter(target, finalValue);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 40);
}

// Service Filters
function initServiceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            serviceCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 500,
                        easing: 'easeOutQuart'
                    });
                } else {
                    anime({
                        targets: card,
                        opacity: 0,
                        translateY: 20,
                        duration: 300,
                        easing: 'easeInQuart',
                        complete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Service Calculator
let currentStep = 1;
let calculatorData = {};

function initServiceCalculator() {
    // Calculator is initialized when opened
}

function openCalculator(serviceType = null) {
    const modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Pre-select service if provided
        if (serviceType) {
            const serviceRadio = document.querySelector(`input[name="service"][value="${serviceType}"]`);
            if (serviceRadio) {
                serviceRadio.checked = true;
            }
        }
        
        resetCalculator();
    }
}

function closeCalculator() {
    const modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resetCalculator();
    }
}

function resetCalculator() {
    currentStep = 1;
    calculatorData = {};
    updateCalculatorStep();
}

function nextStep() {
    if (validateCurrentStep()) {
        collectStepData();
        currentStep++;
        updateCalculatorStep();
        
        if (currentStep === 3) {
            generateQuote();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateCalculatorStep();
    }
}

function updateCalculatorStep() {
    // Hide all steps
    document.querySelectorAll('.calculator-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Update progress
    const progressBar = document.getElementById('progress-bar');
    const currentStepSpan = document.getElementById('current-step');
    const progressPercent = document.getElementById('progress-percent');
    
    if (progressBar) {
        const progress = (currentStep / 3) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    if (currentStepSpan) {
        currentStepSpan.textContent = currentStep;
    }
    
    if (progressPercent) {
        progressPercent.textContent = `${Math.round((currentStep / 3) * 100)}%`;
    }
    
    // Update buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (prevBtn) {
        prevBtn.classList.toggle('hidden', currentStep === 1);
    }
    
    if (nextBtn && submitBtn) {
        nextBtn.classList.toggle('hidden', currentStep === 3);
        submitBtn.classList.toggle('hidden', currentStep !== 3);
    }
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            input.focus();
            showNotification('Please fill in all required fields', 'error');
            return false;
        }
    }
    
    return true;
}

function collectStepData() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'radio' && input.checked) {
            calculatorData[input.name] = input.value;
        } else if (input.type !== 'radio') {
            calculatorData[input.name] = input.value;
        }
    });
}

function generateQuote() {
    const quoteSummary = document.getElementById('quote-summary');
    if (!quoteSummary) return;
    
    // Calculate pricing based on selections
    let basePrice = 0;
    let serviceName = '';
    
    switch (calculatorData.service) {
        case 'm365':
            basePrice = 12;
            serviceName = 'Microsoft 365';
            break;
        case 'azure':
            basePrice = 100;
            serviceName = 'Azure Cloud Services';
            break;
        case 'security':
            basePrice = 8;
            serviceName = 'Security Services';
            break;
        default:
            basePrice = 50;
            serviceName = 'Custom Solution';
    }
    
    // Adjust for organization size
    let multiplier = 1;
    switch (calculatorData.size) {
        case 'medium':
            multiplier = 0.9; // 10% discount
            break;
        case 'large':
            multiplier = 0.8; // 20% discount
            break;
    }
    
    const finalPrice = basePrice * multiplier;
    
    quoteSummary.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-itech-navy">Service:</span>
            <span class="text-itech-gray">${serviceName}</span>
        </div>
        <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-itech-navy">Organization Size:</span>
            <span class="text-itech-gray">${calculatorData.size || 'Small'}</span>
        </div>
        <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-itech-navy">Estimated Monthly Cost:</span>
            <span class="text-2xl font-bold text-itech-teal">$${finalPrice.toFixed(2)}/user</span>
        </div>
        <p class="text-sm text-itech-gray mt-4">
            *Final pricing may vary based on specific requirements and customizations.
        </p>
    `;
}

function submitQuote() {
    if (validateCurrentStep()) {
        collectStepData();
        
        // Simulate form submission
        showNotification('Thank you! Your quote request has been submitted. We\'ll contact you within 24 hours.', 'success');
        
        // Close modal after delay
        setTimeout(() => {
            closeCalculator();
        }, 3000);
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// FAQ Toggle
function initFAQ() {
    // FAQ functionality is handled by toggleFAQ function
}

function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't already active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Map Initialization
function initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement && typeof L !== 'undefined') {
        // Harrisonburg, VA coordinates
        const map = L.map('map').setView([38.4496, -78.8689], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add marker for iTechDMV office
        L.marker([38.4496, -78.8689])
            .addTo(map)
            .bindPopup('<b>iTechDMV</b><br>123 Technology Drive<br>Harrisonburg, VA 22801')
            .openPopup();
    }
}

// Chat Widget
function initChatWidget() {
    // Chat widget is initialized when clicked
}

function openChat() {
    showNotification('Live chat feature coming soon! Please call us at (540) 555-0123 for immediate assistance.', 'info');
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
    
    // Set colors based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        case 'info':
        default:
            notification.classList.add('bg-itech-teal', 'text-white');
            break;
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="mr-4">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Smooth scrolling for anchor links
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

// Handle window resize
window.addEventListener('resize', function() {
    // Reinitialize map if it exists
    if (typeof map !== 'undefined') {
        map.invalidateSize();
    }
});

// Handle page visibility change for animations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        anime.running.forEach(animation => animation.pause());
    } else {
        // Resume animations when page becomes visible
        anime.running.forEach(animation => animation.play());
    }
});

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Export functions for global access
window.iTechDMV = {
    openCalculator,
    closeCalculator,
    nextStep,
    previousStep,
    submitQuote,
    toggleFAQ,
    openChat,
    showNotification
};