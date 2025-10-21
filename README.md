# ConversionWing Marketing - Premium Futuristic Website

A cutting-edge, high-conversion marketing website for ConversionWing Marketing's AI automation and voice bot services. Features premium 3D animations, interactive robot with mouse tracking, futuristic design, and live AI chatbot integration.

## 🚀 Features

- **Interactive 3D Robot**: Mouse-tracking robot that rotates and tilts toward cursor
- **Premium Hero Section**: "Automate Everything. Grow Effortlessly." with reduced padding
- **6 Glassmorphism Service Cards**: Neon glow effects with 3D hover animations
- **3D AI Brain Visualization**: Animated neural network with floating data points
- **6 Use Case Cards**: Industry-specific automation solutions
- **n8n-Style Workflow**: Step-by-step process with animated connecting lines
- **Live AI Chatbot**: Fully functional chatbot with business-specific responses
- **Auto-Scroll Testimonials**: Client reviews with floating card effects
- **Pulsing CTA**: Final call-to-action with animated glow effects
- **Dark Theme**: Consistent navy-to-teal gradient throughout (NO white backgrounds)
- **Mobile Optimized**: Responsive design with touch-friendly interactions

## 📁 File Structure

```
conversion-wing/
├── index.html          # Complete HTML structure
├── css/
│   └── style.css      # Premium CSS with 3D effects
├── js/
│   └── main.js        # Interactive functionality
├── assets/             # 3D models and images (create this folder)
│   ├── models/         # 3D model files (.glb, .gltf)
│   └── images/         # Static images
└── README.md           # This file
```

## 🎨 Design System

### Color Palette
- **Primary Navy**: `#030616` - Main background
- **Navy Light**: `#021a2d` - Gradient accent
- **Navy Accent**: `#052a3d` - Additional gradient
- **Accent Teal**: `#00FFC6` - CTAs and highlights
- **Teal Dark**: `#00E5C0` - Hover states
- **White**: `#FFFFFF` - Headings and primary text
- **Light Grey**: `#F5F6FA` - Secondary text

### Typography
- **Headings**: Outfit (600-700 weight) - Google Fonts
- **Body**: Manrope (400-500 weight) - Google Fonts
- **H1**: 64px (clamped for responsive)
- **H2**: 48px (clamped for responsive)
- **H3**: 24px
- **Body**: 18px
- **Small**: 14px

## 🔧 Integration Guide

### 1. Basic Setup

1. **Upload Files**: Place all files in your web server directory
2. **Update Links**: Modify Typeform links in `index.html` to your actual forms
3. **Test Responsiveness**: Check on mobile and desktop devices

### 2. Interactive 3D Robot Features

The robot includes advanced mouse tracking:

#### Mouse Tracking
- **Hover Detection**: Robot activates when mouse enters the container
- **Rotation**: Robot tilts toward cursor position (max 20 degrees)
- **Floating Animation**: Continuous subtle floating motion
- **Click Interaction**: Click triggers holographic scan effect
- **Smooth Transitions**: 0.3s ease transitions for natural movement

#### Customization Options
```javascript
// Adjust rotation sensitivity
const rotateX = (deltaY / rect.height) * 20; // Max 20 degrees
const rotateY = (deltaX / rect.width) * 20;   // Max 20 degrees

// Modify floating animation
const floatY = Math.sin(Date.now() * 0.001) * 5; // 5px amplitude
```

### 3. AI Chatbot Integration

The chatbot is pre-configured with business-specific responses:

#### Update Chatbot Responses
Edit the `chatbotResponses` object in `js/main.js`:

```javascript
this.chatbotResponses = {
  'hello': 'Your custom greeting message',
  'price': 'Your pricing information',
  'demo': 'Your demo scheduling message',
  'features': 'Your features description',
  'automation': 'Your automation services description',
  'voice bot': 'Your voice bot capabilities',
  'n8n': 'Your n8n workflow services',
  'default': 'Your default response'
};
```

#### Connect to Real Chatbot Service
Replace mock responses with actual API calls:

```javascript
async sendMessage() {
  const message = this.chatbotInput.value.trim();
  if (!message) return;

  this.addMessage(message, 'user');
  this.chatbotInput.value = '';

  try {
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    this.addMessage(data.response, 'bot');
  } catch (error) {
    this.addMessage('Sorry, I\'m having trouble connecting. Please try again.', 'bot');
  }
}
```

### 4. 3D Model Integration

#### Adding Real 3D Models

1. **Create Assets Folder**:
   ```bash
   mkdir -p conversion-wing/assets/models
   ```

2. **Add Three.js Library** (add to `<head>` in `index.html`):
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
   ```

3. **Update the 3D Model Loader** in `js/main.js`:
   ```javascript
   load3DModel(element) {
     const scene = new THREE.Scene();
     const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
     const renderer = new THREE.WebGLRenderer({ alpha: true });
     
     const loader = new THREE.GLTFLoader();
     loader.load('/assets/models/ai-assistant.glb', (gltf) => {
       const model = gltf.scene;
       model.scale.set(0.5, 0.5, 0.5);
       scene.add(model);
       
       // Add rotation animation
       const animate = () => {
         requestAnimationFrame(animate);
         model.rotation.y += 0.01;
         renderer.render(scene, camera);
       };
       animate();
       
       element.appendChild(renderer.domElement);
     });
   }
   ```

4. **Replace SVG Fallback** in `index.html`:
   ```html
   <div class="hero__robot-model" data-lazy="3d-model">
     <!-- 3D model will be loaded here -->
   </div>
   ```

### 5. Content Customization

#### Update Service Cards (6 Cards)
Modify the service cards in `index.html`:

```html
<div class="service-card">
  <div class="service-card__icon">🤖</div>
  <h3 class="service-card__title">AI Voice Bots</h3>
  <p class="service-card__description">Handle calls and bookings with human-like precision.</p>
