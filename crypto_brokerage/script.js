document.addEventListener('DOMContentLoaded', () => {
    const marketContainer = document.querySelector('.market-container');
    const modal = document.getElementById('invest-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const investForm = document.getElementById('invest-form');
    const modalCryptoName = document.getElementById('modal-crypto-name');
    const modalCryptoId = document.getElementById('modal-crypto-id');

    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false';

    function generateCoinSvg(symbol) {
        const cleanSymbol = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs>
                    <radialGradient id="grad-${cleanSymbol}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:#e94560;stop-opacity:0.5" />
                        <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="50" fill="url(#grad-${cleanSymbol})" />
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#f0f0f0" font-size="30" font-family="Roboto, sans-serif" font-weight="bold">${cleanSymbol}</text>
            </svg>
        `;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    async function fetchCryptoData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data = await response.json();
            displayCryptoData(data);
        } catch (error) {
            console.error("Failed to fetch crypto data:", error);
            marketContainer.innerHTML = `<p style="color: var(--red);">Could not load market data. Please try again later.</p>`;
        }
    }

    function displayCryptoData(coins) {
        marketContainer.innerHTML = ''; // Clear loader or previous content
        coins.forEach((coin, index) => {
            const priceChange = coin.price_change_percentage_24h;
            const priceChangeClass = priceChange >= 0 ? 'positive' : 'negative';

            const cryptoCard = document.createElement('div');
            cryptoCard.classList.add('crypto-card');
            cryptoCard.style.setProperty('--card-index', index);
            cryptoCard.innerHTML = `
                <div class="card-header">
                    <img src="${generateCoinSvg(coin.symbol)}" alt="${coin.name} logo">
                    <div class="name-symbol">
                        <h3>${coin.name}</h3>
                        <p>${coin.symbol.toUpperCase()}</p>
                    </div>
                </div>
                <div class="card-body">
                    <p class="price">$${coin.current_price.toLocaleString()}</p>
                    <p class="change ${priceChangeClass}">${priceChange.toFixed(2)}%</p>
                </div>
                <button class="btn-invest" data-id="${coin.id}" data-name="${coin.name}">Invest</button>
            `;
            marketContainer.appendChild(cryptoCard);
        });

        // Add event listeners to new invest buttons
        document.querySelectorAll('.btn-invest').forEach(button => {
            button.addEventListener('click', openInvestModal);
        });
    }

    function openInvestModal(event) {
        const cryptoId = event.target.dataset.id;
        const cryptoName = event.target.dataset.name;

        modalCryptoName.textContent = cryptoName;
        modalCryptoId.value = cryptoId;
        modal.style.display = 'flex';
    }

    function closeInvestModal() {
        modal.style.display = 'none';
        investForm.reset();
    }

    // Event Listeners for modal
    if (modal) {
        closeModalBtn.addEventListener('click', closeInvestModal);
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                closeInvestModal();
            }
        });

        investForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = document.getElementById('amount').value;
            const cryptoName = modalCryptoName.textContent;
            alert(`Successfully processed your investment of $${amount} in ${cryptoName}!`);
            closeInvestModal();
        });
    }

    // Initial fetch
    if (marketContainer) {
        fetchCryptoData();
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
