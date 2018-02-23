//tabs.js
//tab manager for coin monitor

var coinTabs = ['BTC', 'BCH', 'LTC', 'ETH', 'SET'];

const changeTab = (typ, forceUpdate = false) => {
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

const updateSettingsCard = (typ) => {
  document.getElementById('card-coin').style.display = 'none';
  document.getElementById('card-settings').style.display = 'block';

}

const updateCoinCard = (typ) => {
  document.getElementById('card-coin').style.display = 'block';
  document.getElementById('card-settings').style.display = 'none';

  initCoinChart(typ);

  document.getElementById("coinBuy").innerText = "Error Getting Price Data";
  document.getElementById("coinStatus").className = "alert alert-dark";
  //hide chart if no price data
  document.getElementById('chartHolder').style.display = 'none';
  inquire(typ, 'price', (result) => {
    //show chart when we get price data back
    document.getElementById('chartHolder').style.display = 'block';
    data = result['USD'];
    document.getElementById("coinBuy").innerText = "$" + data;
    if (0 < 0) {
      document.getElementById("coinStatus").className = "alert alert-success";
    } else if (0 > 0) {
      document.getElementById("coinStatus").className = "alert alert-danger";
    } else {
      document.getElementById("coinStatus").className = "alert alert-warning";
    }
  });
}

const initTabs = () => {
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
}