</div>
```

#### Update Use Cases (6 Cards)
Replace use case cards in `index.html`:

```html
<div class="use-case-card">
  <div class="use-case-card__icon">💇</div>
  <h3 class="use-case-card__title">Salons & Clinics</h3>
  <p class="use-case-card__description">Book clients automatically.</p>
</div>
```

#### Update Testimonials
Replace testimonials in `index.html`:

```html
<div class="testimonial-card">
  <div class="testimonial-card__avatar">👨‍💼</div>
  <div class="testimonial-card__content">
    <p class="testimonial-card__text">"Your client testimonial"</p>
    <div class="testimonial-card__author">— Client Name, Company</div>
  </div>
</div>
```

### 6. Performance Optimizations

#### Lazy Loading
The site includes lazy loading for heavy assets:

```html
<!-- Lazy load 3D models -->
<div data-lazy="3d-model" data-src="/path/to/model.glb"></div>

<!-- Lazy load images -->
<img data-lazy="image" data-src="/path/to/image.jpg" alt="Description">
```

#### Mobile Optimizations
- Reduced animations on mobile devices
- Touch-friendly interface elements
- Optimized image sizes
- Minimal JavaScript execution
- Disabled mouse tracking on mobile

#### Accessibility Features
- Reduced motion support for users with vestibular disorders
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### 7. Customization Options

#### Update Brand Colors
Modify CSS custom properties in `css/style.css`:

```css
:root {
  --color-navy: #030616;      /* Your primary color */
  --color-teal: #00FFC6;       /* Your accent color */
  --color-white: #FFFFFF;      /* Your text color */
  --color-grey-light: #F5F6FA; /* Your background color */
}
```

#### Modify Animations
Adjust animation timing in `css/style.css`:

```css
@keyframes robotFloat {
  0%, 100% {
    transform: translateY(0px) rotateX(0deg);
  }
  50% {
    transform: translateY(-15px) rotateX(5deg); /* Adjust values */
  }
}
```

#### Add New Sections
Follow the existing structure:

```html
<section class="new-section">
  <div class="new-section__container">
    <h2 class="new-section__title">Section Title</h2>
    <div class="new-section__content">
      <!-- Section content -->
    </div>
  </div>
</section>
```

## 🚀 Deployment

### Static Hosting (Recommended)
- **Netlify**: Drag and drop the `conversion-wing` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a repository and enable Pages

### Traditional Web Hosting
1. Upload all files to your web server
2. Ensure `index.html` is in the root directory
3. Test all functionality after deployment

### CDN Integration
For better performance, consider using a CDN for:
- Google Fonts (already included)
- Three.js library (if using 3D models)
- Static assets (images, models)

## 🔍 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Fallbacks**: Graceful degradation for older browsers

## 📱 Mobile Considerations

- Touch-optimized chatbot interface
- Reduced animations for better performance
- Responsive typography and spacing
- Optimized images and assets
- Disabled mouse tracking on mobile devices

## 🛠️ Troubleshooting

### Common Issues

1. **Interactive Robot Not Working**
   - Check browser console for JavaScript errors
   - Ensure mouse tracking is enabled (disabled on mobile)
   - Verify DOM elements exist before attaching listeners

2. **Chatbot Not Working**
   - Check browser console for JavaScript errors
   - Ensure all event listeners are properly attached
   - Verify DOM elements exist before attaching listeners

3. **3D Models Not Loading**
   - Check file paths in the loader
   - Ensure CORS headers are set for model files
   - Verify WebGL support in browser

4. **Performance Issues**
   - Enable lazy loading for heavy assets
   - Reduce animation complexity on mobile
   - Optimize images and use appropriate formats

5. **Styling Issues**
   - Check CSS custom properties support
   - Verify responsive breakpoints
   - Test on different devices

## 📞 Support

For technical support or customization requests:
- Email: contact@conversionwingmarketing.com
- Website: [ConversionWing Marketing](https://conversionwingmarketing.com)

## 📄 License

This project is proprietary to ConversionWing Marketing. All rights reserved.

---

**Built with ❤️ for ConversionWing Marketing - AI Automation & Voice Bots**

## 🎯 Key Features Summary

✅ **Interactive 3D Robot** with mouse tracking and click effects  
✅ **Premium Hero Section** with reduced padding (60px)  
✅ **6 Glassmorphism Service Cards** with 3D hover effects  
✅ **3D AI Brain Visualization** with neural network animation  
✅ **6 Use Case Cards** with hover parallax effects  
✅ **n8n-Style Workflow** with animated connecting lines  
✅ **Live AI Chatbot** with business-specific responses  
✅ **Auto-Scroll Testimonials** with floating card effects  
✅ **Pulsing Final CTA** with animated glow  
✅ **Dark Theme** throughout (no white backgrounds)  
✅ **Outfit & Manrope Typography** (Google Fonts)  
✅ **Mobile Responsive** with touch optimizations  
✅ **Performance Optimized** with lazy loading  
✅ **Accessibility Compliant** with reduced motion support