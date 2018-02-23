var coinChart = null;
var coinDiff = 0;
var coinBuy = 0;
var coinTime = 'm';

var coinTabs = ['BTC', 'BCH', 'LTC', 'ETH', 'SET'];

const saveTabTo = (num) => {
  var coinID = document.getElementById("t" + num).value;
  for (var i = 0; i < coinIDs; i++) {
    if (coinIDs[i] == coinID) {
      saveData('TAB-' + num, coinNames[i]);
      coinTabs[num] = coinNames[i];
    }
  }
  document.getElementById("c" + num).innerText = coinNames[coinID];
}

const inquire = (cat, tp, callback) => {
  var apiUrl = "https://min-api.cryptocompare.com/data/";
  if (tp == 'price') {
    apiUrl = apiUrl + "price?fsym=" + cat + "&tsyms=" + cat + ",USD";
  } else if (tp == 'hist') {
    getData('HIST', (re) => {
      coinTime = re;
    });
    apiUrl = apiUrl + "histo" + coinHistTypes[coinTime][0] + "?fsym=" + cat + "&tsym=USD&limit=60&aggregate=3&e=CCCAGG";
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

const changeTab = (typ, forceUpdate = false) => {
  console.log(typ);
  console.log(coinTabs[parseFloat(typ)]);
  var old = null;
  getData('COIN', (re) => {
    old = re;
    if (typ !== old) {
      document.getElementById("c" + re).className = "nav-link";
    }
    document.getElementById("c" + typ).className = "nav-link disabled"; //border-top border-left border-right";
    saveData('COIN', typ);
    if (typ !== old || forceUpdate) {
      if (coinTabs[parseFloat(typ)] == 'SET') {
        updateSettingsCard(coinTabs[parseFloat(typ)]);
      } else {
        updateCoinCard(coinTabs[parseFloat(typ)]);
      }
    }
  });
}

const saveSettings = () => {
  saveData('DEF-COIN', document.getElementById('set-pageOpen').value);
}

const addListeners = () => {
  //add listeners for coin tabs
  document.getElementById('c0').addEventListener('click', () => {
    changeTab('0');
  });
  document.getElementById('c1').addEventListener('click', () => {
    changeTab('1');
  });
  document.getElementById('c2').addEventListener('click', () => {
    changeTab('2');
  });
  document.getElementById('c3').addEventListener('click', () => {
    changeTab('3');
  });
  document.getElementById('c4').addEventListener('click', () => {
    changeTab('4');
  });
  //add listeners for graph
  document.getElementById('histM').addEventListener('click', () => {
    changeGraphTime('m');
  });
  document.getElementById('histH').addEventListener('click', () => {
    changeGraphTime('h');
  });
  document.getElementById('histD').addEventListener('click', () => {
    changeGraphTime('d');
  });
  //button to open cryptocompare
  document.getElementById('coinTab').addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://www.cryptocompare.com/'
    });
  });
  //button to open github
  document.getElementById('gitTab').addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://github.com/Russell-Vacanti/coinmonitor'
    });
  });

  //buttons to save tab settings
  document.getElementById('s0').addEventListener('click', () => {
    saveTabTo('0');
  });
  document.getElementById('s1').addEventListener('click', () => {
    saveTabTo('1');
  });
  document.getElementById('s2').addEventListener('click', () => {
    saveTabTo('2');
  });
  document.getElementById('s3').addEventListener('click', () => {
    saveTabTo('3');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  saveData('COIN', '0');
  saveData('HIST', 'm');

  getData('TAB-0', deft = 'BTC', (vle) => {
    coinTabs[0] = vle;
  });
  getData('TAB-1', deft = 'BCH', (vle) => {
    coinTabs[1] = vle;
  });
  getData('TAB-2', deft = 'LTC', (vle) => {
    coinTabs[2] = vle;
  });
  getData('TAB-3', deft = 'ETH', (vle) => {
    coinTabs[3] = vle;
  });

  addListeners();
  getData('DEF-COIN', (typ) => {
    console.log(typ);
    if (typ == undefined) {
      saveData('DEF-COIN', '0');
      changeTab('0');
    } else {
      changeTab(typ);
    }
    changeGraphTime('m');
  });
});