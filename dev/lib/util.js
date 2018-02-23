const getData = (key, callback, deft = undefined) => {
  chrome.storage.sync.get('COINMONITOR-' + key, (items) => {
    if (items['COINMONITOR-' + key] == undefined) {
      callback(deft);
    } else {
      callback(items['COINMONITOR-' + key]);
    }
  });
}

const saveData = (key, data) => {
  var items = {};
  items['COINMONITOR-' + key] = data;
  chrome.storage.sync.set(items);
}