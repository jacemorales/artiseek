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
    const investmentBalanceEl = document.getElementById('investment-balance');
    const withdrawBtn = document.getElementById('withdraw-btn');
    const marketContainer = document.querySelector('.market-container');
    const chartContainer = document.getElementById('chart-container');
    const investModal = document.getElementById('invest-modal');
    const investModalContent = document.getElementById('invest-modal-content');
    const lineChartBtn = document.getElementById('line-chart-btn');
    const barChartBtn = document.getElementById('bar-chart-btn');
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true';

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

    function handleInvestment(e) { /* ... same as before ... */ }
    function handleWithdrawal() { /* ... same as before ... */ }

    // --- UI Rendering ---
    function renderChart() {
        chartContainer.innerHTML = '';
        if (!marketData || marketData.length === 0 || !marketData[0].sparkline_in_7d) {
            chartContainer.innerHTML = `<p class="no-investments">Market data currently unavailable.</p>`;
            return;
        }

        const primaryCoin = marketData[0];
        const sparkline = primaryCoin.sparkline_in_7d.price;
        const initialPrice = sparkline[0];

        // Transform price data into fictional $100 investment value
        const investmentValueSeries = sparkline.map(price => (100 / initialPrice) * price * rate);
        const currentInvestmentValue = investmentValueSeries[investmentValueSeries.length - 1];
        const trendIsUp = currentInvestmentValue >= (100 * rate);

        let chartColors = ['#C147E9']; // Default color for line chart
        if (currentChartType === 'bar') {
            chartColors = [trendIsUp ? '#00FFAB' : '#FF4D4D'];
        }

        let options = {
            chart: { type: currentChartType, height: 350, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent' },
            dataLabels: { enabled: false },
            series: [{ name: 'Investment Value', data: investmentValueSeries }],
            yaxis: { labels: { formatter: (val) => `$${val.toFixed(2)}`, style: { colors: '#a0a0a0' } } },
            grid: { show: true, borderColor: 'rgba(255,255,255,0.2)', strokeDashArray: 0, yaxis: { lines: { show: true } } },
            title: { text: `7-Day Performance of a $100 Investment in ${primaryCoin.name}`, align: 'left', style: { color: '#fff', fontSize: '16px' } },
            subtitle: { text: 'Values include a 1.05x rate multiplier.', align: 'left', style: { color: '#a0a0a0', fontSize: '14px' } },
            tooltip: { enabled: true, theme: 'dark', x: { show: false } },
            stroke: { curve: 'smooth', width: 2 },
            fill: { type: 'solid' },
            colors: chartColors,
        };

        if (currentChartType === 'area') {
            options.fill = { type: "gradient", gradient: { shade: 'dark', type: "vertical", shadeIntensity: 0.5, gradientToColors: chartColors, inverseColors: false, opacityFrom: 0.7, opacityTo: 0.2, stops: [0, 100] } };
            options.xaxis = { type: 'numeric', labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } };
        } else if (currentChartType === 'bar') {
            options.xaxis = { type: 'category', categories: sparkline.map((_, i) => i), labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } };
        }

        const chart = new ApexCharts(chartContainer, options);
        chart.render();
    }

    function displayCryptoData(coins) { /* ... same as before ... */ }
    function openInvestModal(event) { /* ... same as before ... */ }

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('API Error');
            marketData = await response.json();
            renderChart();
            displayCryptoData(marketData);
            console.log("Market data updated.");
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }

    // --- Initial Setup & Event Listeners ---
    if (userNavBalance) { /* ... same as before ... */ }
    if (logoutBtn) { /* ... same as before ... */ }
    window.addEventListener('click', () => { /* ... same as before ... */ });
    if (withdrawBtn) { /* ... same as before ... */ }
    lineChartBtn.addEventListener('click', () => {
        currentChartType = 'area';
        lineChartBtn.classList.add('active');
        barChartBtn.classList.remove('active');
        renderChart();
    });
    barChartBtn.addEventListener('click', () => {
        currentChartType = 'bar';
        barChartBtn.classList.add('active');
        lineChartBtn.classList.remove('active');
        renderChart();
    });

    updateBalancesUI();
    fetchData(); // Initial fetch
    setInterval(fetchData, 60000); // Re-fetch every 60 seconds
});
