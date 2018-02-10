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