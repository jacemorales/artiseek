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
    // --- State ---
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let marketData = [];
    let activeChart = null;

    // --- Route Guard ---
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
    const topUpBtn = document.getElementById('top-up-btn');
    const investmentBalanceEl = document.getElementById('investment-balance');
    const marketContainer = document.querySelector('.market-container');
    const chartContainer = document.getElementById('chart-container');
    const chartTitleEl = document.getElementById('chart-title');
    const chartSubtitleEl = document.getElementById('chart-subtitle');
    const investModal = document.getElementById('invest-modal');
    const investModalContent = document.getElementById('invest-modal-content');
    const topUpModal = document.getElementById('top-up-modal');
    const topUpModalContent = document.getElementById('top-up-modal-content');
    const investmentsListContainer = document.getElementById('investments-list-container');
    const marketsApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

    // --- Core Functions ---
    function updateAllUserData(updatedUser) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        let allUsers = JSON.parse(localStorage.getItem('cryptoUsers'));
        const userIndex = allUsers.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) { allUsers[userIndex] = updatedUser; localStorage.setItem('cryptoUsers', JSON.stringify(allUsers)); }
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
        const duration = parseInt(e.target.duration.value, 10);
        const coinName = e.target.dataset.coinName;

        if (isNaN(amount) || amount <= 0) {
            return alert('Please enter a valid amount.');
        }
        if (amount > currentUser.total_account_balance) {
            return alert('Insufficient funds.');
        }

        const purchaseDate = new Date();
        const maturityDate = new Date(purchaseDate);
        maturityDate.setDate(purchaseDate.getDate() + duration);

        const newInvestment = {
            id: Date.now(),
            coinName: coinName,
            amount: amount,
            purchaseDate: purchaseDate.toISOString(),
            duration: duration,
            maturityDate: maturityDate.toISOString(),
            status: 'active'
        };

        const updatedUser = {
            ...currentUser,
            total_account_balance: currentUser.total_account_balance - amount,
            investment_balance: (currentUser.investment_balance || 0) + amount,
            investments: [...(currentUser.investments || []), newInvestment]
        };

        updateAllUserData(updatedUser);
        updateBalancesUI();
        renderChart();
        renderInvestments();
        alert(`Successfully invested $${amount} in ${coinName} for ${duration} days!`);
        investModal.style.display = 'none';
    }


    function handleTopUp(e) {
        e.preventDefault();
        const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const amount = parseFloat(e.target.amount.value);
        if (isNaN(amount) || amount <= 0) { return alert('Please enter a valid amount.'); }
        const updatedUser = { ...currentUser, total_account_balance: currentUser.total_account_balance + amount };
        updateAllUserData(updatedUser);
        updateBalancesUI();
        alert(`Successfully topped up $${amount}!`);
        topUpModal.style.display = 'none';
    }

    // --- UI Rendering ---
    function renderChart() {
        if (activeChart) {
            activeChart.destroy();
        }
        chartContainer.innerHTML = ''; // Explicitly clear the container

        const investments = loggedInUser.investments || [];
        const activeInvestments = investments.filter(inv => inv.status === 'active');

        if (activeInvestments.length === 0) {
            chartTitleEl.textContent = 'Your Portfolio';
            chartSubtitleEl.textContent = 'Make an investment to see your portfolio breakdown.';
            chartContainer.innerHTML = `<p class="no-investments">No active investments to display.</p>`;
            return;
        }

        const portfolio = activeInvestments.reduce((acc, investment) => {
            if (!acc[investment.coinName]) {
                acc[investment.coinName] = 0;
            }
            acc[investment.coinName] += investment.amount;
            return acc;
        }, {});

        const chartData = Object.values(portfolio);
        const chartLabels = Object.keys(portfolio);

        chartTitleEl.textContent = 'Your Portfolio Allocation';
        chartSubtitleEl.textContent = 'Distribution of your total invested capital.';

        const options = {
            chart: { type: 'pie', height: 350, background: 'transparent', toolbar: { show: true, tools: { download: true } } },
            series: chartData,
            labels: chartLabels,
            colors: ['#00FFAB', '#00E396', '#00D482', '#00C56E', '#00B65A'],
            legend: { position: 'bottom', labels: { colors: '#a0a0a0' } },
            responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
        };

        activeChart = new ApexCharts(chartContainer, options);
        activeChart.render();
    }

    function formatTimeRemaining(maturityDate) {
        const now = new Date();
        const maturity = new Date(maturityDate);
        const diff = maturity - now;

        if (diff <= 0) {
            return '<span class="status-matured">Matured</span>';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `<span class="status-active">${days}d ${hours}h ${minutes}m remaining</span>`;
    }

    function renderInvestments() {
        if (!investmentsListContainer) return;

        const investments = loggedInUser.investments || [];
        investmentsListContainer.innerHTML = '';

        if (investments.filter(inv => inv.status === 'active').length === 0) {
            investmentsListContainer.innerHTML = '<p class="no-investments">You have no active investments.</p>';
            return;
        }

        investments.forEach(investment => {
            if (investment.status !== 'active') return;

            const card = document.createElement('div');
            card.classList.add('investment-card');
            const now = new Date();
            const maturity = new Date(investment.maturityDate);
            const isMatured = now >= maturity;

            card.innerHTML = `
                <div class="investment-card-header">
                    <h3>${investment.coinName}</h3>
                    <p>$${investment.amount.toLocaleString()}</p>
                </div>
                <div class="investment-card-body">
                    <p>Matures on: ${maturity.toLocaleDateString()}</p>
                    <div class="investment-status">
                        ${formatTimeRemaining(investment.maturityDate)}
                    </div>
                </div>
                <div class="investment-card-footer">
                    <button class="btn-withdraw-investment" data-id="${investment.id}" ${!isMatured ? 'disabled' : ''}>
                        Withdraw
                    </button>
                </div>
            `;
            investmentsListContainer.appendChild(card);
        });

        document.querySelectorAll('.btn-withdraw-investment').forEach(button => {
            button.addEventListener('click', handleSpecificWithdrawal);
        });
    }

    function handleSpecificWithdrawal(e) {
        const investmentId = parseInt(e.target.dataset.id, 10);
        const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const investmentIndex = currentUser.investments.findIndex(inv => inv.id === investmentId);

        if (investmentIndex === -1) {
            return alert('Error: Investment not found.');
        }

        const investment = currentUser.investments[investmentIndex];

        const updatedUser = {
            ...currentUser,
            total_account_balance: currentUser.total_account_balance + investment.amount,
            investment_balance: currentUser.investment_balance - investment.amount,
            investments: currentUser.investments.map(inv => inv.id === investmentId ? {...inv, status: 'withdrawn'} : inv)
        };

        updateAllUserData(updatedUser);
        updateBalancesUI();
        renderChart();
        renderInvestments();
        alert(`Successfully withdrew $${investment.amount} from your ${investment.coinName} investment.`);
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
            <form id="investment-form" data-coin-name="${cryptoName}">
                <label for="amount">Amount (USD):</label>
                <input type="number" id="amount" name="amount" required min="1" max="${loggedInUser.total_account_balance}" placeholder="e.g., 500">

                <label>Investment Duration:</label>
                <div class="duration-options">
                    <input type="radio" id="7-days" name="duration" value="7" checked>
                    <label for="7-days">7 Days</label>
                    <input type="radio" id="30-days" name="duration" value="30">
                    <label for="30-days">30 Days</label>
                    <input type="radio" id="90-days" name="duration" value="90">
                    <label for="90-days">90 Days</label>
                </div>

                <p class="modal-text">Invest big invest now and see what the future market holds for u</p>
                <button type="submit">Finalize Investment</button>
            </form>
        `;
        investModal.style.display = 'flex';
        investModalContent.querySelector('.close-button').addEventListener('click', () => investModal.style.display = 'none');
        document.getElementById('investment-form').addEventListener('submit', handleInvestment);
    }

    function openTopUpModal() {
        topUpModalContent.innerHTML = `
            <span class="close-button">&times;</span>
            <h2>Top Up Balance</h2>
            <form id="top-up-form">
                <label for="top-up-amount">Amount (USD):</label>
                <input type="number" id="top-up-amount" name="amount" required min="1" placeholder="e.g., 1000">
                <label for="payment-method">Payment Method:</label>
                <select id="payment-method" name="paymentMethod" required>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="tron">Tron</option>
                    <option value="solana">Solana</option>
                    <option value="litecoin">Litecoin</option>
                    <option value="stripe">Stripe</option>
                </select>
                <p class="modal-text">Add to account balance and start making investments now.</p>
                <button type="submit">Top Up Now</button>
            </form>
        `;
        topUpModal.style.display = 'flex';
        topUpModalContent.querySelector('.close-button').addEventListener('click', () => topUpModal.style.display = 'none');
        document.getElementById('top-up-form').addEventListener('submit', handleTopUp);
    }

    async function fetchData() {
        try {
            const marketsResponse = await fetch(marketsApiUrl);
            if (!marketsResponse.ok) throw new Error('API Error');
            marketData = await marketsResponse.json();

            renderChart();
            renderInvestments();
            displayCryptoData(marketData);
        } catch (error) {
            marketContainer.innerHTML = `<p>Could not load market data.</p>`;
            chartContainer.innerHTML = `<p class="no-investments">Could not load chart data.</p>`;
        }
    }

    // --- Event Listeners ---
    if (userNavBalance) {
        dropdownFullname.textContent = loggedInUser.fullName;
        dropdownEmail.textContent = loggedInUser.email;
        userNavBalance.addEventListener('click', (e) => { e.stopPropagation(); userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none'; });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => { sessionStorage.removeItem('loggedInUser'); alert('You have been logged out.'); window.location.href = 'index.html'; });
    }
    if (topUpBtn) {
        topUpBtn.addEventListener('click', openTopUpModal);
    }
    window.addEventListener('click', (e) => {
        if (userDropdown && userDropdown.style.display === 'block') { userDropdown.style.display = 'none'; }
        if (e.target == topUpModal) { topUpModal.style.display = 'none'; }
    });

    // --- Initial Load ---
    updateBalancesUI();
    fetchData();
    // Set interval to update countdowns
    setInterval(renderInvestments, 60000); // Update every minute
});
