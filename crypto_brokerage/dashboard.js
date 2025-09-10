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
    let currentChartType = 'area';
    let marketData = [];
    let ohlcData = [];
    let activeChart = null;
    const rate = 1.05;

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
    const withdrawBtn = document.getElementById('withdraw-btn');
    const marketContainer = document.querySelector('.market-container');
    const chartContainer = document.getElementById('chart-container');
    const chartTitleEl = document.getElementById('chart-title');
    const chartSubtitleEl = document.getElementById('chart-subtitle');
    const investModal = document.getElementById('invest-modal');
    const investModalContent = document.getElementById('invest-modal-content');
    const topUpModal = document.getElementById('top-up-modal');
    const topUpModalContent = document.getElementById('top-up-modal-content');
    const lineChartBtn = document.getElementById('line-chart-btn');
    const barChartBtn = document.getElementById('bar-chart-btn');
    const marketsApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
    const ohlcApiUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=7`;

    // --- Core Logic ---
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
        if (isNaN(amount) || amount <= 0) { return alert('Please enter a valid amount.'); }
        if (amount > currentUser.total_account_balance) { return alert('Insufficient funds.'); }
        const updatedUser = { ...currentUser, total_account_balance: currentUser.total_account_balance - amount, investment_balance: currentUser.investment_balance + amount };
        updateAllUserData(updatedUser);
        updateBalancesUI();
        alert(`Successfully invested $${amount}!`);
        investModal.style.display = 'none';
    }

    function handleWithdrawal() {
        const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!currentUser.investment_balance || currentUser.investment_balance <= 0) { return alert('No funds to withdraw.'); }
        const updatedUser = { ...currentUser, total_account_balance: currentUser.total_account_balance + currentUser.investment_balance, investment_balance: 0 };
        updateAllUserData(updatedUser);
        updateBalancesUI();
        alert('Investment balance withdrawn successfully!');
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
    function renderChart() { /* ... same as before ... */ }
    function displayCryptoData(coins) { /* ... same as before ... */ }
    function openInvestModal(event) { /* ... same as before ... */ }

    function openTopUpModal() {
        topUpModalContent.innerHTML = `
            <span class="close-button">&times;</span>
            <h2>Top Up Balance</h2>
            <form id="top-up-form">
                <label for="top-up-amount">Amount (USD):</label>
                <input type="number" id="top-up-amount" name="amount" required min="1" placeholder="e.g., 1000">
                <p class="modal-text">Select a payment gateway to add to your account balance and start making investments now.</p>
                <button type="submit">Top Up Now</button>
            </form>
        `;
        topUpModal.style.display = 'flex';
        topUpModalContent.querySelector('.close-button').addEventListener('click', () => topUpModal.style.display = 'none');
        document.getElementById('top-up-form').addEventListener('submit', handleTopUp);
    }

    async function fetchData() { /* ... same as before ... */ }

    // --- Event Listeners ---
    if (userNavBalance) { /* ... same as before ... */ }
    if (logoutBtn) { /* ... same as before ... */ }
    window.addEventListener('click', (e) => {
        if (userDropdown && userDropdown.style.display === 'block') { userDropdown.style.display = 'none'; }
        if (e.target == topUpModal) { topUpModal.style.display = "none"; }
    });
    if (withdrawBtn) { /* ... same as before ... */ }
    if (topUpBtn) { topUpBtn.addEventListener('click', openTopUpModal); }
    lineChartBtn.addEventListener('click', () => { /* ... same as before ... */ });
    barChartBtn.addEventListener('click', () => { /* ... same as before ... */ });

    // --- Initial Load ---
    updateBalancesUI();
    fetchData();
});
