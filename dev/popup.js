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
  initTabs();
  addListeners();

  getData('DEF-COIN', (typ) => {
    if (typ == undefined) {
      saveData('DEF-COIN', '0');
      changeTab('0');
    } else {
      changeTab(typ);
    }
    changeGraphTime('m');
  });
});