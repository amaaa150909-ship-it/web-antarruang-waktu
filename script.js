/*
 * SCRIPT.JS - Logika Interaktivitas Lengkap
 * Mendukung Dark Mode, Before-After Slider, Lightbox Gallery, LeafletJS, dan Animasi Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. UTILITY: LUCIDE ICONS INITIALIZATION ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- 2. DARK MODE TOGGLE SYSTEM ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      
      // Update map tile layer style if map is initialized
      updateMapTheme(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'lucide-sun';
      themeIcon.setAttribute('data-lucide', 'sun');
    } else {
      themeIcon.className = 'lucide-moon';
      themeIcon.setAttribute('data-lucide', 'moon');
    }
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }


  // --- 3. MOBILE NAVIGATION MENU ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isActive = navLinks.classList.contains('active');
      
      if (menuIcon) {
        if (isActive) {
          menuIcon.className = 'lucide-x';
          menuIcon.setAttribute('data-lucide', 'x');
        } else {
          menuIcon.className = 'lucide-menu';
          menuIcon.setAttribute('data-lucide', 'menu');
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });

    // Close menu when clicking link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuIcon) {
          menuIcon.className = 'lucide-menu';
          menuIcon.setAttribute('data-lucide', 'menu');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      });
    });
  }


  // --- 4. STICKY NAVBAR & ACTIVE SCROLL HIGHLIGHT ---
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section, header');
  const navItems = document.querySelectorAll('.nav-links .nav-item a');

  window.addEventListener('scroll', () => {
    // Sticky navbar effect
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlighting active section in nav links
    let currentActive = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentActive = section.getAttribute('id') || '';
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href').substring(1);
      if (href === currentActive) {
        item.classList.add('active');
      }
    });
  });


  // --- 5. LIGHTWEIGHT CUSTOM ANIMATE ON SCROLL (AOS) ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Unobserve once animated
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- 6. HISTORY INTERACTIVE TIMELINE ---
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const timelinePanels = document.querySelectorAll('.timeline-panel');
  const progressLine = document.querySelector('.timeline-progress');

  function updateTimeline(index) {
    const totalNodes = timelineNodes.length;
    // Calculate progress line width
    const percentage = (index / (totalNodes - 1)) * 100;
    if (progressLine) {
      progressLine.style.width = `${percentage}%`;
    }

    // Toggle active state on buttons
    timelineNodes.forEach((node, idx) => {
      if (idx <= index) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Toggle active state on info panels
    timelinePanels.forEach((panel, idx) => {
      if (idx === index) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  // Click listener for timeline nodes
  timelineNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      updateTimeline(index);
    });
  });

  // Initialize first node as active
  if (timelineNodes.length > 0) {
    updateTimeline(0);
  }


  // --- 7. COUNTER STATISTICS ANIMATION ---
  const statsSection = document.getElementById('statistik');
  const statNumbers = document.querySelectorAll('.stats-number');
  let statsAnimated = false;

  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const speed = 1500; // Counter total duration in ms
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / speed, 1);
      
      let currentVal = percentage * target;
      
      // Formatting number
      if (target % 1 === 0) {
        element.textContent = Math.floor(currentVal).toLocaleString('id-ID') + suffix;
      } else {
        element.textContent = currentVal.toFixed(1).replace('.', ',') + suffix;
      }

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        // Guarantee final value matches target exactly
        element.textContent = (target % 1 === 0 ? target : target.toFixed(1).replace('.', ',')) + suffix;
      }
    };

    requestAnimationFrame(animate);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statNumbers.forEach(num => countUp(num));
        statsAnimated = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }


  // --- 8. VISUAL TIMELINE TABS (GALLERY) ---
  const tabButtons = document.querySelectorAll('.v-tab-btn');
  const slides = document.querySelectorAll('.v-slide');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const year = btn.getAttribute('data-year');

      // Update tabs active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show active slide
      slides.forEach(slide => {
        if (slide.getAttribute('id') === `slide-${year}`) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
    });
  });


  // --- 9. INTERACTIVE BEFORE-AFTER SLIDER ---
  const slider = document.querySelector('.before-after-slider');
  const resizeImg = document.querySelector('.slider-resize');
  const handle = document.querySelector('.slider-handle');

  if (slider && resizeImg && handle) {
    let active = false;

    // Helper to calculate offset and position slider
    const moveSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      let position = (x / rect.width) * 100;
      
      // Boundary safety
      if (position < 0) position = 0;
      if (position > 100) position = 100;

      resizeImg.style.width = `${position}%`;
      handle.style.left = `${position}%`;
    };

    // Desktop Mouse Events
    slider.addEventListener('mousedown', (e) => {
      active = true;
      moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      active = false;
    });

    slider.addEventListener('mousemove', (e) => {
      if (!active) return;
      moveSlider(e.clientX);
    });

    // Mobile Touch Events
    slider.addEventListener('touchstart', (e) => {
      active = true;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      active = false;
    });

    slider.addEventListener('touchmove', (e) => {
      if (!active) return;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });
  }


  // --- 10. MASONRY LIGHTBOX ZOOM GALLERY ---
  const galleryItems = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;
  const lightboxDesc = lightbox ? lightbox.querySelector('.lightbox-desc') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  
  let currentGalleryIndex = 0;
  const galleryList = [];

  // Parse gallery item data
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.masonry-title')?.textContent || '';
    const desc = item.querySelector('.masonry-desc')?.textContent || '';
    
    galleryList.push({
      src: img.getAttribute('src'),
      title: title,
      desc: desc
    });

    item.addEventListener('click', () => {
      currentGalleryIndex = index;
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    const itemData = galleryList[index];
    
    lightboxImg.setAttribute('src', itemData.src);
    if (lightboxTitle) lightboxTitle.textContent = itemData.title;
    if (lightboxDesc) lightboxDesc.textContent = itemData.desc;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryList.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryList.length) % galleryList.length;
    openLightbox(currentGalleryIndex);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });

  if (lightbox) {
    // Close on clicking backdrop area
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });


  // --- 11. LEAFLETJS MAP INTEGRATION ---
  let map;
  let tileLayer;
  const MapCoords = [-6.9024812, 107.6187747]; // Gedung Sate coordinates

  function initMap() {
    const mapElement = document.getElementById('map-leaflet');
    if (!mapElement || typeof L === 'undefined') return;

    // Create map instance
    map = L.map('map-leaflet', {
      scrollWheelZoom: false
    }).setView(MapCoords, 16);

    // Initial tile layer selection based on theme
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const tileUrl = getTileLayerUrl(theme);
    
    tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom modern SVG-based pin marker
    const customIcon = L.divIcon({
      html: `
        <div style="
          width: 36px;
          height: 36px;
          background: #d97706;
          border: 4px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'custom-map-pin',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -32]
    });

    // Custom Pop-up HTML Content
    const popupContent = `
      <div class="map-popup-card">
        <h4>Gedung Sate</h4>
        <p>Pusat pemerintahan Provinsi Jawa Barat & Landmark Sejarah Kota Bandung</p>
        <span class="map-popup-coords">Lat: -6.9025, Lng: 107.6188</span>
      </div>
    `;

    // Add marker to map
    L.marker(MapCoords, { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);
  }

  function getTileLayerUrl(theme) {
    // Using neat tile layer designs for light & dark maps
    if (theme === 'dark') {
      // Sleek dark-themed tiles from CartoDB
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else {
      // Warm detailed light tiles from CartoDB or standard OSM
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
  }

  function updateMapTheme(theme) {
    if (!map || !tileLayer) return;
    map.removeLayer(tileLayer);
    
    const tileUrl = getTileLayerUrl(theme);
    tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  // Load map safely
  if (typeof L !== 'undefined') {
    initMap();
  } else {
    // If Leaflet hasn't fully loaded, retry in 500ms
    setTimeout(() => {
      if (typeof L !== 'undefined') initMap();
    }, 500);
  }
});
