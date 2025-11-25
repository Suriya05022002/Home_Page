// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0
let testimonialInterval
let countdownInterval
let AOS // Declare AOS variable

// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", () => {
  // Initialize loading screen
  initLoadingScreen()

  // Initialize navigation
  initNavigation()

  // Initialize animations
  initAnimations()

  // Initialize testimonials
  initTestimonials()

  // Initialize countdown timer
  initCountdownTimer()

  // Initialize forms
  initForms()

  // Initialize scroll effects
  initScrollEffects()

  // Initialize counter animations
  initCounterAnimations()
})

// ===== LOADING SCREEN =====
function initLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen")

  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out")
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 1000)
  })
}

// ===== NAVIGATION =====
function initNavigation() {
  const navbar = document.getElementById("navbar")
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("navMenu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Hamburger menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Active navigation link
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]")
    const scrollPos = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active")
          }
        })
      }
    })
  })
}

// ===== ANIMATIONS =====
function initAnimations() {
  // Initialize AOS (Animate On Scroll) if available
  if (typeof window.AOS !== "undefined") {
    AOS = window.AOS // Assign AOS from window object
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })
  }

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe elements for fade-in animation
  const fadeElements = document.querySelectorAll(".fade-in")
  fadeElements.forEach((el) => observer.observe(el))
}

// ===== TESTIMONIALS =====
function initTestimonials() {
  const totalSlides = 6
  const track = document.getElementById("testimonialTrack")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const indicators = document.querySelectorAll(".indicator")

  function updateSlider() {
    const slideWidth = getSlideWidth()
    const offset = -currentTestimonial * slideWidth
    track.style.transform = `translateX(${offset}px)`

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentTestimonial)
    })

    // Update button states
    prevBtn.disabled = currentTestimonial === 0
    nextBtn.disabled = currentTestimonial === totalSlides - 1
  }

  function getSlideWidth() {
    const isMobile = window.innerWidth <= 480
    const isTablet = window.innerWidth <= 768

    if (isMobile) {
      return 300 + 32 // mobile card width + gap
    } else if (isTablet) {
      return 350 + 32 // tablet card width + gap
    } else {
      return 450 + 32 // desktop card width + gap
    }
  }

  // Auto-play functionality
  function startAutoPlay() {
    testimonialInterval = setInterval(() => {
      if (currentTestimonial < totalSlides - 1) {
        window.moveTestimonial(1) // Use window.moveTestimonial
      } else {
        currentTestimonial = 0
        updateSlider()
      }
    }, 5000)
  }

  function stopAutoPlay() {
    clearInterval(testimonialInterval)
  }

  // Initialize slider
  updateSlider()
  startAutoPlay()

  // Pause auto-play on hover
  const slider = document.querySelector(".testimonials-slider")
  if (slider) {
    slider.addEventListener("mouseenter", stopAutoPlay)
    slider.addEventListener("mouseleave", startAutoPlay)
  }

  // Listen for window resize
  window.addEventListener("resize", updateSlider)

  // Touch/swipe support for mobile
  let startX = 0
  let endX = 0

  if (slider) {
    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    slider.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      handleSwipe()
    })
  }

  function handleSwipe() {
    const swipeThreshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        window.moveTestimonial(1) // Use window.moveTestimonial
      } else {
        // Swipe right - previous slide
        window.moveTestimonial(-1) // Use window.moveTestimonial
      }
    }
  }

  // Make functions global for button onclick handlers
  window.moveTestimonial = (direction) => {
    const newSlide = currentTestimonial + direction
    if (newSlide >= 0 && newSlide < totalSlides) {
      currentTestimonial = newSlide
      updateSlider()
    }
  }

  window.goToSlide = (slideIndex) => {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
      currentTestimonial = slideIndex
      updateSlider()
    }
  }
}

// ===== COUNTDOWN TIMER =====
function initCountdownTimer() {
  const hoursEl = document.getElementById("hours")
  const minutesEl = document.getElementById("minutes")
  const secondsEl = document.getElementById("seconds")

  if (!hoursEl || !minutesEl || !secondsEl) return

  let hours = 23
  let minutes = 59
  let seconds = 45

  countdownInterval = setInterval(() => {
    if (seconds > 0) {
      seconds--
    } else if (minutes > 0) {
      minutes--
      seconds = 59
    } else if (hours > 0) {
      hours--
      minutes = 59
      seconds = 59
    } else {
      // Reset timer
      hours = 23
      minutes = 59
      seconds = 45
    }

    hoursEl.textContent = hours.toString().padStart(2, "0")
    minutesEl.textContent = minutes.toString().padStart(2, "0")
    secondsEl.textContent = seconds.toString().padStart(2, "0")
  }, 1000)
}

