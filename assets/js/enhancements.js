// World-Class NM District Enhancements
class NMDistrictEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.createParticles();
    this.initNavigation();
    this.initFilterSystem();
    this.initSearch();
    this.initPriceRange();
    this.initScrollEffects();
    this.initThemeToggle();
    this.initAnimations();
  }

  // Create floating particles for hero section
  createParticles() {
    const particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) return;

    const particleCount = 50;
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particlesContainer.appendChild(particle);
    }
  }

  // Advanced navigation with scroll effects
  initNavigation() {
    const nav = document.querySelector('.floating-nav');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!nav || !navContainer) return;

    // Scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        navContainer.classList.add('scrolled');
      } else {
        navContainer.classList.remove('scrolled');
      }

      // Hide/show on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.style.transform = 'translateX(-50%) translateY(-100%)';
      } else {
        nav.style.transform = 'translateX(-50%) translateY(0)';
      }

      lastScrollY = currentScrollY;
    });

    // Active link highlighting
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  // Advanced filtering system
  initFilterSystem() {
    const filterToggle = document.getElementById('filterToggle');
    const filterContent = document.getElementById('filterContent');
    const filterChips = document.querySelectorAll('.filter-chip');

    if (!filterToggle || !filterContent) return;

    // Toggle filter content
    filterToggle.addEventListener('click', () => {
      filterContent.classList.toggle('collapsed');
      const isCollapsed = filterContent.classList.contains('collapsed');
      filterToggle.innerHTML = isCollapsed ? 
        '<span>⚙️</span><span>Advanced Filters</span>' : 
        '<span>🔽</span><span>Hide Filters</span>';
    });

    // Filter chip interactions
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Remove active from all chips in the same group
        const siblings = chip.parentElement.querySelectorAll('.filter-chip');
        siblings.forEach(sibling => sibling.classList.remove('active'));
        
        // Add active to clicked chip
        chip.classList.add('active');
        
        // Update results count
        this.updateFilterResults();
      });
    });
  }

  // Enhanced search functionality
  initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchClear = document.getElementById('searchClear');

    if (!searchInput) return;

    // Real-time search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });

    // Clear search
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        this.performSearch('');
        searchClear.style.display = 'none';
      });
    }

    // Show/hide clear button
    searchInput.addEventListener('input', () => {
      if (searchClear) {
        searchClear.style.display = searchInput.value ? 'flex' : 'none';
      }
    });
  }

  // Price range slider
  initPriceRange() {
    const thumbs = document.querySelectorAll('.price-range-thumb');
    const fill = document.querySelector('.price-range-fill');
    
    if (!thumbs.length || !fill) return;

    let isDragging = false;
    let currentThumb = null;

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        currentThumb = thumb;
        e.preventDefault();
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging || !currentThumb) return;

      const track = currentThumb.parentElement;
      const rect = track.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      
      currentThumb.style.left = percent + '%';
      this.updatePriceRange();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      currentThumb = null;
    });
  }

  updatePriceRange() {
    const thumbs = document.querySelectorAll('.price-range-thumb');
    const fill = document.querySelector('.price-range-fill');
    
    if (!thumbs.length || !fill) return;

    const left = parseFloat(thumbs[0].style.left);
    const right = parseFloat(thumbs[1].style.left);
    
    fill.style.left = Math.min(left, right) + '%';
    fill.style.width = Math.abs(right - left) + '%';
  }

  // Scroll animations
  initScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.event-card, .filter-section, .section').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });
  }

  // Theme toggle
  initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update icon
      themeToggle.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'light' ? '🌙' : '☀️';
  }

  // Advanced animations
  initAnimations() {
    // Staggered animations for cards
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('reveal-scale');
    });

    // Interactive 3D card effects
    const interactiveCard = document.querySelector('.hero-interactive-card');
    if (interactiveCard) {
      interactiveCard.addEventListener('mousemove', (e) => {
        const rect = interactiveCard.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        interactiveCard.style.transform = `translate(-50%, -50%) rotateX(${(y - 50) * 0.1}deg) rotateY(${(x - 50) * 0.1}deg)`;
      });

      interactiveCard.addEventListener('mouseleave', () => {
        interactiveCard.style.transform = 'translate(-50%, -50%) rotateX(0) rotateY(0)';
      });
    }
  }

  // Search functionality
  performSearch(query) {
    const cards = document.querySelectorAll('.event-card');
    const lowerQuery = query.toLowerCase();
    
    cards.forEach(card => {
      const title = card.querySelector('.event-card-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.event-card-description')?.textContent.toLowerCase() || '';
      
      if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
        card.style.display = 'block';
        card.classList.add('reveal-scale');
      } else {
        card.style.display = 'none';
      }
    });

    this.updateFilterResults();
  }

  // Update filter results count
  updateFilterResults() {
    const visibleCards = document.querySelectorAll('.event-card:not([style*="display: none"])');
    const statsNumber = document.querySelector('.filter-stats-number');
    
    if (statsNumber) {
      statsNumber.textContent = visibleCards.length;
    }
  }
}

// Initialize enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NMDistrictEnhancements();
});

// Performance optimization - Debounce function
function debounce(func, wait) {
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

// Smooth scroll for navigation links
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

// Loading states
window.addEventListener('load', () => {
  document.body.classList.add('is-ready');
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close modals or reset filters
    const filterContent = document.getElementById('filterContent');
    if (filterContent && !filterContent.classList.contains('collapsed')) {
      filterContent.classList.add('collapsed');
    }
  }
  
  // Focus trap for modals (if any)
  if (e.key === 'Tab') {
    const modal = document.querySelector('[role="dialog"]:not([hidden])');
    if (modal) {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  }
});
