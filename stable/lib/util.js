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

const checkForUpdate = (currentVersion) => {
  var apiUrl = "https://raw.githubusercontent.com/Russell-Vacanti/coinmonitor/master/stable/";
  apiUrl = apiUrl + "version.json"
  $.ajax({
    async: true,
    type: "GET",
    url: apiUrl,
    success: function(result) {
      console.log(result);
    }
  });
}