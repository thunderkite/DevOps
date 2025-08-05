// DevOps Guide Interactive JavaScript

class DevOpsGuide {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupProgressBar();
        this.setupSearch();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupInteractiveDiagrams();
        this.setupCodeHighlighting();
        this.setupMobileMenu();
        this.setupKeyboardNavigation();
        this.setupLazyLoading();
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
            
            // Add theme transition animation
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Navigation and Active Section Tracking
    setupNavigation() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.toc a');
        
        // Create intersection observer for active section tracking
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.id;
                    this.updateActiveNavLink(activeId);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        // Add click handlers to nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                }
                
                // Close mobile menu if open
                this.closeMobileMenu();
            });
        });
    }

    updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('.toc a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkId = link.getAttribute('href').substring(1);
            
            if (linkId === activeId) {
                link.classList.add('active');
            }
        });
    }

    scrollToSection(target) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Progress Bar
    setupProgressBar() {
        const progressBar = document.getElementById('progressBar');
        
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        });
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const mainContent = document.getElementById('mainContent');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    this.performSearch(query);
                } else {
                    this.clearSearchHighlights();
                }
            }, 300);
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                this.clearSearchHighlights();
                searchInput.blur();
            }
        });
    }

    performSearch(query) {
        this.clearSearchHighlights();
        
        const searchRegex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        const walker = document.createTreeWalker(
            document.getElementById('mainContent'),
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const parent = node.parentElement;
                    return parent.tagName !== 'SCRIPT' && 
                           parent.tagName !== 'STYLE' && 
                           !parent.classList.contains('search-highlight')
                        ? NodeFilter.FILTER_ACCEPT 
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            if (searchRegex.test(node.textContent)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const highlightedContent = textNode.textContent.replace(
                searchRegex, 
                '<span class="search-highlight">$1</span>'
            );
            
            if (highlightedContent !== textNode.textContent) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = highlightedContent;
                
                while (wrapper.firstChild) {
                    textNode.parentNode.insertBefore(wrapper.firstChild, textNode);
                }
                
                textNode.parentNode.removeChild(textNode);
            }
        });

        // Scroll to first result
        const firstHighlight = document.querySelector('.search-highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    clearSearchHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Smooth Scrolling Enhancement
    setupSmoothScrolling() {
        // Add smooth scrolling to all internal links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToSection(targetElement);
                }
            }
        });
    }

    // Animation and Intersection Observers
    setupAnimations() {
        // Animate cards on scroll
        const cards = document.querySelectorAll('.card, .term-card, .component-card, .beneficiary-card');
        
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            animateOnScroll.observe(card);
        });

        // Animate timeline items
        const timelineItems = document.querySelectorAll('.timeline-item, .evolution-item');
        
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(item);
        });
    }

    // Interactive Diagrams
    setupInteractiveDiagrams() {
        // Docker Architecture Flow
        this.setupDockerArchitectureDiagram();
        
        // Kubernetes Components
        this.setupKubernetesComponentsDiagram();
        
        // OverlayFS Layer Visualization
        this.setupOverlayFSDiagram();
        
        // Network Types Interaction
        this.setupNetworkTypesInteraction();
    }

    setupDockerArchitectureDiagram() {
        const archComponents = document.querySelectorAll('.arch-component');
        
        archComponents.forEach((component, index) => {
            component.addEventListener('mouseenter', () => {
                // Highlight the flow
                archComponents.forEach((comp, i) => {
                    if (i <= index) {
                        comp.style.opacity = '1';
                        comp.style.transform = 'scale(1.05)';
                    } else {
                        comp.style.opacity = '0.5';
                    }
                });
            });

            component.addEventListener('mouseleave', () => {
                archComponents.forEach(comp => {
                    comp.style.opacity = '1';
                    comp.style.transform = 'scale(1)';
                });
            });

            // Add click for detailed info
            component.addEventListener('click', () => {
                this.showComponentDetails(component);
            });
        });
    }

    setupKubernetesComponentsDiagram() {
        const k8sComponents = document.querySelectorAll('.component-card');
        
        k8sComponents.forEach(component => {
            component.addEventListener('click', () => {
                component.classList.toggle('expanded');
                
                // Create or toggle detailed view
                let details = component.querySelector('.component-details');
                if (!details) {
                    details = this.createComponentDetails(component);
                    component.appendChild(details);
                } else {
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                }
            });
        });
    }

    setupOverlayFSDiagram() {
        const layers = document.querySelectorAll('.layer');
        
        layers.forEach(layer => {
            layer.addEventListener('mouseenter', () => {
                layer.style.transform = 'scale(1.02)';
                layer.style.boxShadow = '0 8px 25px var(--shadow-medium)';
                
                // Show layer description
                this.showLayerTooltip(layer);
            });

            layer.addEventListener('mouseleave', () => {
                layer.style.transform = 'scale(1)';
                layer.style.boxShadow = '';
                this.hideLayerTooltip();
            });
        });
    }

    setupNetworkTypesInteraction() {
        const networkTypes = document.querySelectorAll('.network-type');
        
        networkTypes.forEach(networkType => {
            const header = networkType.querySelector('h3');
            
            header.addEventListener('click', () => {
                networkType.classList.toggle('expanded');
                
                const details = networkType.querySelector('.network-details');
                if (details) {
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                }
            });
        });
    }

    showComponentDetails(component) {
        // Create modal or tooltip with component details
        const componentName = component.querySelector('span').textContent;
        const details = this.getComponentDetails(componentName);
        
        if (details) {
            this.showTooltip(component, details);
        }
    }

    getComponentDetails(componentName) {
        const details = {
            'Docker CLI': 'Интерфейс командной строки для взаимодействия с Docker Daemon. Пользователь вводит команды docker run, docker build и т.д.',
            'dockerd': 'Фоновый процесс, работающий на хосте. Отвечает за создание, запуск и управление Docker-объектами.',
            'containerd': 'Высокоуровневый демон, управляющий жизненным циклом контейнеров на хосте.',
            'shim': 'Процесс-посредник между containerd и запущенным контейнером.',
            'runc': 'Легковесная утилита для запуска контейнеров в соответствии со спецификацией OCI.',
            'контейнер': 'Изолированный процесс, запущенный в namespace и ограниченный cgroups.'
        };
        
        return details[componentName] || null;
    }

    showTooltip(element, content) {
        // Remove existing tooltips
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.innerHTML = content;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            box-shadow: 0 8px 25px var(--shadow-medium);
            max-width: 300px;
            z-index: 1000;
            font-size: 0.9rem;
            line-height: 1.4;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.bottom + 10}px`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => this.hideTooltip(), 5000);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.custom-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    showLayerTooltip(layer) {
        const layerName = layer.querySelector('span').textContent;
        const description = layer.querySelector('small')?.textContent || '';
        
        if (description) {
            this.showTooltip(layer, `<strong>${layerName}</strong><br>${description}`);
        }
    }

    hideLayerTooltip() {
        this.hideTooltip();
    }

    createComponentDetails(component) {
        const details = document.createElement('div');
        details.className = 'component-details';
        details.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            background: var(--bg-primary);
            border-radius: 6px;
            border: 1px solid var(--border-color);
            font-size: 0.9rem;
            line-height: 1.4;
        `;
        
        const componentName = component.querySelector('h4').textContent;
        const detailText = this.getComponentDetails(componentName) || 'Дополнительная информация недоступна.';
        
        details.innerHTML = detailText;
        return details;
    }

    // Code Highlighting Enhancement
    setupCodeHighlighting() {
        // Add copy buttons to code blocks
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(codeBlock => {
            const pre = codeBlock.parentElement;
            const copyButton = this.createCopyButton();
            
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
            
            copyButton.addEventListener('click', () => {
                this.copyToClipboard(codeBlock.textContent);
                this.showCopyFeedback(copyButton);
            });
        });

        // Add line numbers to longer code blocks
        codeBlocks.forEach(codeBlock => {
            const lines = codeBlock.textContent.split('\n').length;
            if (lines > 5) {
                this.addLineNumbers(codeBlock);
            }
        });
    }

    createCopyButton() {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.className = 'copy-button';
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--accent-primary);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0.5rem;
            cursor: pointer;
            font-size: 0.8rem;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.opacity = '0.7';
        });
        
        return button;
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = 'var(--accent-success)';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = 'var(--accent-primary)';
        }, 1500);
    }

    addLineNumbers(codeBlock) {
        const lines = codeBlock.textContent.split('\n');
        const lineNumbers = lines.map((_, index) => index + 1).join('\n');
        
        const lineNumbersElement = document.createElement('div');
        lineNumbersElement.className = 'line-numbers';
        lineNumbersElement.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3rem;
            background: var(--bg-tertiary);
            border-right: 1px solid var(--border-color);
            padding: 1.5rem 0.5rem;
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 0.8rem;
            line-height: 1.4;
            color: var(--text-muted);
            text-align: right;
            user-select: none;
        `;
        
        lineNumbersElement.textContent = lineNumbers;
        
        const pre = codeBlock.parentElement;
        pre.style.paddingLeft = '4rem';
        pre.appendChild(lineNumbersElement);
    }

    // Mobile Menu
    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        navToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            navToggle.classList.toggle('active');
            
            // Animate hamburger menu
            this.animateHamburgerMenu(navToggle);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const navToggle = document.getElementById('navToggle');
        
        sidebar.classList.remove('open');
        navToggle.classList.remove('active');
        this.animateHamburgerMenu(navToggle, false);
    }

    animateHamburgerMenu(toggle, isOpen = null) {
        const spans = toggle.querySelectorAll('span');
        const shouldOpen = isOpen !== null ? isOpen : toggle.classList.contains('active');
        
        if (shouldOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Navigation shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        document.getElementById('searchInput').focus();
                        break;
                    case 'k':
                        e.preventDefault();
                        document.getElementById('searchInput').focus();
                        break;
                }
            }
            
            // Section navigation with arrow keys
            if (e.altKey) {
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.navigateToSection('previous');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.navigateToSection('next');
                        break;
                }
            }
        });
    }

    navigateToSection(direction) {
        const sections = Array.from(document.querySelectorAll('.content-section'));
        const currentSection = this.getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        
        let targetIndex;
        if (direction === 'next') {
            targetIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else {
            targetIndex = Math.max(currentIndex - 1, 0);
        }
        
        if (targetIndex !== currentIndex) {
            this.scrollToSection(sections[targetIndex]);
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('.content-section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            if (sections[i].offsetTop <= scrollPosition) {
                return sections[i];
            }
        }
        
        return sections[0];
    }

    // Lazy Loading for Performance
    setupLazyLoading() {
        // Lazy load images (if any are added later)
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
        
        // Lazy load complex animations
        this.setupLazyAnimations();
    }

    setupLazyAnimations() {
        const heavyAnimationElements = document.querySelectorAll('.architecture-diagram, .overlayfs-diagram');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-loaded');
                }
            });
        }, { threshold: 0.1 });
        
        heavyAnimationElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    // Utility Methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance Monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                // Log to analytics or monitoring service if needed
                this.logPerformanceMetric('page_load_time', loadTime);
            });
        }
    }

    logPerformanceMetric(metric, value) {
        // Placeholder for analytics integration
        console.log(`Performance metric - ${metric}: ${value}`);
    }

    // Error Handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            // Log to error reporting service if needed
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // Log to error reporting service if needed
        });
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Add skip links
        this.addSkipLinks();
        
        // Enhance focus management
        this.enhanceFocusManagement();
        
        // Add ARIA labels where needed
        this.addAriaLabels();
        
        // Setup reduced motion preferences
        this.setupReducedMotion();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#mainContent';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Перейти к основному содержимому';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--accent-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceFocusManagement() {
        // Trap focus in mobile menu when open
        const sidebar = document.getElementById('sidebar');
        const focusableElements = sidebar.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
        
        sidebar.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && sidebar.classList.contains('open')) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    addAriaLabels() {
        // Add aria-labels to interactive elements
        const copyButtons = document.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.setAttribute('aria-label', 'Копировать код');
        });
        
        // Add aria-expanded to collapsible elements
        const collapsibleElements = document.querySelectorAll('.network-type h3, .component-card');
        collapsibleElements.forEach(element => {
            element.setAttribute('aria-expanded', 'false');
            element.addEventListener('click', () => {
                const isExpanded = element.getAttribute('aria-expanded') === 'true';
                element.setAttribute('aria-expanded', !isExpanded);
            });
        });
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
                document.documentElement.style.setProperty('--transition-duration', '0.01ms');
            } else {
                document.documentElement.style.removeProperty('--animation-duration');
                document.documentElement.style.removeProperty('--transition-duration');
            }
        });
    }
}

// Initialize the DevOps Guide when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const guide = new DevOpsGuide();
    
    // Make guide instance globally available for debugging
    window.devopsGuide = guide;
    
    // Setup performance monitoring
    guide.measurePerformance();
    
    // Setup error handling
    guide.setupErrorHandling();
    
    // Setup accessibility enhancements
    guide.setupAccessibility();
});

// Service Worker Registration (for offline support if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}