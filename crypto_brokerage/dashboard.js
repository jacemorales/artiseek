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
    const chartTitleEl = document.getElementById('chart-title');
    const chartSubtitleEl = document.getElementById('chart-subtitle');
    const investModal = document.getElementById('invest-modal');
    const investModalContent = document.getElementById('invest-modal-content');
    const lineChartBtn = document.getElementById('line-chart-btn');
    const barChartBtn = document.getElementById('bar-chart-btn');
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true';

    // --- Core Functions ---
    function updateAllUserData(updatedUser) { /* ... same as before ... */ }
    function updateBalancesUI() { /* ... same as before ... */ }
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
        const investmentValueSeries = sparkline.map(price => (100 / initialPrice) * price * rate);

        let options = {
            chart: {
                height: 350,
                background: 'transparent',
                toolbar: { show: true, tools: { download: true, selection: true, zoom: true, zoomin: true, zoomout: true, pan: false, reset: true } },
                events: {
                    dataPointSelection: (event) => { event.preventDefault(); },
                    click: (event) => { event.preventDefault(); }
                }
            },
            dataLabels: { enabled: false },
            grid: { show: true, borderColor: 'rgba(255,255,255,0.3)', strokeDashArray: 2, yaxis: { lines: { show: true } } },
        };

        if (currentChartType === 'area') {
            chartTitleEl.textContent = `7-Day Performance of a $100 Investment in ${primaryCoin.name}`;
            chartSubtitleEl.textContent = 'Values include a 1.05x rate multiplier.';

            options.chart.type = 'area';
            options.series = [{ name: 'Investment Value', data: investmentValueSeries }];
            options.colors = ['#00FFAB'];
            options.stroke = { curve: 'smooth', width: 2 };
            options.fill = { type: "gradient", gradient: { shade: 'dark', type: "vertical", shadeIntensity: 0.5, gradientToColors: ['#00FFAB'], inverseColors: false, opacityFrom: 0.7, opacityTo: 0.2, stops: [0, 100] } };
            options.xaxis = { type: 'datetime', categories: primaryCoin.sparkline_in_7d.price.map((_,i) => Date.now() - (168-i)*3600*1000), labels: { style: { colors: '#a0a0a0' } } };
            options.yaxis = { labels: { formatter: (val) => `$${val.toFixed(2)}`, style: { colors: '#a0a0a0' } } };
            options.tooltip = { theme: 'dark', x: { format: 'dd MMM HH:mm' } };

        } else if (currentChartType === 'bar') {
            const barColors = investmentValueSeries.map((val, i) => {
                if (i === 0) return '#808080'; // Neutral for the first bar
                return val >= investmentValueSeries[i-1] ? '#00FFAB' : '#FF4D4D';
            });

            chartTitleEl.textContent = `7-Day Trend of a $100 Investment in ${primaryCoin.name}`;
            chartSubtitleEl.textContent = 'Green bars indicate an increase from the previous hour, red indicates a decrease.';

            options.chart.type = 'bar';
            options.series = [{ name: 'Investment Value', data: investmentValueSeries }];
            options.colors = barColors;
            options.plotOptions = { bar: { columnWidth: '80%', distributed: true } }; // Distributed for individual bar colors
            options.xaxis = { type: 'category', categories: investmentValueSeries.map((_, i) => `H${i+1}`), labels: { show: false } };
            options.yaxis = { labels: { formatter: (val) => `$${val.toFixed(2)}`, style: { colors: '#a0a0a0' } } };
            options.legend = { show: false };
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
        } catch (error) {
            // ...
        }
    }

    // --- Event Listeners ---
    // ...
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

    // --- Initial Load ---
    updateBalancesUI();
    fetchData();
});
