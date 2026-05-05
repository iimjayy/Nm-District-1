// Premium Interactive Effects for World-Class NM District
class PremiumInteractions {
  constructor() {
    this.cursorGlow = null;
    this.cursorTrail = null;
    this.magneticElements = [];
    this.particleSystem = null;
    this.init();
  }

  init() {
    this.initCursorEffects();
    this.initMagneticInteractions();
    this.initParticleSystem();
    this.init3DCards();
    this.initScrollAnimations();
    this.initPremiumAnimations();
    this.initInteractiveElements();
  }

  // Premium Cursor Effects
  initCursorEffects() {
    // Create cursor glow
    this.cursorGlow = document.createElement('div');
    this.cursorGlow.className = 'cursor-glow';
    document.body.appendChild(this.cursorGlow);

    // Create cursor trail
    this.cursorTrail = document.createElement('div');
    this.cursorTrail.className = 'cursor-trail';
    document.body.appendChild(this.cursorTrail);

    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
      this.updateCursorPosition(e.clientX, e.clientY);
    });

    // Mouse enter/leave for interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.btn, .event-card, .nav-link, .filter-chip')) {
        this.cursorGlow.classList.add('active');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.btn, .event-card, .nav-link, .filter-chip')) {
        this.cursorGlow.classList.remove('active');
      }
    });

    // Hide cursor on mobile
    if ('ontouchstart' in window) {
      this.cursorGlow.style.display = 'none';
      this.cursorTrail.style.display = 'none';
    }
  }

  updateCursorPosition(x, y) {
    this.cursorGlow.style.left = x + 'px';
    this.cursorGlow.style.top = y + 'px';

    // Trail effect with delay
    setTimeout(() => {
      this.cursorTrail.style.left = x + 'px';
      this.cursorTrail.style.top = y + 'px';
    }, 50);
  }

  // Magnetic Interactions
  initMagneticInteractions() {
    this.magneticElements = document.querySelectorAll('.magnetic-target, .btn, .event-card, .nav-link');
    
    this.magneticElements.forEach(element => {
      this.addMagneticEffect(element);
    });
  }

  addMagneticEffect(element) {
    const magneticEffect = document.createElement('div');
    magneticEffect.className = 'magnetic-effect';
    element.appendChild(magneticEffect);

    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) * 0.2;
      const deltaY = (y - centerY) * 0.2;
      
      element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0, 0) scale(1)';
    });
  }

  // Advanced Particle System
  initParticleSystem() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    this.particleSystem = document.createElement('div');
    this.particleSystem.className = 'particle-system';
    hero.appendChild(this.particleSystem);

    this.createParticles();
    this.createParticleNetwork();
  }

  createParticles() {
    const particleCount = 60;
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
      
      this.particleSystem.appendChild(particle);
    }
  }

  createParticleNetwork() {
    const networkContainer = document.createElement('div');
    networkContainer.style.position = 'absolute';
    networkContainer.style.inset = '0';
    networkContainer.style.pointerEvents = 'none';
    
    const nodes = [];
    const nodeCount = 8;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement('div');
      node.className = 'particle-network';
      node.style.left = Math.random() * 100 + '%';
      node.style.top = Math.random() * 100 + '%';
      networkContainer.appendChild(node);
      nodes.push(node);
    }

    // Create connections
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() > 0.6) {
          const connection = document.createElement('div');
          connection.className = 'particle-connection';
          
          const node1 = nodes[i].getBoundingClientRect();
          const node2 = nodes[j].getBoundingClientRect();
          
          const distance = Math.sqrt(
            Math.pow(node2.left - node1.left, 2) + 
            Math.pow(node2.top - node1.top, 2)
          );
          
          if (distance < 300) {
            connection.style.width = distance + 'px';
            connection.style.left = node1.left + 'px';
            connection.style.top = node1.top + 'px';
            
            const angle = Math.atan2(
              node2.top - node1.top,
              node2.left - node1.left
            ) * 180 / Math.PI;
            
            connection.style.transform = `rotate(${angle}deg)`;
            networkContainer.appendChild(connection);
          }
        }
      }
    }

    this.particleSystem.appendChild(networkContainer);
  }

  // 3D Card Transformations
  init3DCards() {
    const cards = document.querySelectorAll('.event-card, .hero-interactive-card');
    
    cards.forEach(card => {
      card.classList.add('transform-3d');
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 15;
        const rotateX = -((y - centerY) / centerY) * 15;
        
        card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(20px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
      });
    });
  }

  // Advanced Scroll Animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.event-card, .filter-section, .section, .hero-stat').forEach(el => {
      observer.observe(el);
    });
  }

  animateElement(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100);
  }

  // Premium Animations
  initPremiumAnimations() {
    // Animated gradient backgrounds
    const gradientElements = document.querySelectorAll('.btn-primary, .hero-title');
    gradientElements.forEach(el => {
      el.classList.add('gradient-animated');
    });

    // Text reveal animations
    const textElements = document.querySelectorAll('.hero-title, .hero-subtitle');
    textElements.forEach((el, index) => {
      el.classList.add('text-reveal');
      el.style.animationDelay = `${index * 0.2}s`;
    });

    // Glow effects
    const glowElements = document.querySelectorAll('.hero-stat-number');
    glowElements.forEach(el => {
      el.classList.add('text-glow');
    });
  }

  // Interactive Elements
  initInteractiveElements() {
    // Ripple effect on buttons
    document.querySelectorAll('.btn').forEach(button => {
      this.addRippleEffect(button);
    });

    // Parallax effect on hero
    this.initParallaxEffect();

    // Smooth scroll for navigation
    this.initSmoothScroll();

    // Dynamic theme switching
    this.initDynamicTheme();
  }

  addRippleEffect(button) {
    button.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.width = ripple.style.height = '20px';
      ripple.style.top = (e.clientY - button.offsetTop - 10) + 'px';
      ripple.style.left = (e.clientX - button.offsetLeft - 10) + 'px';
      ripple.style.animation = 'ripple 0.6s ease-out';
      ripple.style.pointerEvents = 'none';
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (!hero || !heroBackground) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      
      heroBackground.style.transform = `translateY(${parallax}px)`;
    });
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initDynamicTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Add transition effect
      document.body.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    });
  }
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      width: 100px;
      height: 100px;
      margin-left: -50px;
      margin-top: -50px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize premium interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PremiumInteractions();
});

// Performance optimization
window.addEventListener('load', () => {
  document.body.classList.add('is-ready');
  
  // Remove loading states
  const loadingElements = document.querySelectorAll('.loading-skeleton, .loading-pulse');
  loadingElements.forEach(el => {
    el.classList.remove('loading-skeleton', 'loading-pulse');
  });
});

// Keyboard navigation enhancements
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});
