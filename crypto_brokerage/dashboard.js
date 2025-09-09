document.addEventListener('DOMContentLoaded', () => {
    // --- Route Guard ---
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('You must be logged in to view this page.');
        window.location.href = 'index.html';
        return;
    }

    // --- Display User Info & Logout ---
    const accBalanceEl = document.getElementById('acc-balance');
    const logoutBtn = document.getElementById('logout-btn');

    if (accBalanceEl) {
        accBalanceEl.textContent = `Balance: $${loggedInUser.acc_bal.toLocaleString()}`;
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            alert('You have been logged out.');
            window.location.href = 'index.html';
        });
    }

    // --- Dashboard Logic ---
    const marketContainer = document.querySelector('.market-container');
    const chartContainer = document.getElementById('chart-container');
    const investModal = document.getElementById('invest-modal');
    const investModalContent = document.getElementById('invest-modal-content');
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true';

    function generateCoinSvg(symbol) {
        const cleanSymbol = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs><radialGradient id="grad-${cleanSymbol}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:#e94560;stop-opacity:0.5" /><stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" /></radialGradient></defs>
                <circle cx="50" cy="50" r="50" fill="url(#grad-${cleanSymbol})" />
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#f0f0f0" font-size="30" font-family="Roboto, sans-serif" font-weight="bold">${cleanSymbol}</text>
            </svg>
        `;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    function renderChart(coins) {
        const options = {
            chart: { type: 'area', height: 350, toolbar: { show: false }, zoom: { enabled: false } },
            series: [{ name: 'Price', data: coins[0].sparkline_in_7d.price }],
            xaxis: { type: 'datetime', labels: { style: { colors: '#a0a0a0' } } },
            yaxis: { labels: { style: { colors: '#a0a0a0' } } },
            tooltip: { theme: 'dark' },
            grid: { borderColor: '#555' },
            title: { text: `${coins[0].name} 7-Day Price Chart`, align: 'left', style: { color: '#fff' } },
            subtitle: { text: 'Potential earnings are influenced by market volatility.', align: 'left', style: { color: '#a0a0a0' } },
        };
        const chart = new ApexCharts(chartContainer, options);
        chart.render();
    }

    function displayCryptoData(coins) {
        marketContainer.innerHTML = '';
        coins.forEach((coin, index) => {
            const cryptoCard = document.createElement('div');
            cryptoCard.classList.add('crypto-card');
            cryptoCard.style.setProperty('--card-index', index);
            cryptoCard.innerHTML = `<div class="card-header"><img src="${generateCoinSvg(coin.symbol)}" alt="${coin.name} logo"><div class="name-symbol"><h3>${coin.name}</h3><p>${coin.symbol.toUpperCase()}</p></div></div><div class="card-body"><p class="price">$${coin.current_price.toLocaleString()}</p></div><button class="btn-invest" data-name="${coin.name}">Invest</button>`;
            marketContainer.appendChild(cryptoCard);
        });
        document.querySelectorAll('.btn-invest').forEach(button => {
            button.addEventListener('click', openInvestModal);
        });
    }

    function openInvestModal(event) {
        const cryptoName = event.target.dataset.name;
        investModalContent.innerHTML = `
            <span class="close-button">&times;</span>
            <h2>Invest in ${cryptoName}</h2>
            <form id="investment-form">
                <label for="amount">Amount (USD):</label>
                <input type="number" id="amount" name="amount" required min="1">
                <label for="payment-method">Payment Method:</label>
                <select id="payment-method" name="paymentMethod" required>
                    <option value="crypto">Crypto Wallet</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cashapp">Cash App</option>
                </select>
                <button type="submit">Finalize Investment</button>
            </form>
        `;
        investModal.style.display = 'flex';
        investModalContent.querySelector('.close-button').addEventListener('click', () => investModal.style.display = 'none');
        document.getElementById('investment-form').addEventListener('submit', handleInvestment);
    }

    function handleInvestment(e) {
        e.preventDefault();
        const amount = e.target.amount.value;
        alert(`Your investment of $${amount} has been processed!`);
        investModal.style.display = 'none';
    }

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            renderChart(data);
            displayCryptoData(data);
        } catch (error) {
            marketContainer.innerHTML = `<p>Could not load market data.</p>`;
        }
    }

    fetchData();
});
