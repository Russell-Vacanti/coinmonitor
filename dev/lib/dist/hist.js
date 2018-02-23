var coinChart = null;
var coinTime = 'm';

const makeChart = (data, labels, typ) => {
  if (coinChart) {
    coinChart.destroy();
    coinChart = null;
  }
  var chartData = {
    labels: labels,
    datasets: [{
      label: "Price",
      data: data,
      backgroundColor: coinColors[typ]['background'],
      borderColor: coinColors[typ]['border']
    }]
  };
  var ctx = document.getElementById('coinChart');
  var options = {}
  coinChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        xAxes: [{
          display: false
        }]
      },
      legend: {
        display: false
      }
    }
  });
}

const initCoinChart = (typ) => {
  inquire(typ, 'hist', (result) => {
    data = result['Data'];
    var prices = [];
    var labelData = [];
    for (var i = 0; i < data.length; i += 1) {
      prices.push(data[i]['high']);
      labelData.push("Timestamp: " + data[i]['time']);
    }
    makeChart(prices, labelData, typ);
  });
}

const changeGraphTime = (newTime) => {
  getData('HIST', (oldtime) => {
    document.getElementById(coinHistTypes[oldtime][1]).parentNode.className = "btn btn-outline-info";
    document.getElementById(coinHistTypes[newTime][1]).parentNode.className = "btn btn-outline-info active";
    saveData('HIST', newTime);
    coinTime = newTime;
  });
  getData('COIN', (re) => {
    changeTab(re, forceUpdate = true);
  });
}