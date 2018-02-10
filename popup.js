const coinNames = {
  "BTC": "Bitcoin",
  "BCH": "Bitcoin Cash",
  "LTC": "Litecoin",
  "ETH": "Ethereum"
};

const coinHistTypes = {
  'm': 'minute',
  'h': 'hour',
  'd': 'day'
};

const coinColors = {
  "BTC": {
    'border': 'rgb(93, 173, 226)',
    'background': 'rgb(174, 214, 241)'
  },
  "BCH": {
    'border': 'rgb(165, 105, 189)',
    'background': 'rgb(210, 180, 222)'
  },
  "LTC": {
    'border': 'rgb(244, 208, 63)',
    'background': 'rgb(249, 231, 159)'

  },
  "ETH": {
    'border': 'rgb(86, 101, 115)',
    'background': 'rgb(171, 178, 185)'

  }
}

var coinChart = null;
var coinDiff = 0;
var coinBuy = 0;
var coinTime = 'm';

const inquire = (cat, tp, callback) => {
  var apiUrl = "https://min-api.cryptocompare.com/data/";
  if (tp == 'price') {
    apiUrl = apiUrl + "price?fsym=" + cat + "&tsyms=" + cat + ",USD";
  } else if (tp == 'hist') {
    getData('HIST', (re) => {
      coinTime = re;
    });
    apiUrl = apiUrl + "histo" + coinHistTypes[coinTime] + "?fsym=" + cat + "&tsym=USD&limit=60&aggregate=3&e=CCCAGG";
  }
  $.ajax({
    async: true,
    type: "GET",
    url: apiUrl,
    success: function(result) {
      callback(result);
    }
  });
}

const getData = (key, callback) => {
  chrome.storage.sync.get('COINMONITOR-' + key, (items) => {
    callback(items['COINMONITOR-' + key]);
  });
}

const saveData = (key, data) => {
  var items = {};
  items['COINMONITOR-' + key] = data;
  chrome.storage.sync.set(items);
}

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

const getPriceData = (typ) => {
  inquire(typ, 'price', (result) => {
    data = result['USD'];
    document.getElementById("coinBuy").innerText = "$" + data;
    coinBuy = parseFloat(data);
  });
  inquire(typ, 'hist', (result) => {
    data = result['Data'];
    var prices = [];
    var labelData = [];
    for (var i = 0; i < data.length; i += 1) {
      prices.push(data[i]['high']);
      labelData.push(data[i]['time']);
    }
    makeChart(prices, labelData, typ);
  });
}

const changeGraphTime = (newTime) => {
  saveData('HIST', newTime);
  coinTime = newTime;
  getData('COIN', (re) => {
    changeTab(re);
  });
}

const updateSettingsCard = (typ) => {
  document.getElementById('card-coin').style.display = 'none';
  document.getElementById('card-settings').style.display = 'block';

}

const updateCoinCard = (typ) => {
  document.getElementById('card-coin').style.display = 'block';
  document.getElementById('card-settings').style.display = 'none';
  getPriceData(typ);

  if (0 < coinDiff) {
    document.getElementById("coinStatus").className = "alert alert-success";
  } else if (coinDiff > 0) {
    document.getElementById("coinStatus").className = "alert alert-danger";
  } else {
    document.getElementById("coinStatus").className = "alert alert-warning";
  }
}

const changeTab = (typ) => {
  var old = null;
  getData('COIN', (re) => {
    old = re
    if (typ !== old) {
      document.getElementById(re).className = "nav-link";
    }
  });

  document.getElementById(typ).className = "nav-link disabled";
  if (typ !== old) {
    saveData('COIN', typ);
    if (typ == 'SET') {
      updateSettingsCard(typ);
    } else {
      updateCoinCard(typ);
    }
  }
}

const saveSettings = () => {
  saveData('DEF-COIN', document.getElementById('set-pageOpen').value);
}

const addListeners = () => {
  //add listeners for coin tabs
  document.getElementById('BTC').addEventListener('click', () => {
    changeTab('BTC')
  });
  document.getElementById('BCH').addEventListener('click', () => {
    changeTab('BCH')
  });
  document.getElementById('LTC').addEventListener('click', () => {
    changeTab('LTC')
  });
  document.getElementById('ETH').addEventListener('click', () => {
    changeTab('ETH')
  });
  document.getElementById('SET').addEventListener('click', () => {
    changeTab('SET')
  });
  //add listeners for graph
  document.getElementById('histM').addEventListener('click', () => {
    changeGraphTime('m')
  });
  document.getElementById('histH').addEventListener('click', () => {
    changeGraphTime('h')
  });
  document.getElementById('histD').addEventListener('click', () => {
    changeGraphTime('d')
  });
  //button to open cryptocompare
  document.getElementById('coinTab').addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://www.cryptocompare.com/'
    });
  });
  //button to save settings
  document.getElementById('saveSettings').addEventListener('click', () => {
    saveSettings();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  saveData('COIN', 'LTC');
  saveData('HIST', 'm');

  addListeners();
  getData('DEF-COIN', (typ) => {
    if (typ == undefined) {
      saveData('DEF-COIN', 'BTC');
      changeTab('BTC');
    } else {
      changeTab(typ);
    }
  });
});