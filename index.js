const ctx = document.getElementById('canvas');
const drnsDiv = document.getElementById('chart-durns');
const drnsSet = new Set();

fetch('https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata', {
    method: 'GET', mode: 'cors'
}).then((response) => {
    if (response.ok) {
        return response.json();
    }
}).then((jsonBody) => {
    const stocksData = jsonBody.stocksData[0];

    let labels = [];
    let datasets = [];
    const chartData = {};

    Object.keys(stocksData).filter(key => !key.startsWith('_')).forEach((key) => {
        const stockName = key;
        const stockData = stocksData[`${key}`];

        // console.log(stockData);
        const drns = Object.keys(stockData);
        
        drns.filter(key => !key.startsWith('_')).forEach(drn => {
            // labels.push(...stockData[`${drn}`].timeStamp);
            drnsSet.add(drn);

            labels = stockData[`${drn}`].timeStamp.map(stamp => new Date(stamp * 1000).toLocaleDateString());

            const data = {
                label: `${key} - ${drn}`,
                data: stockData[`${drn}`].value,
                fill: false
            }
            // datasets.push(data);
            datasets = [data];
        });
        // console.log(stockData);
        // labels.push(...stockData['1mo'].timeStamp);
        // labels.push(...stockData['3mo'].timeStamp);
        // labels.push(...stockData['1y'].timeStamp);
        // labels.push(...stockData['5y'].timeStamp);

        // console.log(stocksData[`${stock}`]);
        // console.log('-----------------------------------');
    });

    drnsSet.forEach(drn => {
        const span = document.createElement('span');
        span.textContent = drn;
        span.className = 'drn-label';
        drnsDiv.appendChild(span);
    });

    chartData.labels = labels;
    chartData.datasets = datasets;

    // const labels = Object.keys(stocksData);
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales:{
                x: {
                    display: false 
                }
            }
        }
    });

    // chart.config._config.data.datasets[0].label = 'Teststs';
    // console.log(chart.config._config.data.labels);
}).catch((error) => {
    alert(error);
    console.log(error);
});