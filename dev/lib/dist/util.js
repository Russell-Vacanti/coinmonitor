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