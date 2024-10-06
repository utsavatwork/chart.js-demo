fetch("https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata", {
    method: 'GET', mode: 'cors'
}).then((response) => {
    if (!response.ok) throw new Error('Something wrong with the response.');
    return response.json();
}).then((jsonData) => {
    const summaries = jsonData.stocksProfileData[0];
    const summaryMap = new Map();
    Object.keys(summaries).filter(key => !key.startsWith('_')).forEach(stock => {
        console.log(stock);
    });
}).catch((error) => {
    alert(error);
})