// ===== FORMS =====
function initForms() {
  // Contact form
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Enrollment form
  const enrollForm = document.getElementById("enrollForm")
  if (enrollForm) {
    enrollForm.addEventListener("submit", handleEnrollForm)
  }

  // Form input animations
  const formInputs = document.querySelectorAll(".form-group input, .form-group textarea, .form-group select")
  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused")
    })

    input.addEventListener("blur", () => {
      if (!input.value) {
        input.parentElement.classList.remove("focused")
      }
    })

    // Check if input has value on load
    if (input.value) {
      input.parentElement.classList.add("focused")
    }
  })
}

function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true

  // Simulate form submission
  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Show success message
    showNotification("Message sent successfully! We'll get back to you soon.", "success")

    // Reset form
    e.target.reset()

    // Remove focused class from form groups
    const formGroups = e.target.querySelectorAll(".form-group")
    formGroups.forEach((group) => group.classList.remove("focused"))
  }, 2000)
}

function handleEnrollForm(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
  submitBtn.disabled = true

  // Simulate form submission
  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Close modal
    closeModal("enrollModal")

    // Show success message
    showNotification("Enrollment successful! Check your email for payment instructions.", "success")

    // Reset form
    e.target.reset()
  }, 2000)
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
  // Back to top button
  const backToTop = document.getElementById("backToTop")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("visible")
    } else {
      backToTop.classList.remove("visible")
    }
  })

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80 // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
  const counters = document.querySelectorAll("[data-count]")

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = Number.parseInt(counter.getAttribute("data-count"))
          animateCounter(counter, target)
          counterObserver.unobserve(counter)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => counterObserver.observe(counter))
}

function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    element.textContent = Math.floor(start)

    if (start >= target) {
      element.textContent = target
      clearInterval(timer)
    }
  }, 16)
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = ""
  }
}

// ===== UTILITY FUNCTIONS =====
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const offsetTop = section.offsetTop - 80
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === "success" ? "check-circle" : "info-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : "#3b82f6"};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease-in"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener("keydown", (e) => {
  // Close modal on Escape key
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".modal.active")
    if (activeModal) {
      closeModal(activeModal.id)
    }
  }

  // Navigate testimonials with arrow keys
  if (e.key === "ArrowLeft") {
    window.moveTestimonial(-1) // Use window.moveTestimonial
  } else if (e.key === "ArrowRight") {
    window.moveTestimonial(1) // Use window.moveTestimonial
  }
})

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for resize events
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// ===== CLEANUP =====
window.addEventListener("beforeunload", () => {
  // Clear intervals
  if (testimonialInterval) clearInterval(testimonialInterval)
  if (countdownInterval) clearInterval(countdownInterval)
})

