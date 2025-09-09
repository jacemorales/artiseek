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
        userNavBalance.innerHTML = `Balance: $${loggedInUser.total_account_balance.toLocaleString()} <span class="arrow">&#9662;</span>`;
        investmentBalanceEl.textContent = `$${loggedInUser.investment_balance.toLocaleString()}`;
    }

    function handleInvestment(e) {
        e.preventDefault();
        const amount = parseFloat(e.target.amount.value);
        if (isNaN(amount) || amount <= 0) { return alert('Please enter a valid amount.'); }
        if (amount > loggedInUser.total_account_balance) { return alert('Insufficient funds.'); }

        const updatedUser = {
            ...loggedInUser,
            total_account_balance: loggedInUser.total_account_balance - amount,
            investment_balance: loggedInUser.investment_balance + amount
        };

        updateAllUserData(updatedUser);
        updateBalancesUI();
        alert(`Successfully invested $${amount}!`);
        investModal.style.display = 'none';
        // Re-render chart with new investment data
        renderChart();
    }

    function handleWithdrawal() {
        if (loggedInUser.investment_balance <= 0) { return alert('No funds to withdraw.'); }
        const updatedUser = {
            ...loggedInUser,
            total_account_balance: loggedInUser.total_account_balance + loggedInUser.investment_balance,
            investment_balance: 0
        };
        updateAllUserData(updatedUser);
        updateBalancesUI();
        alert('Investment balance withdrawn successfully!');
        renderChart();
    }

    // --- UI Rendering ---
    function renderChart() {
        chartContainer.innerHTML = '';
        if (loggedInUser.investment_balance <= 0) {
            chartContainer.innerHTML = `<p class="no-investments">No active investments</p>`;
            return;
        }
        // For demo, chart shows a fictional projection based on investment balance
        const seriesData = [
            loggedInUser.investment_balance * 0.98,
            loggedInUser.investment_balance * 1.02,
            loggedInUser.investment_balance * 1.01,
            loggedInUser.investment_balance * 1.05,
            loggedInUser.investment_balance * 1.03,
            loggedInUser.investment_balance * 1.08,
            loggedInUser.investment_balance * 1.12,
        ];
        const options = {
            chart: { type: 'area', height: 350, toolbar: { show: false }, zoom: { enabled: false } },
            series: [{ name: 'Investment Value', data: seriesData }],
            xaxis: { labels: { style: { colors: '#a0a0a0' } } },
            yaxis: { labels: { formatter: (val) => `$${val.toLocaleString()}`, style: { colors: '#a0a0a0' } } },
            tooltip: { theme: 'dark' },
            grid: { borderColor: '#555' },
            title: { text: `Investment Projection`, align: 'left', style: { color: '#fff' } },
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
                <input type="number" id="amount" name="amount" required min="1" max="${loggedInUser.total_account_balance}">
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

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            displayCryptoData(data);
        } catch (error) {
            marketContainer.innerHTML = `<p>Could not load market data.</p>`;
        }
    }

    // --- Initial Setup & Event Listeners ---
    dropdownFullname.textContent = loggedInUser.fullName;
    dropdownEmail.textContent = loggedInUser.email;
    userNavBalance.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
    });
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        alert('You have been logged out.');
        window.location.href = 'index.html';
    });
    window.addEventListener('click', () => {
        if (userDropdown && userDropdown.style.display === 'block') {
            userDropdown.style.display = 'none';
        }
    });
    withdrawBtn.addEventListener('click', handleWithdrawal);

    updateBalancesUI();
    renderChart();
    fetchData();
});
