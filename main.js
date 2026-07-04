/* ==========================================================================
   STANLEY'S BARBER - INTERACTIVE CORE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. PAGE LOADER INITIALIZATION
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 1500); // 1.5 second loading experience
        });
        
        // Fallback in case load event takes too long
        setTimeout(() => {
            if (!loader.classList.contains('fade-out')) {
                loader.classList.add('fade-out');
            }
        }, 3000);
    }


    // 2. SMOOTH INTERACTIVE CURSOR WITH LERP ANIMATION
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    
    let mouseX = 0, mouseY = 0; // Current mouse coords
    let outlineX = 0, outlineY = 0; // Outline coords (will lerp)
    let isMoving = false;

    if (cursorDot && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly place the inner dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            isMoving = true;
        });

        // Lerped animation loop for outline pointer
        function updateOutlineCursor() {
            const lerpFactor = 0.15; // Smooth delay index
            
            outlineX += (mouseX - outlineX) * lerpFactor;
            outlineY += (mouseY - outlineY) * lerpFactor;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            // Dynamic inertia rotation based on drag velocity
            let velocityX = mouseX - outlineX;
            let tilt = Math.max(-25, Math.min(25, velocityX * 0.6));
            
            if (cursorOutline.classList.contains('clicking')) {
                cursorOutline.style.transform = `translate(-50%, -50%) scale(0.8) rotate(${tilt - 45}deg)`;
            } else if (cursorOutline.classList.contains('hover-active')) {
                cursorOutline.style.transform = `translate(-50%, -50%) scale(1.3) rotate(${tilt - 45}deg)`;
            } else {
                cursorOutline.style.transform = `translate(-50%, -50%) rotate(${tilt - 45}deg)`;
            }
            
            requestAnimationFrame(updateOutlineCursor);
        }
        requestAnimationFrame(updateOutlineCursor);

        // Click animations for scissor cutting action
        document.addEventListener('mousedown', () => {
            cursorOutline.classList.add('clicking');
        });
        document.addEventListener('mouseup', () => {
            cursorOutline.classList.remove('clicking');
        });

        // Hover expansions for links, buttons and interactive widgets
        const hoverables = document.querySelectorAll('a, button, .service-option, .barber-card, .time-slot-btn, .slider-handle, .style-card');
        
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover-active');
                cursorOutline.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover-active');
                cursorOutline.classList.remove('hover-active');
            });
        });

        // Hide cursor when exiting viewport
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        });
    }


    // 3. STICKY NAV TRANSFORMATION ON SCROLL
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting based on current view section
        let currentSectionId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Top progress bar update
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.pageYOffset / totalHeight) * 100;
            const progressBar = document.querySelector('.scroll-progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }
    });


    // 4. MOBILE SLIDE-OUT DRAWER MENU
    const drawer = document.querySelector('.mobile-drawer');
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const menuClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (menuToggle && drawer) {
        menuToggle.addEventListener('click', () => {
            drawer.classList.add('open');
        });
        
        menuClose.addEventListener('click', () => {
            drawer.classList.remove('open');
        });

        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('open');
            });
        });
    }


    // 5. INTERSECTION OBSERVER FOR FADE-IN SCROLL REVEALS
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Trigger reveal only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: Reveal immediately if observer is not supported
        revealElements.forEach(el => el.classList.add('revealed'));
    }


    // 6. INTERACTIVE BEFORE/AFTER SLIDER (DRAG REVEAL)
    const sliderContainer = document.getElementById('beforeAfterSlider');
    
    if (sliderContainer) {
        const imageAfter = sliderContainer.querySelector('.image-after');
        const divider = sliderContainer.querySelector('.slider-divider');
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            // Calculate absolute position inside the container bounded by margins
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            
            const percent = (x / rect.width) * 100;
            
            // Set styles dynamically
            imageAfter.style.clipPath = `inset(0 0 0 ${percent}%)`;
            divider.style.left = `${percent}%`;
        };

        // Mouse Events
        divider.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        // Touch Events (Mobile responsiveness support)
        divider.addEventListener('touchstart', (e) => {
            isDragging = true;
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                updateSlider(e.touches[0].clientX);
            }
        });

        // Support container-wide clicks
        sliderContainer.addEventListener('click', (e) => {
            if (e.target !== divider && !divider.contains(e.target)) {
                updateSlider(e.clientX);
            }
        });
    }


    // 7. MULTI-STEP BOOKING WIZARD & COST CALCULATOR ENGINE
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const serviceOptions = document.querySelectorAll('.service-option');
    const barberCards = document.querySelectorAll('.barber-card');
    const timeSlots = document.querySelectorAll('.time-slot-btn');
    const bookingDateInput = document.getElementById('booking-date');
    const clientNameInput = document.getElementById('client-name');
    const clientPhoneInput = document.getElementById('client-phone');
    
    // Wizard Control buttons
    const nextStepBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    const submitBookingBtn = document.getElementById('submit-booking');
    
    // Live Summary display nodes
    const summaryEmpty = document.getElementById('summary-empty');
    const summaryDetails = document.getElementById('summary-details');
    const summaryServicesList = document.getElementById('summary-services');
    const summaryBarberText = document.getElementById('summary-barber');
    const summaryDatetimeText = document.getElementById('summary-datetime');
    const summaryDurationText = document.getElementById('summary-duration');
    const summaryPriceText = document.getElementById('summary-price');

    // Modals
    const successModal = document.getElementById('bookingSuccessModal');
    const receiptDetails = document.getElementById('booking-receipt-details');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    // Set minimum date input selection to today
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.min = today;
    }

    // State object keeping track of booking calculations
    let bookingState = {
        services: [],
        barber: null,
        date: '',
        time: '',
        name: '',
        phone: ''
    };

    // Calculate sum of selected services (durations and pricing)
    function recalculateBooking() {
        if (bookingState.services.length === 0) {
            summaryEmpty.classList.remove('hidden');
            summaryDetails.classList.add('hidden');
            
            // Disable Step 1 Nav CTA
            const nextStep1 = document.querySelector('#step-1 .next-step');
            if (nextStep1) nextStep1.disabled = true;
            return;
        }

        summaryEmpty.classList.add('hidden');
        summaryDetails.classList.remove('hidden');

        // Sum computations
        let totalPrice = 0;
        let totalDuration = 0;
        summaryServicesList.innerHTML = '';

        bookingState.services.forEach(svc => {
            totalPrice += svc.price;
            totalDuration += svc.duration;

            // Generate pills in summary sidebar
            const pill = document.createElement('span');
            pill.className = 'service-pill animate-fade';
            pill.innerHTML = `${svc.name} <i class="fa-solid fa-xmark remove-service" data-id="${svc.id}"></i>`;
            
            // Allow removal from pill
            pill.querySelector('.remove-service').addEventListener('click', (e) => {
                const idToRemove = e.target.getAttribute('data-id');
                removeService(idToRemove);
            });

            summaryServicesList.appendChild(pill);
        });

        // Render values
        summaryPriceText.innerText = `£${totalPrice}`;
        summaryDurationText.innerText = `${totalDuration} Mins`;

        // Update step navigations
        const nextStep1 = document.querySelector('#step-1 .next-step');
        if (nextStep1) nextStep1.disabled = false;
        
        // Update submit button validate state
        validateFinalStep();
    }

    function removeService(id) {
        bookingState.services = bookingState.services.filter(s => s.id !== id);
        
        // Uncheck matching Option Card
        const card = document.querySelector(`.service-option[data-id="${id}"]`);
        if (card) card.classList.remove('selected');
        
        recalculateBooking();
    }

    // Step 1: Click Service option
    serviceOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const id = opt.getAttribute('data-id');
            const name = opt.getAttribute('data-name');
            const price = parseFloat(opt.getAttribute('data-price'));
            const duration = parseInt(opt.getAttribute('data-duration'));

            opt.classList.toggle('selected');

            if (opt.classList.contains('selected')) {
                // Add to booking array if not exists
                if (!bookingState.services.some(s => s.id === id)) {
                    bookingState.services.push({ id, name, price, duration });
                }
            } else {
                // Remove from booking array
                bookingState.services = bookingState.services.filter(s => s.id !== id);
            }

            recalculateBooking();
        });
    });

    // Step 2: Choose Barber
    barberCards.forEach(card => {
        card.addEventListener('click', () => {
            barberCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            bookingState.barber = {
                name: card.getAttribute('data-name'),
                title: card.getAttribute('data-title')
            };

            // Update Summary
            summaryBarberText.innerText = `${bookingState.barber.name} (${bookingState.barber.title})`;

            // Enable Step 2 CTA
            const nextStep2 = document.querySelector('#step-2 .next-step');
            if (nextStep2) nextStep2.disabled = false;
        });
    });

    // Step 3: Date input and time slot selectors
    if (bookingDateInput) {
        bookingDateInput.addEventListener('change', (e) => {
            bookingState.date = e.target.value;
            updateDateTimeSummary();
            validateFinalStep();
        });
    }

    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');

            bookingState.time = slot.getAttribute('data-time');
            updateDateTimeSummary();
            validateFinalStep();
        });
    });

    // Capture details inputs
    if (clientNameInput && clientPhoneInput) {
        const inputHandler = () => {
            bookingState.name = clientNameInput.value.trim();
            bookingState.phone = clientPhoneInput.value.trim();
            validateFinalStep();
        };

        clientNameInput.addEventListener('input', inputHandler);
        clientPhoneInput.addEventListener('input', inputHandler);
    }

    function updateDateTimeSummary() {
        if (bookingState.date || bookingState.time) {
            const formattedDate = bookingState.date ? new Date(bookingState.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Not chosen';
            const formattedTime = bookingState.time ? bookingState.time : 'Not chosen';
            summaryDatetimeText.innerText = `${formattedDate} @ ${formattedTime}`;
        } else {
            summaryDatetimeText.innerText = 'Not selected';
        }
    }

    function validateFinalStep() {
        const isValid = bookingState.services.length > 0 &&
                        bookingState.barber !== null &&
                        bookingState.date !== '' &&
                        bookingState.time !== '' &&
                        bookingState.name !== '' &&
                        bookingState.phone !== '';

        if (submitBookingBtn) {
            submitBookingBtn.disabled = !isValid;
        }
    }

    // Step navigation actions
    let currentActiveStep = 1;

    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentActiveStep < 3) {
                // Mark previous step as completed
                const indicator = document.querySelector(`.step-indicator[data-step="${currentActiveStep}"]`);
                if (indicator) {
                    indicator.classList.remove('active');
                    indicator.classList.add('completed');
                }

                currentActiveStep++;
                
                // Show next step
                wizardSteps.forEach(step => step.classList.remove('active'));
                document.getElementById(`step-${currentActiveStep}`).classList.add('active');

                // Mark current indicator as active
                const nextIndicator = document.querySelector(`.step-indicator[data-step="${currentActiveStep}"]`);
                if (nextIndicator) {
                    nextIndicator.classList.add('active');
                }
            }
        });
    });

    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentActiveStep > 1) {
                // Revert indicator status
                const indicator = document.querySelector(`.step-indicator[data-step="${currentActiveStep}"]`);
                if (indicator) {
                    indicator.classList.remove('active');
                }

                currentActiveStep--;

                // Show previous step
                wizardSteps.forEach(step => step.classList.remove('active'));
                document.getElementById(`step-${currentActiveStep}`).classList.add('active');

                // Revert previous indicator to active
                const prevIndicator = document.querySelector(`.step-indicator[data-step="${currentActiveStep}"]`);
                if (prevIndicator) {
                    prevIndicator.classList.remove('completed');
                    prevIndicator.classList.add('active');
                }
            }
        });
    });

    // Reset Booking Wizard state to beginning
    function resetWizard() {
        currentActiveStep = 1;
        
        // Reset states
        bookingState = {
            services: [],
            barber: null,
            date: '',
            time: '',
            name: '',
            phone: ''
        };

        // Reset UI nodes
        serviceOptions.forEach(opt => opt.classList.remove('selected'));
        barberCards.forEach(c => c.classList.remove('selected'));
        timeSlots.forEach(s => s.classList.remove('selected'));
        if (bookingDateInput) bookingDateInput.value = '';
        if (clientNameInput) clientNameInput.value = '';
        if (clientPhoneInput) clientPhoneInput.value = '';

        // Reset Indicator states
        stepIndicators.forEach(ind => {
            ind.classList.remove('active', 'completed');
        });
        stepIndicators[0].classList.add('active');

        // Reset active step panel
        wizardSteps.forEach(step => step.classList.remove('active'));
        wizardSteps[0].classList.add('active');

        // Reset Summary Panel
        summaryBarberText.innerText = 'Not chosen';
        summaryDatetimeText.innerText = 'Not selected';
        recalculateBooking();
        
        // Disable next buttons
        nextStepBtns.forEach(btn => {
            if (!btn.id.includes('submit')) btn.disabled = true;
        });
    }

    // Wizard Submission execution
    if (submitBookingBtn) {
        submitBookingBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Populate Modal Receipt
            let servicesListHTML = bookingState.services.map(s => `
                <div class="receipt-row">
                    <span class="label">${s.name}</span>
                    <span class="value">£${s.price}</span>
                </div>
            `).join('');

            let totalPrice = bookingState.services.reduce((acc, curr) => acc + curr.price, 0);
            let totalDuration = bookingState.services.reduce((acc, curr) => acc + curr.duration, 0);
            let formattedDate = new Date(bookingState.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

            receiptDetails.innerHTML = `
                ${servicesListHTML}
                <div class="receipt-row">
                    <span class="label">Duration</span>
                    <span class="value">${totalDuration} mins</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Artisan Barber</span>
                    <span class="value">${bookingState.barber.name}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Date & Time</span>
                    <span class="value">${formattedDate} at ${bookingState.time}</span>
                </div>
                <div class="receipt-row total">
                    <span class="label">Total Paid (At Chair)</span>
                    <span class="value">£${totalPrice}</span>
                </div>
            `;

            // Open Modal
            successModal.classList.add('open');
        });
    }

    // Modal closes resets wizard
    const closeModal = () => {
        successModal.classList.remove('open');
        resetWizard();
    };

    if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener('click', closeModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);


    // 8. TESTIMONIALS REVIEWS CAROUSEL SLIDER (268 REVIEWS INDICATOR)
    const reviewCards = document.querySelectorAll('.review-card');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDotsContainer = document.getElementById('carouselDots');
    
    let reviewIndex = 0;
    let reviewInterval;

    if (reviewCards.length > 0) {
        
        // Dynamically build dot indicators based on review count
        if (carouselDotsContainer) {
            carouselDotsContainer.innerHTML = '';
            reviewCards.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.className = `dot ${idx === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    setReview(idx);
                    resetReviewTimer();
                });
                carouselDotsContainer.appendChild(dot);
            });
        }

        const setReview = (index) => {
            reviewCards.forEach(card => card.classList.remove('active'));
            
            // Wrap index values
            if (index >= reviewCards.length) reviewIndex = 0;
            else if (index < 0) reviewIndex = reviewCards.length - 1;
            else reviewIndex = index;

            reviewCards[reviewIndex].classList.add('active');

            // Update active dots
            const dots = carouselDotsContainer.querySelectorAll('.dot');
            if (dots.length > 0) {
                dots.forEach(d => d.classList.remove('active'));
                dots[reviewIndex].classList.add('active');
            }
        };

        // Navigation Clicks
        if (carouselNext) {
            carouselNext.addEventListener('click', () => {
                setReview(reviewIndex + 1);
                resetReviewTimer();
            });
        }

        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => {
                setReview(reviewIndex - 1);
                resetReviewTimer();
            });
        }

        // Auto sliding reviews loop
        function startReviewTimer() {
            reviewInterval = setInterval(() => {
                setReview(reviewIndex + 1);
            }, 6000); // 6s rotations
        }

        function resetReviewTimer() {
            clearInterval(reviewInterval);
            startReviewTimer();
        }

        startReviewTimer();

        // Pause rotation on hover
        const carouselWrapper = document.querySelector('.reviews-carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => clearInterval(reviewInterval));
            carouselWrapper.addEventListener('mouseleave', startReviewTimer);
        }
    }


    // 9. MAP AND INQUIRY FORM TABS
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });


    // 10. CONTACT FORM SUBMISSION HANDLER
    const inquiryForm = document.getElementById('inquiry-form');
    const inqSuccess = document.getElementById('inq-success');

    if (inquiryForm && inqSuccess) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Fade-out Form & Fade-in success indicator
            inquiryForm.classList.add('hidden');
            inqSuccess.classList.remove('hidden');

            // Reset fields
            inquiryForm.reset();

            // Return to Form input screen after 6 seconds
            setTimeout(() => {
                inqSuccess.classList.add('hidden');
                inquiryForm.classList.remove('hidden');
            }, 6000);
        });
    }

    // 11. NEWSLETTER SUBMISSION POPUP
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input');
            alert(`Welcome to the Club! We've registered ${emailInput.value} for style updates.`);
            emailInput.value = '';
        });
    }

    // 12. DYNAMIC MAGNETIC PHYSICS
    const magneticElements = document.querySelectorAll('.btn-magnetic, .nav-link, .brand-logo');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Pull towards mouse slightly
            el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            el.style.transition = 'none';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // 13. 3D TILT EFFECT ON LOOKBOOK CARDS
    const cards = document.querySelectorAll('.style-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const tiltX = (yc - y) / 18;
            const tiltY = (x - xc) / 18;
            
            const img = card.querySelector('.style-image');
            if (img) {
                img.style.transform = `scale(1.08) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('.style-image');
            if (img) {
                img.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
            }
        });
    });
});
