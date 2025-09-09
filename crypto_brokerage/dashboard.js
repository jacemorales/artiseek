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

document.addEventListener('DOMContentLoaded', () => {
    // --- Route Guard & User Data ---
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('You must be logged in to view this page.');
        window.location.href = 'index.html';
        return;
    }

    // --- DOM Elements ---
    const userNavBalance = document.getElementById('user-nav-balance');
    const userDropdown = document.getElementById('user-dropdown');
    const dropdownFullname = document.getElementById('dropdown-fullname');
    const dropdownEmail = document.getElementById('dropdown-email');
    const logoutBtn = document.getElementById('logout-btn');
    const investmentBalanceEl = document.getElementById('investment-balance');
    const withdrawBtn = document.getElementById('withdraw-btn');
    const marketContainer = document.querySelector('.market-container');
    const chartContainer = document.getElementById('chart-container');
    const investModal = document.getElementById('invest-modal');
    const investModalContent = document.getElementById('invest-modal-content');
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true';

    // --- Core Functions ---
    function updateAllUserData(updatedUser) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        let allUsers = JSON.parse(localStorage.getItem('cryptoUsers'));
        const userIndex = allUsers.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            localStorage.setItem('cryptoUsers', JSON.stringify(allUsers));
        }
        loggedInUser = updatedUser;
    }

    function updateBalancesUI() {
        const totalBalance = loggedInUser.total_account_balance || 0;
        const investmentBalance = loggedInUser.investment_balance || 0;
        userNavBalance.innerHTML = `Balance: $${totalBalance.toLocaleString()} <span class="arrow">&#9662;</span>`;
        investmentBalanceEl.textContent = `$${investmentBalance.toLocaleString()}`;
    }

    function handleInvestment(e) {
        e.preventDefault();
        const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const amount = parseFloat(e.target.amount.value);
        if (isNaN(amount) || amount <= 0) { return alert('Please enter a valid amount.'); }
        if (amount > currentUser.total_account_balance) { return alert('Insufficient funds.'); }

        const updatedUser = {
            ...currentUser,
            total_account_balance: currentUser.total_account_balance - amount,
            investment_balance: currentUser.investment_balance + amount
        };

        updateAllUserData(updatedUser);
        updateBalancesUI();
        alert(`Successfully invested $${amount}!`);
        investModal.style.display = 'none';
        fetchData(true); // Re-fetch to update chart
    }

    function handleWithdrawal() {
        const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!currentUser.investment_balance || currentUser.investment_balance <= 0) { return alert('No funds to withdraw.'); }
        const updatedUser = {
            ...currentUser,
            total_account_balance: currentUser.total_account_balance + currentUser.investment_balance,
            investment_balance: 0
        };
        updateAllUserData(updatedUser);
        updateBalancesUI();
        alert('Investment balance withdrawn successfully!');
        renderChart(); // Re-render chart with 0 balance
    }

    // --- UI Rendering ---
    function renderChart(coins) {
        chartContainer.innerHTML = '';
        if (!coins || coins.length === 0 || !coins[0].sparkline_in_7d) {
            chartContainer.innerHTML = `<p class="no-investments">Market data currently unavailable.</p>`;
            return;
        }

        const primaryCoin = coins[0];
        const sparkline = primaryCoin.sparkline_in_7d.price;
        const minPrice = Math.min(...sparkline);
        const maxPrice = Math.max(...sparkline);
        const initialPrice = sparkline[0];
        const currentPrice = sparkline[sparkline.length - 1];
        const earnings = (100 / initialPrice) * currentPrice;
        const earningsText = `A $100 investment 7d ago would be worth ~$${earnings.toFixed(2)} today.`;

        const options = {
            chart: { type: 'area', height: 350, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent' },
            series: [{ name: 'Price (USD)', data: sparkline }],
            xaxis: { type: 'numeric', labels: { show: false } },
            yaxis: { labels: { formatter: (val) => `$${val.toLocaleString()}`, style: { colors: '#a0a0a0' } } },
            tooltip: { theme: 'dark', x: { show: false } },
            grid: { borderColor: 'rgba(255,255,255,0.1)' },
            title: { text: `${primaryCoin.name} 7-Day Price Chart`, align: 'left', style: { color: '#fff', fontSize: '16px' } },
            subtitle: { text: earningsText, align: 'left', style: { color: '#00FFAB', fontSize: '14px' } },
            fill: { type: "gradient", gradient: { shade: 'dark', type: "vertical", shadeIntensity: 0.5, gradientToColors: ['#00FFAB'], inverseColors: true, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } },
            stroke: { curve: 'smooth', width: 2, colors: ['#C147E9'] },
            annotations: {
                points: [
                    { x: sparkline.indexOf(minPrice), y: minPrice, marker: { size: 6, fillColor: '#fff', strokeColor: '#FF4D4D', radius: 2 }, label: { borderColor: '#FF4D4D', text: `7d Low: $${minPrice.toFixed(2)}` } },
                    { x: sparkline.indexOf(maxPrice), y: maxPrice, marker: { size: 6, fillColor: '#fff', strokeColor: '#00FFAB', radius: 2 }, label: { borderColor: '#00FFAB', text: `7d High: $${maxPrice.toFixed(2)}` } }
                ]
            }
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
        document.querySelectorAll('.btn-invest').forEach(button => button.addEventListener('click', openInvestModal));
    }

    function openInvestModal(event) {
        const cryptoName = event.target.dataset.name;
        investModalContent.innerHTML = `
            <span class="close-button">&times;</span>
            <h2>Invest in ${cryptoName}</h2>
            <form id="investment-form">
                <label for="amount">Amount (USD):</label>
                <input type="number" id="amount" name="amount" required min="1" max="${loggedInUser.total_account_balance}" placeholder="e.g., 500">
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

    async function fetchData(isUpdate = false) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            if (!isUpdate) { // Only render market list on initial load
                displayCryptoData(data);
            }
            renderChart(data);
        } catch (error) {
            marketContainer.innerHTML = `<p>Could not load market data.</p>`;
            chartContainer.innerHTML = `<p>Could not load chart data.</p>`;
        }
    }

    // --- Initial Setup & Event Listeners ---
    if (userNavBalance) {
        dropdownFullname.textContent = loggedInUser.fullName;
        dropdownEmail.textContent = loggedInUser.email;
        userNavBalance.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            alert('You have been logged out.');
            window.location.href = 'index.html';
        });
    }
    window.addEventListener('click', () => {
        if (userDropdown && userDropdown.style.display === 'block') {
            userDropdown.style.display = 'none';
        }
    });
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', handleWithdrawal);
    }

    updateBalancesUI();
    fetchData();
});
