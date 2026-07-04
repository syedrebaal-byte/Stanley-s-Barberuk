# Stanley's Barber Shop - Luxury Interactive Website

A minimal, luxury, and highly interactive creative website designed for **Stanley’s Barber** in Manchester, United Kingdom. 

This website is styled under Apple-inspired design aesthetics, utilizing absolute OLED black backgrounds, refined typography, and advanced front-end details to capture immediate user engagement.

---

## Key Features

* **OLED Dark Aesthetic**: Custom styling palette utilizing rich matte black and pure black backdrops, brushed champagne gold variables (`#c5a880`), and light grey borders.
* **Dynamic Scissor Cursor**: A custom dual-element cursor where a vector silhouette of scissors follows the mouse coordinate. The scissors dynamically rotate/tilt based on movement speed and snap-close on click.
* **Bespoke 3D Card Tilt**: Interactive Lookbook styling cards tilt on their X and Y axes depending on mouse coordinates, providing a sense of depth and parallax.
* **Translucent Header**: A glassy sticky navigation bar with a solid backdrop-blur filter (`backdrop-filter: blur(20px)`) that overlays content and transitions dynamically on scroll.
* **Top Scroll Progress Indicator**: A thin 3px gradient progress bar at the very top of the page that tracks and displays page scroll depth.
* **Interactive Booking Calculator**: A step-by-step reservation wizard (Select Services -> Select Barber -> Choose Date/Time -> Enter Client Details) calculating estimated pricing and duration live.
* **Infinite Reviews Slider**: Seamlessly displays local Manchester verified reviews highlighting a **4.9 rating based on 268 reviews**.
* **Before/After Transformations Slider**: Allows users to drag and reveal before-and-after styling transformations.
* **Custom Dark Maps**: Integration of a Google Map styled using native CSS filters to match the dark luxury design theme.

---

## File Structure

```text
├── hero.png             # Luxury barbershop interior background
├── logo.png             # Gold crest brand logo
├── pompadour.png        # Pompadour lookbook styling photo
├── fade.png             # Drop fade lookbook styling photo
├── beard.png            # Beard sculpting lookbook styling photo
├── index.html           # Main semantic structure and SEO
├── style.css            # Luxury design tokens, animations, layout styles
├── main.js              # Magnetic physics, LERP custom cursor, 3D tilts, wizard state calculations
├── package.json         # Project setup metrics
├── vercel.json          # Vercel hosting optimizations configuration
├── serve.ps1            # Custom PowerShell-based web server utility
├── README.md            # Repository homepage instructions
└── .gitignore           # Excludes local developer logs and system files
```

---

## Setup & Running Locally

This is a static client-side web application with no external backend server dependencies, meaning you can serve it easily:

### Method 1: Built-in PowerShell Server (Recommended for Windows)
Right-click [serve.ps1](serve.ps1) and choose **"Run with PowerShell"**, or open PowerShell in the project directory and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Then navigate to `http://localhost:8080` in your web browser.

### Method 2: VS Code Live Server
If you use Visual Studio Code, install the **Live Server** extension. Open this folder in VS Code, right-click `index.html`, and choose **"Open with Live Server"**.

### Method 3: Direct Protocol
Simply double-click the `index.html` file in your system explorer to launch it directly using the `file://` protocol in any browser.

---

## Contact & Business Specifications

* **Business Name**: Stanley’s Barber
* **Address**: 969 Stockport Rd, Manchester M19 3NP, United Kingdom
* **Phone Number**: +44 7386 024758
* **Verified Reviews**: 268 Reviews (4.9 Rating)
