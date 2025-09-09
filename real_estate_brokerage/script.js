document.addEventListener('DOMContentLoaded', () => {
    const listingsContainer = document.querySelector('.listings-container');

    // Check if on the main page and the container exists
    if (listingsContainer) {
        displayProperties();
    }

    function displayProperties() {
        // Check if the properties data exists
        if (typeof properties === 'undefined' || properties.length === 0) {
            listingsContainer.innerHTML = '<p>No properties available at the moment.</p>';
            return;
        }

        properties.forEach((property, index) => {
            const propertyCard = document.createElement('div');
            propertyCard.classList.add('property-card');
            propertyCard.style.setProperty('--card-index', index);
            propertyCard.innerHTML = `
                <img src="${property.image}" alt="${property.title}">
                <div class="card-content">
                    <h3>${property.title}</h3>
                    <p class="price">$${property.price}</p>
                    <p class="location">${property.location}</p>
                    <div class="details">
                        <span>${property.beds} beds</span>
                        <span>${property.baths} baths</span>
                        <span>${property.sqft} sqft</span>
                    </div>
                    <a href="property.html?id=${property.id}" class="btn-details">View Details</a>
                </div>
            `;
            listingsContainer.appendChild(propertyCard);
        });
    }

    // Handle Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    const propertyDetailContainer = document.querySelector('.property-detail-main');

    if (propertyDetailContainer) {
        displayPropertyDetails();
    }

    function displayPropertyDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const propertyId = parseInt(urlParams.get('id'));

        if (!propertyId || typeof properties === 'undefined') {
            propertyDetailContainer.innerHTML = '<h1>Property not found.</h1><a href="/">Go back to listings</a>';
            return;
        }

        const property = properties.find(p => p.id === propertyId);

        if (!property) {
            propertyDetailContainer.innerHTML = '<h1>Property not found.</h1><a href="/">Go back to listings</a>';
            return;
        }

        document.title = `${property.title} | Dream Homes`;

        propertyDetailContainer.innerHTML = `
            <section class="property-detail">
                <div class="image-carousel">
                    <img src="${property.images[0]}" alt="${property.title}" id="main-image">
                    <div class="thumbnail-container">
                        ${property.images.map((img, index) => `<img src="${img}" alt="Thumbnail ${index+1}" class="thumbnail ${index === 0 ? 'active' : ''}">`).join('')}
                    </div>
                </div>
                <div class="property-info">
                    <h1>${property.title}</h1>
                    <p class="price">$${property.price}</p>
                    <div class="specs">
                        <span>${property.beds} beds</span>
                        <span>${property.baths} baths</span>
                        <span>${property.sqft} sqft</span>
                    </div>
                    <p class="description">${property.description}</p>
                    <button class="btn-purchase">Proceed to Purchase</button>
                </div>
            </section>
            <section class="purchase-form-section" style="display: none;">
                <h2>Purchase Inquiry</h2>
                <form class="purchase-form">
                    <input type="text" name="name" placeholder="Full Name" required>
                    <input type="email" name="email" placeholder="Email Address" required>
                    <input type="tel" name="phone" placeholder="Phone Number" required>
                    <select name="financing" required>
                        <option value="">Financing Option</option>
                        <option value="mortgage">Pre-approved Mortgage</option>
                    </select>
                    <button type="submit">Submit Inquiry</button>
                </form>
                <p class="contact-link-p">For more details, <a href="#contact-property">contact an agent</a>.</p>
            </section>
        `;

        // Image carousel logic
        const mainImage = document.getElementById('main-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.src;
                document.querySelector('.thumbnail.active').classList.remove('active');
                thumb.classList.add('active');
            });
        });

        // Purchase form toggle
        const purchaseBtn = document.querySelector('.btn-purchase');
        const purchaseFormSection = document.querySelector('.purchase-form-section');
        purchaseBtn.addEventListener('click', () => {
            purchaseFormSection.style.display = 'block';
            purchaseBtn.style.display = 'none';
        });

        // Purchase form submission
        const purchaseForm = document.querySelector('.purchase-form');
        purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your inquiry! A representative will contact you shortly to finalize the details.');
            purchaseForm.reset();
            purchaseFormSection.style.display = 'none';
        });
    }

    // Mobile Nav
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navCloseBtn = document.querySelector('.nav-close-btn');

    function closeMobileMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    if (hamburger && navLinks && navCloseBtn) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navCloseBtn.addEventListener('click', closeMobileMenu);

        navLinks.addEventListener('click', (e) => {
            // Close menu if a link is clicked
            if (e.target.tagName === 'A') {
                closeMobileMenu();
            }
        });
    }
});
