/* ========================================
   DABRAL VENTURES - MAIN JAVASCRIPT
   Premium Interactive Features
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    
    const hidePreloader = () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
                // Trigger initial animations
                triggerHeroAnimations();
            }, 500);
        }
    };

    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 1500);
    });

    // Fallback if load takes too long
    setTimeout(hidePreloader, 5000);

    // ========== CUSTOM CURSOR ==========
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            // Cursor follows mouse instantly
            cursorX += (mouseX - cursorX) * 0.5;
            cursorY += (mouseY - cursorY) * 0.5;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

            // Follower has delay
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Cursor effects on hover
        const cursorTargets = document.querySelectorAll('a, button, .service-card, .portfolio-item, [data-cursor]');
        cursorTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                cursorFollower.classList.remove('active');
            });
        });
    } else {
        // Hide custom cursor on touch devices
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
    }

    // ========== NAVBAR SCROLL BEHAVIOR ==========
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScroll = 0;
    let ticking = false;

    const updateNavbar = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Add scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update scroll progress
        if (scrollProgress) {
            const progress = (scrollY / docHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Update active nav link
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        lastScroll = scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ========== MOBILE MENU ==========
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== THEME TOGGLE ==========
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle icon
        if (themeToggle) {
            const icon = themeToggle.querySelector('svg');
            if (icon) {
                icon.innerHTML = theme === 'light' 
                    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
                    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
            }
        }
    };

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark.matches) {
        setTheme('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== HERO ANIMATIONS ==========
    const triggerHeroAnimations = () => {
        // Typing effect for hero text
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.opacity = '1';
        }

        // Animate hero stats
        const statsCounters = document.querySelectorAll('.stat-number');
        statsCounters.forEach(counter => {
            animateCounter(counter);
        });
    };

    // ========== NUMBER COUNTER ANIMATION ==========
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        // Start when element is visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(element);
    };

    // Initialize counters
    document.querySelectorAll('[data-count]').forEach(counter => {
        animateCounter(counter);
    });

    // ========== PARTICLE BACKGROUND ==========
    const createParticles = () => {
        const heroParticles = document.getElementById('hero-particles');
        if (!heroParticles) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 5 + 2}px;
                height: ${Math.random() * 5 + 2}px;
                background: var(--accent-primary);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            heroParticles.appendChild(particle);
        }
    };

    createParticles();

    // ========== PROCESS TIMELINE SCROLL ==========
    const processTrack = document.querySelector('.process-track-progress');
    const processSection = document.getElementById('process');
    
    if (processTrack && processSection) {
        const updateProcessProgress = () => {
            const rect = processSection.getBoundingClientRect();
            const sectionHeight = processSection.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Calculate progress through section
            const startPoint = viewportHeight * 0.8;
            const endPoint = -sectionHeight + viewportHeight * 0.2;
            const totalDistance = startPoint - endPoint;
            const currentPosition = startPoint - rect.top;
            
            let progress = currentPosition / totalDistance;
            progress = Math.max(0, Math.min(1, progress));
            
            processTrack.style.transform = `scaleY(${progress})`;
            
            // Highlight active step
            const steps = document.querySelectorAll('.process-step');
            const stepProgress = progress * steps.length;
            
            steps.forEach((step, index) => {
                if (index < stepProgress) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', updateProcessProgress);
    }

    // ========== PORTFOLIO FILTER & SLIDER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioSlider = document.getElementById('portfolio-slider');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Clone items for seamless loop based on filter
    const setupSlider = (filter) => {
        if (!portfolioSlider) return;
        
        // Show/hide items based on filter
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter || category === 'cta') {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Restart animation
        portfolioSlider.style.animation = 'none';
        portfolioSlider.offsetHeight; // Trigger reflow
        portfolioSlider.style.animation = 'portfolioSlide 30s linear infinite';
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            setupSlider(filter);
        });
    });

    // ========== PORTFOLIO ITEM HOVER ==========
    portfolioItems.forEach(item => {
        const image = item.querySelector('.portfolio-image img');
        
        item.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });

    // ========== PORTFOLIO PREVIEW IMAGE LOADER ==========
    // Supports jpg, jpeg, png formats
    const loadPreviewImage = (imgElement, basePath) => {
        const formats = ['jpg', 'jpeg', 'png', 'webp'];
        let currentIndex = 0;
        
        const tryNextFormat = () => {
            if (currentIndex >= formats.length) {
                // All formats failed, keep placeholder
                imgElement.style.display = 'none';
                return;
            }
            
            const testImg = new Image();
            const src = `${basePath}.${formats[currentIndex]}`;
            
            testImg.onload = () => {
                imgElement.src = src;
                imgElement.style.display = '';
            };
            
            testImg.onerror = () => {
                currentIndex++;
                tryNextFormat();
            };
            
            testImg.src = src;
        };
        
        tryNextFormat();
    };

    // Load all preview images with format detection
    document.querySelectorAll('.portfolio-preview, .portfolio-preview-popup img').forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            // Extract base path without extension
            const basePath = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
            loadPreviewImage(img, basePath);
        }
    });

    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('.form-input');
        
        // Floating label effect
        inputs.forEach(input => {
            // Check if input has value on load
            if (input.value) {
                input.classList.add('has-value');
            }

            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Validate
            if (!validateForm()) return;

            // Show loading state
            submitBtn.innerHTML = '<span class="spinner-dots"><span></span><span></span><span></span></span>';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                inputs.forEach(input => input.classList.remove('has-value'));
                
            } catch (error) {
                showNotification('Something went wrong. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        const validateForm = () => {
            let isValid = true;
            
            inputs.forEach(input => {
                const parent = input.parentElement;
                parent.classList.remove('error');
                
                if (input.required && !input.value.trim()) {
                    parent.classList.add('error');
                    isValid = false;
                }
                
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        parent.classList.add('error');
                        isValid = false;
                    }
                }
            });

            if (!isValid) {
                contactForm.classList.add('shake');
                setTimeout(() => contactForm.classList.remove('shake'), 500);
            }

            return isValid;
        };
    }

    // ========== NOTIFICATION SYSTEM ==========
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    };

    // ========== BACK TO TOP ==========
    const backToTop = document.getElementById('back-to-top');
    const progressRing = document.querySelector('.progress-ring-circle');
    
    if (backToTop && progressRing) {
        const circumference = 2 * Math.PI * 18;
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference;

        const updateBackToTop = () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollY / docHeight;

            // Show/hide button
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Update progress ring
            const offset = circumference - (progress * circumference);
            progressRing.style.strokeDashoffset = offset;
        };

        window.addEventListener('scroll', updateBackToTop);

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== TILT EFFECT ==========
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;
            
            element.style.setProperty('--tilt-x', `${tiltX}deg`);
            element.style.setProperty('--tilt-y', `${tiltY}deg`);
        });

        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--tilt-x', '0deg');
            element.style.setProperty('--tilt-y', '0deg');
        });
    });

    // ========== MAGNETIC BUTTONS ==========
    const magneticBtns = document.querySelectorAll('.magnetic');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ========== SERVICE CARDS 3D TILT ==========
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // ========== SMOOTH PARALLAX FOR SHAPES ==========
    const parallaxElements = document.querySelectorAll('.floating-shape');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach((el, index) => {
            const speed = (index + 1) * 0.05;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // ========== TEXT SCRAMBLE EFFECT ==========
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble">${char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Apply text scramble to hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const phrases = [
            'Build Websites, Apps & AI Tools That Scale',
            'Transform Ideas Into Digital Reality',
            'Your Vision, Our Innovation'
        ];
        
        const scrambler = new TextScramble(heroSubtitle);
        let counter = 0;

        const nextPhrase = () => {
            scrambler.setText(phrases[counter]).then(() => {
                setTimeout(nextPhrase, 3000);
            });
            counter = (counter + 1) % phrases.length;
        };

        setTimeout(nextPhrase, 2000);
    }

    // ========== LAZY LOADING IMAGES ==========
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener('keydown', (e) => {
        // ESC closes mobile menu
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                menuToggle.click();
            }
        }
    });

    // ========== CONSOLE EASTER EGG ==========
    console.log('%c🚀 Dabral Ventures', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cBuilding Digital Excellence', 'font-size: 14px; color: #8b5cf6;');
    console.log('%cWant to work with us? Visit dabralventures.com', 'font-size: 12px; color: #06b6d4;');

    // ========== TERMINAL TYPING ANIMATION ==========
    const terminalCode = document.getElementById('terminal-code');
    const terminalLineNumbers = document.getElementById('terminal-line-numbers');
    const terminalCursor = document.getElementById('terminal-cursor');

    if (terminalCode && terminalLineNumbers) {
        // Code snippets with syntax highlighting tokens
        const codeSnippets = [
            // Snippet 1: HTML structure
            [
                { tokens: [{ type: 'comment', text: '<!-- Dabral Ventures - index.html -->' }] },
                { tokens: [{ type: 'tag', text: '<!DOCTYPE ' }, { type: 'attr', text: 'html' }, { type: 'tag', text: '>' }] },
                { tokens: [{ type: 'tag', text: '<html ' }, { type: 'attr', text: 'lang' }, { type: 'punct', text: '=' }, { type: 'str', text: '"en"' }, { type: 'tag', text: '>' }] },
                { tokens: [{ type: 'tag', text: '<head>' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'tag', text: '<meta ' }, { type: 'attr', text: 'charset' }, { type: 'punct', text: '=' }, { type: 'str', text: '"UTF-8"' }, { type: 'tag', text: '>' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'tag', text: '<title>' }, { type: 'text', text: 'Dabral Ventures' }, { type: 'tag', text: '</title>' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'tag', text: '<link ' }, { type: 'attr', text: 'rel' }, { type: 'punct', text: '=' }, { type: 'str', text: '"stylesheet"' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'attr', text: 'href' }, { type: 'punct', text: '=' }, { type: 'str', text: '"css/style.css"' }, { type: 'tag', text: '>' }] },
                { tokens: [{ type: 'tag', text: '</head>' }] },
                { tokens: [{ type: 'tag', text: '<body>' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'tag', text: '<section ' }, { type: 'attr', text: 'class' }, { type: 'punct', text: '=' }, { type: 'str', text: '"hero"' }, { type: 'tag', text: '>' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'tag', text: '<h1 ' }, { type: 'attr', text: 'class' }, { type: 'punct', text: '=' }, { type: 'str', text: '"title"' }, { type: 'tag', text: '>' }] },
                { tokens: [{ type: 'text', text: '      Build Something' }] },
                { tokens: [{ type: 'text', text: '      ' }, { type: 'tag', text: '<span ' }, { type: 'attr', text: 'class' }, { type: 'punct', text: '=' }, { type: 'str', text: '"gradient"' }, { type: 'tag', text: '>' }] },
                { tokens: [{ type: 'text', text: '        Amazing' }] },
                { tokens: [{ type: 'text', text: '      ' }, { type: 'tag', text: '</span>' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'tag', text: '</h1>' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'tag', text: '<a ' }, { type: 'attr', text: 'href' }, { type: 'punct', text: '=' }, { type: 'str', text: '"#contact"' }, { type: 'tag', text: '>' }] },
                { tokens: [{ type: 'text', text: '      Get Started  🚀' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'tag', text: '</a>' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'tag', text: '</section>' }] },
                { tokens: [{ type: 'tag', text: '</body>' }] },
                { tokens: [{ type: 'tag', text: '</html>' }] },
            ],
            // Snippet 2: CSS with styling
            [
                { tokens: [{ type: 'comment', text: '/* ⚡ Dabral Ventures - Style */' }] },
                { tokens: [] },
                { tokens: [{ type: 'punct', text: ':' }, { type: 'keyword', text: 'root' }, { type: 'punct', text: ' {' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: '--primary' }, { type: 'punct', text: ': ' }, { type: 'value', text: '#6366f1' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: '--accent' }, { type: 'punct', text: ': ' }, { type: 'value', text: '#8b5cf6' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: '--bg' }, { type: 'punct', text: ': ' }, { type: 'value', text: '#0a0a0f' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'punct', text: '}' }] },
                { tokens: [] },
                { tokens: [{ type: 'punct', text: '.' }, { type: 'keyword', text: 'hero' }, { type: 'punct', text: ' {' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: 'display' }, { type: 'punct', text: ': ' }, { type: 'value', text: 'grid' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: 'min-height' }, { type: 'punct', text: ': ' }, { type: 'value', text: '100vh' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: 'align-items' }, { type: 'punct', text: ': ' }, { type: 'value', text: 'center' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: 'background' }, { type: 'punct', text: ': ' }, { type: 'value', text: 'var(--bg)' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'punct', text: '}' }] },
                { tokens: [] },
                { tokens: [{ type: 'punct', text: '.' }, { type: 'keyword', text: 'gradient' }, { type: 'punct', text: ' {' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: 'background' }, { type: 'punct', text: ': ' }, { type: 'keyword', text: 'linear-gradient' }, { type: 'punct', text: '(' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'value', text: '135deg' }, { type: 'punct', text: ',' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'value', text: 'var(--primary)' }, { type: 'punct', text: ',' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'value', text: 'var(--accent)' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'punct', text: ');' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'prop', text: '-webkit-background-clip' }, { type: 'punct', text: ': ' }, { type: 'value', text: 'text' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'punct', text: '}' }] },
            ],
            // Snippet 3: JavaScript
            [
                { tokens: [{ type: 'comment', text: '// 🚀 Dabral Ventures - App.js' }] },
                { tokens: [] },
                { tokens: [{ type: 'keyword', text: 'const' }, { type: 'text', text: ' app ' }, { type: 'punct', text: '= ' }, { type: 'keyword', text: 'async' }, { type: 'text', text: ' () ' }, { type: 'punct', text: '=> {' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'keyword', text: 'const' }, { type: 'text', text: ' config ' }, { type: 'punct', text: '= {' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'prop', text: 'name' }, { type: 'punct', text: ': ' }, { type: 'str', text: '"Dabral Ventures"' }, { type: 'punct', text: ',' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'prop', text: 'version' }, { type: 'punct', text: ': ' }, { type: 'str', text: '"2.0.0"' }, { type: 'punct', text: ',' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'prop', text: 'features' }, { type: 'punct', text: ': [' }] },
                { tokens: [{ type: 'text', text: '      ' }, { type: 'str', text: '"web-dev"' }, { type: 'punct', text: ',' }] },
                { tokens: [{ type: 'text', text: '      ' }, { type: 'str', text: '"app-dev"' }, { type: 'punct', text: ',' }] },
                { tokens: [{ type: 'text', text: '      ' }, { type: 'str', text: '"ai-tools"' }, { type: 'punct', text: ',' }] },
                { tokens: [{ type: 'text', text: '      ' }, { type: 'str', text: '"marketing"' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'punct', text: '],' }] },
                { tokens: [{ type: 'text', text: '    ' }, { type: 'prop', text: 'status' }, { type: 'punct', text: ': ' }, { type: 'str', text: '"launching..."' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'punct', text: '};' }] },
                { tokens: [] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'keyword', text: 'await' }, { type: 'text', text: ' deploy(config)' }, { type: 'punct', text: ';' }] },
                { tokens: [{ type: 'text', text: '  ' }, { type: 'keyword', text: 'console' }, { type: 'punct', text: '.' }, { type: 'text', text: 'log' }, { type: 'punct', text: '(' }, { type: 'str', text: '"✅ Live!"' }, { type: 'punct', text: ');' }] },
                { tokens: [{ type: 'punct', text: '};' }] },
                { tokens: [] },
                { tokens: [{ type: 'text', text: 'app()' }, { type: 'punct', text: ';' }] },
            ]
        ];

        let currentSnippet = 0;
        let currentLine = 0;
        let currentChar = 0;
        let lineCount = 0;
        let isTyping = false;

        const renderToken = (token) => {
            return `<span class="token-${token.type}">${escapeHtml(token.text)}</span>`;
        };

        const escapeHtml = (text) => {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        };

        const addLineNumber = () => {
            lineCount++;
            const lineNum = document.createElement('div');
            lineNum.textContent = lineCount;
            lineNum.style.minHeight = '1.75em';
            terminalLineNumbers.appendChild(lineNum);
        };

        const clearTerminal = () => {
            // Remove all code lines but keep cursor
            const codeLines = terminalCode.querySelectorAll('.code-line');
            codeLines.forEach(line => line.remove());
            terminalLineNumbers.innerHTML = '';
            lineCount = 0;
        };

        const typeSnippet = async (snippetIndex) => {
            const snippet = codeSnippets[snippetIndex];
            isTyping = true;
            
            // Get terminal body for dynamic height adjustment
            const terminalBody = terminalCode.closest('.terminal-body');
            const lineHeight = 1.8 * 0.85 * 16; // line-height * font-size in px (approx 24px)

            for (let lineIdx = 0; lineIdx < snippet.length; lineIdx++) {
                const line = snippet[lineIdx];
                const lineEl = document.createElement('div');
                lineEl.className = 'code-line';
                
                // Insert before cursor
                terminalCode.insertBefore(lineEl, terminalCursor);
                addLineNumber();
                
                // Dynamically grow terminal height as lines are added
                if (terminalBody) {
                    const currentLines = lineCount;
                    const neededHeight = (currentLines * lineHeight) + 60; // 60px for padding
                    const currentMinHeight = parseInt(getComputedStyle(terminalBody).minHeight) || 420;
                    if (neededHeight > currentMinHeight) {
                        terminalBody.style.minHeight = neededHeight + 'px';
                    }
                }

                // Type each token character by character
                let lineHtml = '';
                for (const token of line.tokens) {
                    for (let charIdx = 0; charIdx < token.text.length; charIdx++) {
                        lineHtml = '';
                        // Re-render all completed tokens + current partial token
                        let completedTokens = '';
                        const tokenIdx = line.tokens.indexOf(token);
                        
                        for (let t = 0; t < tokenIdx; t++) {
                            completedTokens += renderToken(line.tokens[t]);
                        }
                        
                        const partialText = token.text.substring(0, charIdx + 1);
                        const partialToken = { type: token.type, text: partialText };
                        
                        lineEl.innerHTML = completedTokens + renderToken(partialToken);
                        
                        // Typing speed variation for realism
                        const baseSpeed = 14;
                        const variation = Math.random() * 18;
                        await sleep(baseSpeed + variation);
                    }
                }

                // Set final line content
                let finalHtml = '';
                for (const token of line.tokens) {
                    finalHtml += renderToken(token);
                }
                lineEl.innerHTML = finalHtml;

                // Scroll terminal body to show latest line
                if (terminalBody) {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }

                // Short pause between lines
                await sleep(45 + Math.random() * 35);
            }

            isTyping = false;
        };

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const startTerminalAnimation = async () => {
            // Wait for preloader to finish
            await sleep(2500);

            while (true) {
                clearTerminal();
                await typeSnippet(currentSnippet);
                currentSnippet = (currentSnippet + 1) % codeSnippets.length;
                
                // Pause before clearing and typing next snippet
                await sleep(1200);
            }
        };

        startTerminalAnimation();
    }

    // ========== HERO WORD STAGGER ANIMATION ==========
    const heroWords = document.querySelectorAll('.title-word');
    heroWords.forEach((word, index) => {
        word.style.animationDelay = `${index * 0.1 + 0.5}s`;
        word.style.opacity = '0';
        word.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            word.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
        }, index * 120 + 1800);
    });

    // ========== ENHANCED PARTICLE SYSTEM ==========
    const createParticlesEnhanced = () => {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 40;
        const colors = ['#c8b89a', '#a09080', '#8a9a8e', '#908880', '#b0a898'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: particleFloat ${Math.random() * 15 + 10}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
                box-shadow: 0 0 ${size * 2}px ${color}40;
            `;
            particlesContainer.appendChild(particle);
        }
    };

    createParticlesEnhanced();

});

// ========== FADE IN UP KEYFRAME ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .notification {
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #10b981;
    }

    .notification-error {
        border-left: 4px solid #ef4444;
    }

    .notification-info {
        border-left: 4px solid #3b82f6;
    }

    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }

    .notification-close:hover {
        color: var(--text-primary);
    }

    .scramble {
        color: var(--accent-primary);
    }

    .form-group.error .form-input {
        border-color: #ef4444;
    }

    .form-group.error .form-label {
        color: #ef4444;
    }
`;
document.head.appendChild(style);