// ===== ADDITIONAL CSS ANIMATIONS =====
const additionalCSS = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.notification-close:hover {
    background: rgba(255, 255, 255, 0.2);
}
`

// Inject additional CSS
const style = document.createElement("style")
style.textContent = additionalCSS
document.head.appendChild(style)

// ===== IMAGE CAROUSEL =====
let currentSlide = 0
let carouselInterval
const totalSlides = 5

function initImageCarousel() {
  const track = document.getElementById("carouselTrack")
  const prevBtn = document.getElementById("prevCarouselBtn")
  const nextBtn = document.getElementById("nextCarouselBtn")
  const indicators = document.querySelectorAll(".carousel-indicator")
  const slides = document.querySelectorAll(".carousel-slide")

  function updateCarousel() {
    const offset = -currentSlide * 20 // 20% per slide
    track.style.transform = `translateX(${offset}%)`

    // Update active slide
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide)
    })

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide)
    })

    // Update button states
    prevBtn.disabled = currentSlide === 0
    nextBtn.disabled = currentSlide === totalSlides - 1
  }

  // Auto-play functionality
  function startCarouselAutoPlay() {
    carouselInterval = setInterval(() => {
      if (currentSlide < totalSlides - 1) {
        moveCarousel(1)
      } else {
        currentSlide = 0
        updateCarousel()
      }
    }, 4000)
  }

  function stopCarouselAutoPlay() {
    clearInterval(carouselInterval)
  }

  // Initialize carousel
  updateCarousel()
  startCarouselAutoPlay()

  // Pause auto-play on hover
  const carousel = document.querySelector(".image-carousel")
  if (carousel) {
    carousel.addEventListener("mouseenter", stopCarouselAutoPlay)
    carousel.addEventListener("mouseleave", startCarouselAutoPlay)
  }

  // Touch/swipe support for mobile
  let startX = 0
  let endX = 0

  if (carousel) {
    carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    carousel.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      handleCarouselSwipe()
    })
  }

  function handleCarouselSwipe() {
    const swipeThreshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        moveCarousel(1)
      } else {
        // Swipe right - previous slide
        moveCarousel(-1)
      }
    }
  }

  // Make functions global for button onclick handlers
  window.moveCarousel = (direction) => {
    const newSlide = currentSlide + direction
    if (newSlide >= 0 && newSlide < totalSlides) {
      currentSlide = newSlide
      updateCarousel()
    }
  }

  window.goToCarouselSlide = (slideIndex) => {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
      currentSlide = slideIndex
      updateCarousel()
    }
  }
}

// Initialize image carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // ... existing initialization code ...

  initImageCarousel()
})

// ===== CLEANUP =====
window.addEventListener("beforeunload", () => {
  // Clear intervals
  if (testimonialInterval) clearInterval(testimonialInterval)
  if (countdownInterval) clearInterval(countdownInterval)
  if (carouselInterval) clearInterval(carouselInterval)
})

document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen()
})

function initLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen")

  // Show preloader for minimum 2 seconds, then fade out
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out")
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 500) // 2 second minimum display time
  })
}


// Counter Animation

const counters = document.querySelectorAll('.stat-box h3');
const speed = 1000;

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;

        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 10);
        } else {
            counter.innerText = target;
        }
    };

    updateCount();
});

// Progress Circle Animation
const progressCircles = document.querySelectorAll('.progress-circle');

progressCircles.forEach(circle => {
    const progress = +circle.getAttribute('data-progress');
    let currentProgress = 0;
    const speed = 100; // The higher the slower

    const updateProgress = () => {
        if (currentProgress < progress) {
            currentProgress++;
            circle.style.background = `conic-gradient(#0288d1 ${currentProgress * 3.6}deg, #b3e5fc ${currentProgress * 3.6}deg)`;
            circle.innerHTML = currentProgress + '%';
            setTimeout(updateProgress, speed);
        } else {
            circle.innerHTML = progress + '%';
        }
    };

    updateProgress();
});

   $(document).ready(function(){
            $('.customer-logos').slick({
                slidesToShow: 5,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 1500,
                arrows: false,
                dots: false,
                pauseOnHover:false,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 4
                        }
                    }, 
                    {
                        breakpoint: 520,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 470,
                        settings: {
                            slidesToShow:2 // Ensure 2 slides are shown on screens 480px or below
                        }
                    }
                ]
            });
        });
        

         // Animation on scroll
        function animateOnScroll() {
            const elements = document.querySelectorAll('.fade-in');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
        }

        // Animate progress bars
        function animateProgressBars() {
            const progressBars = document.querySelectorAll('.progress-fill');
            
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 500);
            });
        }

        // Handle login button click
        function handleLogin() {
            alert('Redirecting to login page...');
            // In a real application, you would redirect to the login page
            // window.location.href = '/login';
        }
// Example company updates array
const companyUpdates = [
    "Quarterly earnings report released today.",
    "New product launch scheduled for next month.",
    "CEO announces new strategic initiatives.",
    "Company awarded Best Workplace 2024.",
    "Upcoming company-wide meeting next Friday."
];

// Get the marquee element
const newsMarquee = document.getElementById('news-marquee');

// Generate the news content by joining the items with a separator
newsMarquee.innerHTML = companyUpdates.join(' - ');

console.log("Company Flash News Page Loaded with important updates.");

       