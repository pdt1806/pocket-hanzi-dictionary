var lang;

chrome.runtime.onMessage.addListener((message) => {
  if (message.event === "changeLang") {
    chrome.contextMenus.remove("pocket-hanzi-dictionary");
    fetchLang();
  }
});

// context menu

const fetchLang = () => {
  chrome.storage.local.get(["lang"], function (result) {
    lang = !!result.lang ? result.lang : "eng";
  });

  fetch(chrome.runtime.getURL("lang/lang.json"))
    .then((response) => response.json())
    .then((json) => {
      var langData = json;
      chrome.contextMenus.create({
        title: `${langData[lang]["contextTitle"]}: %s`,
        contexts: ["selection"],
        id: "pocket-hanzi-dictionary",
      });
    });
};

fetchLang();

chrome.contextMenus.onClicked.addListener(function (word) {
  getword(word.selectionText.replace(" ", ""));
});

// logic

const getword = (word) => {
  if (word.length === 1) {
    characterLookUp(word);
  } else {
    wordsLookUp(word);
  }
};

const characterLookUp = (word) => {
  console.log(word);
};
const wordsLookUp = (word) => {
  console.log(word);
};
