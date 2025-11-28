/**
 * OBD-Waste Solutions Pitch Deck Navigation
 * Handles slide navigation, keyboard controls, and presentation mode
 */

class PitchDeck {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.presentationMode = false;
        
        this.init();
    }
    
    init() {
        // Initialize theme
        this.initTheme();
        
        // Create navigation controls
        this.createNavigation();
        
        // Create theme toggle
        this.createThemeToggle();
        
        // Add keyboard listeners
        this.addKeyboardListeners();
        
        // Add touch/swipe support
        this.addTouchSupport();
        
        // Update slide indicators
        this.updateIndicators();
        
        // Add intersection observer for scroll animations
        this.setupScrollAnimations();
        
        // Show first slide
        this.showSlide(0);
        
        // Animate on load
        setTimeout(() => {
            this.triggerSlideAnimations(this.slides[0]);
        }, 500);
    }
    
    initTheme() {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.id = 'theme-toggle';
        toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        toggle.title = 'Toggle Light/Dark Mode';
        toggle.setAttribute('aria-label', 'Toggle theme');
        
        // Set initial icon based on current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
        
        toggle.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(toggle);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.innerHTML = newTheme === 'light' 
                ? '<i class="fa-solid fa-sun"></i>' 
                : '<i class="fa-solid fa-moon"></i>';
        }
    }
    
    setupScrollAnimations() {
        // Use Intersection Observer to trigger animations when slides come into view
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSlideAnimations(entry.target);
                }
            });
        }, observerOptions);
        
        this.slides.forEach(slide => {
            observer.observe(slide);
        });
    }
    
    createNavigation() {
        // Create progress indicator
        const progress = document.createElement('div');
        progress.className = 'progress-indicator';
        progress.id = 'progress-indicator';
        document.body.appendChild(progress);
        
        const nav = document.createElement('div');
        nav.className = 'nav-controls';
        nav.innerHTML = `
            <button class="nav-btn" id="prev-btn" title="Previous (←)">
                <i class="fa-solid fa-chevron-left"></i> Prev
            </button>
            <div class="slide-indicator" id="slide-indicator"></div>
            <div class="slide-counter">
                <span id="current-slide">1</span> / <span id="total-slides">${this.totalSlides}</span>
            </div>
            <button class="nav-btn" id="next-btn" title="Next (→)">
                Next <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button class="nav-btn" id="presentation-btn" title="Toggle Presentation Mode (F)">
                <i class="fa-solid fa-expand"></i>
            </button>
        `;
        document.body.appendChild(nav);
        
        // Add event listeners
        document.getElementById('prev-btn').addEventListener('click', () => this.prevSlide());
        document.getElementById('next-btn').addEventListener('click', () => this.nextSlide());
        document.getElementById('presentation-btn').addEventListener('click', () => this.togglePresentationMode());
        
        // Create slide dots
        this.createSlideDots();
    }
    
    createSlideDots() {
        const indicator = document.getElementById('slide-indicator');
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'slide-dot';
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => this.goToSlide(i));
            indicator.appendChild(dot);
        }
    }
    
    addKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Don't interfere with typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case 'ArrowRight':
                case 'PageDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.togglePresentationMode();
                    break;
                case 'Escape':
                    if (this.presentationMode) {
                        e.preventDefault();
                        this.togglePresentationMode();
                    }
                    break;
            }
        });
    }
    
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.prevSlide();
                }
            }
        };
    }
    
    showSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        
        const previousSlide = this.currentSlide;
        this.currentSlide = index;
        
        if (this.presentationMode) {
            // Animate slide transition
            this.slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    // Trigger animations on new slide
                    setTimeout(() => {
                        slide.classList.add('active');
                        this.triggerSlideAnimations(slide);
                    }, 50);
                }
            });
        } else {
            // Scroll to slide with smooth animation
            this.slides[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Trigger animations after scroll
            setTimeout(() => {
                this.triggerSlideAnimations(this.slides[index]);
            }, 300);
        }
        
        this.updateIndicators();
        this.updateCounter();
    }
    
    triggerSlideAnimations(slide) {
        // Reset and trigger animations for elements in the slide
        const animatedElements = slide.querySelectorAll('.animate-up, .card, .img-box, h1, h2, h3, .tag');
        animatedElements.forEach((el, i) => {
            el.style.animation = 'none';
            // Force reflow
            void el.offsetHeight;
            // Re-apply animation with delay
            el.style.animation = null;
            el.style.animationDelay = `${i * 0.1}s`;
        });
        
        // Animate bar charts - ensure they're visible
        const bars = slide.querySelectorAll('.bar');
        bars.forEach((bar) => {
            // Make sure bars are visible
            bar.style.transform = 'scaleY(1)';
            bar.style.opacity = '1';
            bar.classList.add('animate');
        });
    }
    
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    togglePresentationMode() {
        this.presentationMode = !this.presentationMode;
        document.body.classList.toggle('presentation-mode', this.presentationMode);
        
        const btn = document.getElementById('presentation-btn');
        const icon = btn.querySelector('i');
        
        if (this.presentationMode) {
            icon.className = 'fa-solid fa-compress';
            btn.title = 'Exit Presentation Mode (F)';
            // Request fullscreen if supported
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {
                    // User denied or error
                });
            }
            // Show current slide in presentation mode
            setTimeout(() => {
                this.showSlide(this.currentSlide);
            }, 100);
        } else {
            icon.className = 'fa-solid fa-expand';
            btn.title = 'Toggle Presentation Mode (F)';
            // Exit fullscreen if in fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            // Remove active class from all slides
            this.slides.forEach(slide => slide.classList.remove('active'));
        }
    }
    
    updateIndicators() {
        const dots = document.querySelectorAll('.slide-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
    }
    
    updateCounter() {
        document.getElementById('current-slide').textContent = this.currentSlide + 1;
        this.updateProgress();
    }
    
    updateProgress() {
        const progress = document.getElementById('progress-indicator');
        if (progress) {
            const percentage = ((this.currentSlide + 1) / this.totalSlides) * 100;
            progress.style.transform = `scaleX(${percentage / 100})`;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PitchDeck();
    });
} else {
    new PitchDeck();
}

