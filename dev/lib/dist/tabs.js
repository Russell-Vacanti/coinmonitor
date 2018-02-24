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
  saveData('TAB-' + num, coinID);
  console.log("Saving Tab " + num + " as " + coinID);
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

  document.getElementById("coinBuy").innerText = "loading...";
  document.getElementById("coinStatus").className = "alert alert-secondary";
  //hide chart if no price data
  document.getElementById('chartHolder').style.display = 'none';

  var coinPrice = '-';
  inquire(typ, 'price', (result) => {
    //show chart when we get price data back
    document.getElementById('chartHolder').style.display = 'block';
    document.getElementById("coinStatus").className = "alert alert-warning";
    data = result['USD'];
    document.getElementById("coinBuy").innerText = "$" + data;
  });
}

const initTabNum = (n, vle, dft) => {
  var tabVal = vle;
  if (tabVal == undefined) {
    tabVal = dft;
  }
  coinTabs[n] = tabVal;
  console.log("Changing Tab " + n + " name to " + coinNames[coinTabs[n]]);
  document.getElementById("c" + n).innerText = coinNames[coinTabs[n]];
}

const initTabs = () => {
  saveData('COIN', '0');
  saveData('HIST', 'm');
  // initialize coin tabs
  var defaultCoinTabs = ['BTC', 'BCH', 'LTC', 'ETH'];
  getData('TAB-0', (vle) => {
    console.log("Loaded Tab " + '0' + " as " + vle);
    initTabNum(0, vle, defaultCoinTabs[0]);
  });
  getData('TAB-1', (vle) => {
    console.log("Loaded Tab " + '1' + " as " + vle);
    initTabNum(1, vle, defaultCoinTabs[1]);
  });
  getData('TAB-2', (vle) => {
    console.log("Loaded Tab " + '2' + " as " + vle);
    initTabNum(2, vle, defaultCoinTabs[2]);
  });
  getData('TAB-3', (vle) => {
    console.log("Loaded Tab " + '3' + " as " + vle);
    initTabNum(3, vle, defaultCoinTabs[3]);
  });
}