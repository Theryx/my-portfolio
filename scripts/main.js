// ========== LANGUAGE TOGGLE ==========
const langToggle = document.getElementById('langToggle');
let currentLang = 'en';

const translations = {
    en: {},
    fr: {}
};

function setLanguage(lang) {
    currentLang = lang;
    
    // Update all elements with data-en and data-fr attributes
    document.querySelectorAll('[data-en][data-fr]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update toggle button text
    langToggle.textContent = lang === 'en' ? 'FR' : 'EN';
    
    // Update html lang attribute
    document.documentElement.lang = lang;
    
    // Store preference
    localStorage.setItem('preferred-lang', lang);
}

langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
});

// Load saved language preference
const savedLang = localStorage.getItem('preferred-lang');
if (savedLang && savedLang !== currentLang) {
    setLanguage(savedLang);
}

// ========== MOBILE MENU ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('mobile-menu--active', menuOpen);
    
    // Animate hamburger
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking links
document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('mobile-menu--active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ========== HEADER SCROLL EFFECT ==========
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});

// ========== FAQ ACCORDION ==========
document.querySelectorAll('.faq__question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const answer = faqItem.querySelector('.faq__answer');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Close all other items
        document.querySelectorAll('.faq__item').forEach(item => {
            if (item !== faqItem) {
                item.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                item.querySelector('.faq__answer').hidden = true;
            }
        });
        
        // Toggle current item
        button.setAttribute('aria-expanded', !isExpanded);
        answer.hidden = isExpanded;
    });
});

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', data);
    
    // Show success message
    const successMessage = currentLang === 'en' 
        ? 'Message sent successfully! I\'ll get back to you soon.'
        : 'Message envoyé avec succès ! Je vous répondrai bientôt.';
    
    alert(successMessage);
    contactForm.reset();
});

// ========== CURRENT YEAR ==========
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 72;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('.project-card, .skill-card, .about__content, .philosophy__content').forEach(el => {
    observer.observe(el);
});
