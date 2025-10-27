/**
 * ConversionWing Marketing - Premium Futuristic Website JavaScript
 * Interactive 3D robot with mouse tracking, animations, and chatbot functionality
 */

class ConversionWingPremiumApp {
  constructor() {
    this.isLoaded = false;
    this.scrollY = 0;
    this.isMobile = window.innerWidth <= 768;
    this.chatbotOpen = false;
    this.parallaxElements = [];
    this.animationFrameId = null;
    this.mousePosition = { x: 0, y: 0 };
    this.robotElement = null;
    this.isMouseTracking = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initParallaxElements();
    this.initInteractiveRobot();
    this.initChatbot();
    this.initScrollAnimations();
    this.initHeaderScroll();
    this.initLazyLoading();
    this.initFeedbackForm();
    this.isLoaded = true;
    
    console.log('ConversionWing Premium App initialized successfully');
  }

  setupEventListeners() {
    // Scroll event with throttling for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Mouse movement for robot tracking
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    
    // Resize event
    window.addEventListener('resize', this.debounce(() => {
      this.isMobile = window.innerWidth <= 768;
      this.updateParallaxElements();
    }, 250));
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
    });
  }

  initInteractiveRobot() {
    this.robotElement = document.getElementById('interactive-robot');
    this.robotContainer = document.getElementById('robot-container');
    this.robotBubble = document.getElementById('robot-bubble');
    this.robotPosition = { x: 0, y: 0, z: 0 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.robotVelocity = { x: 0, y: 0 };
    this.robotBounce = 0;
    this.bubbleShown = false;
    
    if (this.robotElement) {
      // Mouse interactions for desktop
      if (!this.isMobile) {
        this.robotContainer.addEventListener('mouseenter', () => {
          this.isMouseTracking = true;
          this.robotElement.style.transition = 'transform 0.3s ease';
        });
        
        this.robotContainer.addEventListener('mouseleave', () => {
          this.isMouseTracking = false;
          this.robotElement.style.transition = 'transform 0.5s ease';
          this.resetRobotPosition();
        });
      }
      
      // Touch interactions for mobile and desktop
      this.robotElement.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      this.robotElement.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      this.robotElement.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
      
      // Mouse drag interactions
      this.robotElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.robotElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.robotElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.robotElement.addEventListener('mouseleave', this.handleMouseUp.bind(this));
      
      // Click/tap interaction
      this.robotElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.animateRobotClick();
        this.showRobotBubble();
      });
      
      // Show bubble on first hover
      this.robotContainer.addEventListener('mouseenter', () => {
        if (!this.bubbleShown) {
          setTimeout(() => {
            this.showRobotBubble();
          }, 1000);
        }
      });
      
      // Add playful hover effects
      this.robotElement.addEventListener('mouseenter', () => {
        this.robotElement.style.cursor = 'grab';
        this.robotElement.style.filter = 'drop-shadow(0 0 40px rgba(0, 255, 198, 0.8))';
      });
      
      this.robotElement.addEventListener('mouseleave', () => {
        this.robotElement.style.cursor = 'default';
        this.robotElement.style.filter = 'drop-shadow(0 0 30px rgba(0, 255, 198, 0.4))';
      });
      
      // Start continuous animation
      this.startRobotAnimation();
    }
  }

  handleMouseMove(e) {
    this.mousePosition.x = e.clientX;
    this.mousePosition.y = e.clientY;
    
    if (this.isMouseTracking && this.robotElement && !this.isMobile) {
      this.updateRobotPosition();
    }
  }

  // Touch interaction methods
  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.isDragging = true;
    this.dragStart.x = touch.clientX;
    this.dragStart.y = touch.clientY;
    this.robotElement.style.transition = 'none';
    this.robotElement.style.cursor = 'grabbing';
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.dragStart.x;
    const deltaY = touch.clientY - this.dragStart.y;
    
    // Update robot position with drag
    this.robotPosition.x = deltaX * 0.5; // Scale down movement
    this.robotPosition.y = deltaY * 0.5;
    
    // Add rotation based on movement
    const rotateX = deltaY * 0.1;
    const rotateY = deltaX * 0.1;
    
    this.updateRobotTransform();
    
    // Add velocity for bounce effect
    this.robotVelocity.x = deltaX * 0.01;
    this.robotVelocity.y = deltaY * 0.01;
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    
    this.isDragging = false;
    this.robotElement.style.transition = 'transform 0.5s ease';
    this.robotElement.style.cursor = 'grab';
    
    // Add bounce effect
    this.addBounceEffect();
    
    // Reset position gradually
    setTimeout(() => {
      this.resetRobotPosition();
    }, 1000);
  }

  // Mouse drag interaction methods
  handleMouseDown(e) {
    e.preventDefault();
    this.isDragging = true;
    this.dragStart.x = e.clientX;
    this.dragStart.y = e.clientY;
    this.robotElement.style.transition = 'none';
    this.robotElement.style.cursor = 'grabbing';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    
    const deltaX = e.clientX - this.dragStart.x;
    const deltaY = e.clientY - this.dragStart.y;
    
    // Update robot position with drag
    this.robotPosition.x = deltaX * 0.3;
    this.robotPosition.y = deltaY * 0.3;
    
    this.updateRobotTransform();
    
    // Add velocity for bounce effect
    this.robotVelocity.x = deltaX * 0.005;
    this.robotVelocity.y = deltaY * 0.005;
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    
    this.isDragging = false;
    this.robotElement.style.transition = 'transform 0.5s ease';
    this.robotElement.style.cursor = 'grab';
    
    // Add bounce effect
    this.addBounceEffect();
    
    // Reset position gradually
    setTimeout(() => {
      this.resetRobotPosition();
    }, 1000);
  }

  updateRobotPosition() {
    const rect = this.robotContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = this.mousePosition.x - centerX;
    const deltaY = this.mousePosition.y - centerY;
    
    // Calculate rotation based on mouse position
    const rotateX = (deltaY / rect.height) * 20; // Max 20 degrees
    const rotateY = (deltaX / rect.width) * 20;   // Max 20 degrees
    
    // Apply smooth rotation with slight floating
    const floatY = Math.sin(Date.now() * 0.001) * 5;
    
    this.robotElement.style.transform = `
      translateY(${floatY}px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;
  }

  updateRobotTransform() {
    const floatY = Math.sin(Date.now() * 0.001) * 5;
    const rotateX = this.robotPosition.y * 0.1;
    const rotateY = this.robotPosition.x * 0.1;
    const scale = this.isDragging ? 1.1 : 1.0;
    
    this.robotElement.style.transform = `
      translate3d(${this.robotPosition.x}px, ${this.robotPosition.y + floatY}px, ${this.robotPosition.z}px)
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      scale(${scale})
    `;
  }

  addBounceEffect() {
    // Add playful bounce animation
    this.robotBounce = 1;
    const bounceInterval = setInterval(() => {
      this.robotBounce *= 0.8;
      if (this.robotBounce < 0.1) {
        clearInterval(bounceInterval);
        this.robotBounce = 0;
      }
      
      const bounceY = Math.sin(this.robotBounce * Math.PI) * 20;
      this.robotPosition.y += bounceY;
      this.updateRobotTransform();
    }, 50);
  }

  resetRobotPosition() {
    this.robotPosition = { x: 0, y: 0, z: 0 };
    this.robotVelocity = { x: 0, y: 0 };
    this.robotBounce = 0;
    
    const floatY = Math.sin(Date.now() * 0.001) * 5;
    this.robotElement.style.transform = `
      translate3d(0px, ${floatY}px, 0px)
      rotateX(0deg) 
      rotateY(0deg)
      scale(1)
    `;
  }

  startRobotAnimation() {
    const animate = () => {
      if (!this.isDragging) {
        // Continuous floating animation
        const time = Date.now() * 0.001;
        const floatY = Math.sin(time) * 5;
        const floatX = Math.sin(time * 0.7) * 2;
        const rotateZ = Math.sin(time * 0.5) * 2;
        
        // Add subtle rotation
        const baseRotation = time * 0.1;
        
        this.robotElement.style.transform = `
          translate3d(${this.robotPosition.x + floatX}px, ${this.robotPosition.y + floatY}px, ${this.robotPosition.z}px)
          rotateX(${this.robotPosition.y * 0.1}deg) 
          rotateY(${this.robotPosition.x * 0.1 + baseRotation}deg)
          rotateZ(${rotateZ}deg)
          scale(${this.isDragging ? 1.1 : 1.0})
        `;
      }
      
      requestAnimationFrame(animate);
    };
    animate();
  }

  showRobotBubble() {
    if (this.robotBubble && !this.bubbleShown) {
      this.robotBubble.classList.add('show');
      this.bubbleShown = true;
      
      // Hide bubble after 4 seconds
      setTimeout(() => {
        this.robotBubble.classList.remove('show');
      }, 4000);
    }
  }

  animateRobotClick() {
    // Add click animation with scale and rotation
    const originalTransform = this.robotElement.style.transform;
    this.robotElement.style.transform += ' scale(1.2) rotateZ(10deg)';
    
    // Add wiggle effect
    this.robotElement.classList.add('wiggling');
    setTimeout(() => {
      this.robotElement.classList.remove('wiggling');
    }, 500);
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    
    setTimeout(() => {
      this.robotElement.style.transform = originalTransform;
    }, 300);
    
    // Trigger holographic effect
    this.triggerHolographicEffect();
    
    // Add particle effect
    this.createParticleEffect();
    
    // Show bubble
    this.showRobotBubble();
  }

  triggerHolographicEffect() {
    const hologramLines = document.querySelectorAll('.hero__hologram-line');
    hologramLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.animation = 'none';
        line.offsetHeight; // Trigger reflow
        line.style.animation = 'hologramScan 1s ease-in-out';
      }, index * 100);
    });
  }

  createParticleEffect() {
    // Create floating particles around the robot
    const particleCount = 8;
    const robotRect = this.robotElement.getBoundingClientRect();
    const centerX = robotRect.left + robotRect.width / 2;
    const centerY = robotRect.top + robotRect.height / 2;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #00FFC6;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${centerX}px;
        top: ${centerY}px;
        box-shadow: 0 0 10px #00FFC6;
      `;
      
      document.body.appendChild(particle);
      
      // Animate particle
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const duration = 1000 + Math.random() * 500;
      
      particle.animate([
        { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        { 
          transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).onfinish = () => {
        particle.remove();
      };
    }
  }

  initParallaxElements() {
    this.parallaxElements = [
      {
        element: document.querySelector('.hero__parallax-bg'),
        speed: 0.5,
        offset: 0
      },
      {
        element: document.querySelector('.hero__robot-glow'),
        speed: 0.3,
        offset: 0
      }
    ].filter(item => item.element);
  }

  updateParallaxElements() {
    // Update parallax elements based on screen size
    this.parallaxElements.forEach(item => {
      if (this.isMobile) {
        item.element.style.transform = 'none';
      }
    });
  }

  handleScroll() {
    this.scrollY = window.scrollY;
    
    if (!this.isMobile) {
      this.updateParallax();
    }
    
    this.updateHeaderScroll();
    this.updateScrollAnimations();
  }

  updateParallax() {
    this.parallaxElements.forEach(item => {
      if (item.element) {
        const yPos = -(this.scrollY * item.speed);
        item.element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
  }

  initScrollAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Add staggered animation for cards
          if (entry.target.classList.contains('service-card') || 
              entry.target.classList.contains('use-case-card')) {
            const cards = entry.target.parentElement.children;
            Array.from(cards).forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-in');
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .benefit-item, .use-case-card, .testimonial-card, .step').forEach(el => {
      this.scrollObserver.observe(el);
    });
  }

  updateScrollAnimations() {
    // 3D tilt effect for service cards
    document.querySelectorAll('.service-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible && !this.isMobile) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = this.mousePosition.x;
        const mouseY = this.mousePosition.y;
        
        const rotateX = (mouseY - centerY) / 20;
        const rotateY = (centerX - mouseX) / 20;
        
        // Only apply if mouse is over the card
        if (Math.abs(rotateX) < 20 && Math.abs(rotateY) < 20) {
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        }
      }
    });
  }

  initHeaderScroll() {
    this.header = document.querySelector('.header');
  }

  updateHeaderScroll() {
    if (this.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  initChatbot() {
    this.chatbotWidget = document.getElementById('chatbot-widget');
    this.chatbotAvatar = document.getElementById('chatbot-avatar');
    this.chatbotWindow = document.getElementById('chatbot-window');
    this.chatbotClose = document.getElementById('chatbot-close');
    this.chatbotInput = document.getElementById('chatbot-input');
    this.chatbotSend = document.getElementById('chatbot-send');
    this.chatbotMessages = document.getElementById('chatbot-messages');

    if (this.chatbotAvatar) {
      this.chatbotAvatar.addEventListener('click', this.toggleChatbot.bind(this));
    }

    if (this.chatbotClose) {
      this.chatbotClose.addEventListener('click', this.closeChatbot.bind(this));
    }

    if (this.chatbotSend) {
      this.chatbotSend.addEventListener('click', this.sendMessage.bind(this));
    }

    if (this.chatbotInput) {
      this.chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }

    // Enhanced chatbot responses for AI automation
    this.chatbotResponses = {
      'hello': 'Hi! I\'m your ConversionWing AI assistant. I can help you automate your business operations. What would you like to know about our AI voice bots and automation services?',
      'price': 'Our AI voice bots start at ₹25K setup with no monthly fees for basic automation. For advanced n8n workflows, we offer custom pricing. Would you like to schedule a demo to see pricing for your specific needs?',
      'demo': 'Great! I can help you schedule a free demo. Our team will show you how our AI voice bots can automate your calls, bookings, and customer service. When would be a good time for a 30-minute demo?',
      'features': 'Our AI voice bots offer: 24/7 availability, 99% accuracy, instant scaling, n8n workflow integration, and natural conversation flow. They can handle calls, bookings, inquiries, and follow-ups automatically.',
      'cost': 'Most businesses save 80-90% compared to hiring staff. Our AI agents cost ₹25K setup vs ₹2.5L/month for traditional staff. Plus, they work 24/7 and never take breaks!',
      'automation': 'We specialize in n8n workflow automation, AI voice bots, social media automation, and custom AI agents. Our solutions integrate seamlessly with your existing systems.',
      'voice bot': 'Our AI voice bots can answer calls, take bookings, handle inquiries, and provide customer support 24/7. They sound natural and can be customized for your business needs.',
      'n8n': 'We use n8n to build powerful automation workflows that connect all your business tools. This allows for seamless data flow and automated processes across your entire operation.',
      'default': 'I\'d be happy to help! You can ask me about pricing, features, scheduling a demo, voice bots, automation, or how our AI solutions can benefit your specific business.'
    };
  }

  toggleChatbot() {
    if (this.chatbotOpen) {
      this.closeChatbot();
    } else {
      this.openChatbot();
    }
  }

  openChatbot() {
    this.chatbotWindow.classList.add('active');
    this.chatbotOpen = true;
    this.chatbotInput.focus();
    
    // Add opening animation
    this.chatbotWindow.style.transform = 'translateY(20px) scale(0.9)';
    this.chatbotWindow.style.opacity = '0';
    
    requestAnimationFrame(() => {
      this.chatbotWindow.style.transition = 'all 0.3s ease';
      this.chatbotWindow.style.transform = 'translateY(0) scale(1)';
      this.chatbotWindow.style.opacity = '1';
    });
  }

  closeChatbot() {
    this.chatbotWindow.style.transition = 'all 0.3s ease';
    this.chatbotWindow.style.transform = 'translateY(20px) scale(0.9)';
    this.chatbotWindow.style.opacity = '0';
    
    setTimeout(() => {
      this.chatbotWindow.classList.remove('active');
      this.chatbotOpen = false;
    }, 300);
  }

  sendMessage() {
    const message = this.chatbotInput.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    this.chatbotInput.value = '';

    // Simulate typing delay
    setTimeout(() => {
      const response = this.getChatbotResponse(message);
      this.addMessage(response, 'bot');
    }, 1000);
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message chatbot-message--${sender}`;
    
    if (sender === 'bot') {
      messageDiv.innerHTML = `
        <div class="chatbot-message__avatar">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" fill="#00FFC6"/>
            <circle cx="7" cy="8" r="1" fill="#0D1121"/>
            <circle cx="13" cy="8" r="1" fill="#0D1121"/>
            <path d="M6 12 Q10 15 14 12" stroke="#0D1121" stroke-width="1" fill="none"/>
          </svg>
        </div>
        <div class="chatbot-message__content">
          <div class="chatbot-message__text">${text}</div>
          <div class="chatbot-message__time">Just now</div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="chatbot-message__content chatbot-message__content--user">
          <div class="chatbot-message__text chatbot-message__text--user">${text}</div>
          <div class="chatbot-message__time">Just now</div>
        </div>
      `;
    }
    
    this.chatbotMessages.appendChild(messageDiv);
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
  }

  getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [keyword, response] of Object.entries(this.chatbotResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return this.chatbotResponses.default;
  }

  initLazyLoading() {
    // Lazy load 3D models and heavy assets
    if ('IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadLazyContent(entry.target);
            lazyObserver.unobserve(entry.target);
          }
        });
      });

      // Observe elements that need lazy loading
      document.querySelectorAll('[data-lazy]').forEach(el => {
        lazyObserver.observe(el);
      });
    }
  }

  loadLazyContent(element) {
    const lazyType = element.dataset.lazy;
    
    switch (lazyType) {
      case '3d-model':
        this.load3DModel(element);
        break;
      case 'image':
        this.loadImage(element);
        break;
      default:
        console.warn('Unknown lazy loading type:', lazyType);
    }
  }

  load3DModel(element) {
    // Placeholder for 3D model loading
    // In a real implementation, you would load Three.js models here
    console.log('Loading 3D model for:', element);
    
    // For now, we'll use the SVG fallback
    element.classList.add('loaded');
  }

  loadImage(element) {
    const src = element.dataset.src;
    if (src) {
      element.src = src;
      element.classList.add('loaded');
    }
  }

  // Utility functions
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

  // Performance monitoring
  monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
      });
    }
  }

  initFeedbackForm() {
    const feedbackForm = document.getElementById('rate-review-form');
    const feedbackMessage = document.getElementById('feedback-message');
    
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const name = formData.get('name').trim();
        const rating = formData.get('rating');
        const feedback = formData.get('feedback').trim();
        
        // Validation
        if (!name || name.length < 2) {
          this.showFeedbackMessage('Please enter a valid name (at least 2 characters).', 'error');
          return;
        }
        
        if (!rating) {
          this.showFeedbackMessage('Please select a rating.', 'error');
          return;
        }
        
        if (!feedback || feedback.length < 10) {
          this.showFeedbackMessage('Please write at least 10 characters for your feedback.', 'error');
          return;
        }
        
        // Add review to the testimonials section
        this.addReviewToPage(name, rating, feedback);
        
        // Send email notification
        this.sendReviewEmail(name, rating, feedback);
        
        // Show success message
        this.showFeedbackMessage('Thank you for your review! It has been added to our testimonials.', 'success');
        
        // Clear form
        feedbackForm.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
          this.hideFeedbackMessage();
        }, 5000);
      });
    }
  }

  addReviewToPage(name, rating, feedback) {
    const testimonialsGrid = document.querySelector('.testimonials__carousel');
    if (!testimonialsGrid) return;
    
    // Create new testimonial card
    const newReview = document.createElement('div');
    newReview.className = 'testimonial-card';
    newReview.innerHTML = `
      <div class="testimonial-card__avatar">👤</div>
      <div class="testimonial-card__content">
        <p class="testimonial-card__text">"${feedback}"</p>
        <div class="testimonial-card__rating">${'⭐'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
        <div class="testimonial-card__author">— ${name}</div>
      </div>
    `;
    
    // Add animation class
    newReview.style.opacity = '0';
    newReview.style.transform = 'translateY(30px)';
    
    // Insert at the beginning
    testimonialsGrid.insertBefore(newReview, testimonialsGrid.firstChild);
    
    // Animate in
    setTimeout(() => {
      newReview.style.transition = 'all 0.6s ease';
      newReview.style.opacity = '1';
      newReview.style.transform = 'translateY(0)';
    }, 100);
  }

  sendReviewEmail(name, rating, feedback) {
    // Create email content
    const emailSubject = `New Review from ${name} - ConversionWing Website`;
    const emailBody = `
New review submitted on ConversionWing website:

Name: ${name}
Rating: ${rating}/5 stars
Feedback: ${feedback}

Submitted on: ${new Date().toLocaleString()}
    `;
    
    // Create mailto link
    const mailtoLink = `mailto:contact@conversionwingmarketing.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    // Also log to console for development
    console.log('Review submitted:', { name, rating, feedback });
  }

  showFeedbackMessage(text, type) {
    const feedbackMessage = document.getElementById('feedback-message');
    if (feedbackMessage) {
      feedbackMessage.textContent = text;
      feedbackMessage.className = `testimonials__feedback-message ${type} show`;
    }
  }

  hideFeedbackMessage() {
    const feedbackMessage = document.getElementById('feedback-message');
    if (feedbackMessage) {
      feedbackMessage.classList.remove('show');
    }
  }

  // Cleanup
  destroy() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.debounce);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
}

// Additional CSS for animations
const additionalStyles = `
  .service-card,
  .benefit-item,
  .use-case-card,
  .testimonial-card,
  .step {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .service-card.animate-in,
  .benefit-item.animate-in,
  .use-case-card.animate-in,
  .testimonial-card.animate-in,
  .step.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .chatbot-message--user .chatbot-message__content {
    margin-left: auto;
    max-width: 80%;
  }
  
  .chatbot-message--user .chatbot-message__text {
    background: rgba(0, 255, 198, 0.2);
    color: var(--color-white);
  }
  
  .chatbot-message--user .chatbot-message__text--user {
    background: rgba(0, 255, 198, 0.2);
    color: var(--color-white);
  }
  
  [data-lazy] {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  [data-lazy].loaded {
    opacity: 1;
  }
  
  /* Enhanced hover effects */
  .service-card:hover .service-card__icon {
    transform: scale(1.1) rotate(5deg);
  }
  
  .use-case-card:hover .use-case-card__icon {
    transform: scale(1.2);
  }
  
  .testimonial-card:hover .testimonial-card__avatar {
    transform: scale(1.1);
  }
  
  /* Smooth transitions for all interactive elements */
  .service-card,
  .benefit-item,
  .use-case-card,
  .testimonial-card,
  .step,
  .footer__social-link {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Interactive robot enhancements */
  .hero__robot {
    transition: transform 0.3s ease;
  }
  
  .hero__robot:hover {
    filter: drop-shadow(0 0 40px rgba(0, 255, 198, 0.6));
  }
  
  /* Floating orbs for services section */
  .services::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(0, 255, 198, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    animation: floatOrb 8s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes floatOrb {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
    }
    25% {
      transform: translateY(-20px) translateX(10px);
    }
    50% {
      transform: translateY(-10px) translateX(-10px);
    }
    75% {
      transform: translateY(-30px) translateX(5px);
    }
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.conversionWingApp = new ConversionWingPremiumApp();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    if (window.conversionWingApp) {
      window.conversionWingApp.pauseAnimations();
    }
  } else {
    // Resume animations when page is visible
    if (window.conversionWingApp) {
      window.conversionWingApp.resumeAnimations();
    }
  }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConversionWingPremiumApp;
}