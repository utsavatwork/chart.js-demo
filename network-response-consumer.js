const fetchRequest = (url) => {
    return fetch(url, {method: 'GET', mode: 'cors'}).then((response) => {
        if (response.ok) {
            return response.json();
        }
    });
}

const fetchStocksData = () => {
    return fetchRequest('https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata');
}

const fetchStocksSummary = () => {
    return fetchRequest('https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata');
}

const fetchStocksStats = () => {
    return fetchRequest('https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata');
}

const ctx = document.getElementById('canvas');
const drnsDiv = document.getElementById('chart-durns');
const summaryDiv = document.getElementById('summary');
const stocks = [];
const durns = [];
const labels = [];
const datasets = [];
const summary = [];
const stats = [];

const state = {
    stockId: 0,
    durationId: 0 
};

Promise.all([fetchStocksData(), fetchStocksStats(), fetchStocksSummary()]).then((response) => {
    const stocksData = response[0].stocksData[0];
    const statsData = response[1].stocksStatsData[0];
    const summaryData = response[2].stocksProfileData[0];
    Object.keys(stocksData).filter(key => !key.startsWith('_')).forEach((key) => {
        stocks.push(key);
        stats.push(statsData[key]);
        summary.push(summaryData[key]);
        const stockData = stocksData[`${key}`];
        const drns = Object.keys(stockData);        
        const dataDurns = [];
        drns.filter(key => !key.startsWith('_')).forEach(drn => {
            if (!durns.includes(drn)) durns.push(drn);
            labels.push(stockData[`${drn}`].timeStamp.map(
                stamp => new Date(stamp * 1000).toLocaleDateString()));
            dataDurns.push(stockData[`${drn}`].value);
        });
        datasets.push(dataDurns);
    });    
}).then(() => {
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels[state.stockId],
            datasets: [{
                label: `${stocks[state.stockId]} - ${durns[state.durationId]}`,
                data: datasets[state.stockId][state.durationId],
                fill: false
            }]
        },
        options: {
            scales:{
                x: {
                    display: false 
                }
            }
        }
    });

    durns.forEach((drn, index) => {
        const btn = document.createElement('button');
        btn.textContent = drn;
        btn.setAttribute('data-id', index);
        btn.className = 'drn-label';
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            state.durationId = Number(event.target.getAttribute('data-id'));
            chart.config._config.data.datasets[0].label = `${stocks[state.stockId]} - ${durns[state.durationId]}`;
            chart.config._config.data.datasets[0].data = datasets[state.stockId][state.durationId];
            chart.update();
        });
        drnsDiv.appendChild(btn);
    });

    summaryDiv.textContent = summary[state.stockId].summary;

    const stocksList = document.getElementById('stocks-list');
    stocks.forEach((stock, id) => {
        const item = document.createElement('li');
        item.setAttribute('data-id', id);
        const statsData = stats.at(id);
        const trendIcon = statsData.profit > 0 ? 'arrow_upward' : 
            (statsData.profit === 0 ? '' : 'arrow_downward');
        item.innerHTML = `<i class="material-symbols-outlined tiny right">${trendIcon}</i>
            <span><b>${stock}</b> (${Number(statsData.profit).toFixed(2)}) <br> &nbsp;
            ${statsData.bookValue}</span>`;
        item.addEventListener('click', (event) => {
            event.preventDefault();
            state.stockId = Number(event.target.getAttribute('data-id'));
            chart.config._config.data.labels = labels[state.stockId];
            chart.config._config.data.datasets[0].label = `${stocks[state.stockId]} - ${durns[state.durationId]}`;
            chart.config._config.data.datasets[0].data = datasets[state.stockId][state.durationId];
            chart.update();
            summaryDiv.textContent = summary[state.stockId].summary;
        });
        stocksList.appendChild(item);
    });
}) .catch((error) => {
    console.log(error);
});