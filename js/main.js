/**
 * Modern Resume - JavaScript
 * Author: Nadeem Khan
 */

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize form handling
    initContactForm();
    
    // Initialize smooth scrolling
    initSmoothScroll();
});

/**
 * Initialize scroll-triggered animations
 */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const messageDiv = document.getElementById('formMessage');
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form data
        if (!validateForm(data)) {
            return;
        }

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Send email using PHP
            const response = await fetch('contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString()
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                messageDiv.className = 'form-message success';
                messageDiv.textContent = result.message;
                messageDiv.style.display = 'block';
                form.reset();
            } else {
                // Show error message
                messageDiv.className = 'form-message error';
                messageDiv.textContent = result.message;
                messageDiv.style.display = 'block';
            }
        } catch (error) {
            // Show error message
            messageDiv.className = 'form-message error';
            messageDiv.textContent = 'An error occurred. Please try again or email me directly.';
            messageDiv.style.display = 'block';
            console.error('Error:', error);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    });
}

/**
 * Validate form data
 */
function validateForm(data) {
    const messageDiv = document.getElementById('formMessage');
    
    // Check if name is provided
    if (!data.name || data.name.trim() === '') {
        showError('Please enter your name.');
        return false;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showError('Please enter a valid email address.');
        return false;
    }

    // Check if subject is provided
    if (!data.subject || data.subject.trim() === '') {
        showError('Please enter a subject.');
        return false;
    }

    // Check if message is provided
    if (!data.message || data.message.trim() === '') {
        showError('Please enter your message.');
        return false;
    }

    return true;
}

/**
 * Show error message
 */
function showError(message) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.className = 'form-message error';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

/**
 * Initialize smooth scrolling for navigation
 */
function initSmoothScroll() {
    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

/**
 * Optional: Add parallax effect to header
 */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        const scrollPosition = window.pageYOffset;
        header.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    }
});

/**
 * Optional: Add reveal animation on scroll for elements
 */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.skill-category, .timeline-item, .education-card, .portfolio-item');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
