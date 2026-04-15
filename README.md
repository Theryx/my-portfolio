# Ndouken Theryx - Portfolio Website

A minimalist, professional portfolio website showcasing Product Design expertise, leadership, front-end skills, and entrepreneurial ventures.

## 🚀 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Bilingual Support**: English/French language toggle
- **Modern UI/UX**: Clean lines, ample whitespace, high-contrast typography
- **Micro-interactions**: Subtle hover effects and scroll animations
- **Case Studies**: High-impact project showcases (PaySika, Loving Tech, WhatsApp Community)
- **Contact Form**: Ready-to-integrate contact form
- **FAQ Section**: Accordion-style frequently asked questions
- **Skills Grid**: Core competencies display

## 📁 Project Structure

```
My_Portfolio/
├── index.html          # Main HTML file
├── styles/
│   └── main.css        # All styles
├── scripts/
│   └── main.js         # JavaScript functionality
└── README.md           # This file
```

## 🎨 Design System

### Typography
- Font: Inter (Google Fonts)
- Heavy weights for headers (700-800)
- Regular weight for body text (400)

### Color Palette
- **Background**: White (#FFFFFF) / Off-white (#F8F9FA)
- **Primary Accent**: Tech Green (#00D4AA)
- **Secondary Accent**: Purple (#8B5CF6)
- **Text**: Near black (#1A1A1A)
- **Text Light**: Gray (#6B7280)

### Components
- Touch-friendly buttons
- Subtle hover effects on cards
- Purposeful, fast animations

## 🛠 How to Use

### Option 1: Direct Open
Simply open `index.html` in any modern browser.

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if installed)
npx serve
```

Then navigate to `http://localhost:8000`

## ✏️ Customization

### Update Email
Edit `index.html` and replace `your.email@example.com` with your professional email.

### Update Social Links
Edit `index.html` and replace the `#` in social link `href` attributes with your actual profile URLs:
- LinkedIn
- Twitter/X
- Dribbble/Behance

### Add Resume PDF
1. Add your resume PDF to the project folder
2. Update the "Download Resume" button href:
```html
<a href="resume.pdf" class="btn btn--secondary" download>Download Resume</a>
```

### Add Real Project Images
Replace the SVG placeholders in the project cards with actual screenshots:
```html
<div class="project-card__image">
    <img src="path-to-your-image.jpg" alt="Project description">
</div>
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

## 🔧 JavaScript Features

1. **Language Toggle**: Switches between English and French
2. **Mobile Menu**: Hamburger menu for small screens
3. **Header Scroll Effect**: Adds shadow on scroll
4. **FAQ Accordion**: Expandable FAQ questions
5. **Contact Form**: Form submission handling (ready for backend integration)
6. **Smooth Scroll**: Smooth anchor link scrolling
7. **Intersection Observer**: Fade-in animations on scroll

## 🎯 Next Steps (Optional)

- [ ] Connect contact form to backend (e.g., Formspree, Netlify Forms)
- [ ] Add actual project images
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Deploy to Netlify/Vercel/GitHub Pages
- [ ] Add Open Graph meta tags for social sharing
- [ ] Add dark mode toggle
- [ ] Add blog section

## 📄 License

© 2026 Ndouken Theryx. All rights reserved.
