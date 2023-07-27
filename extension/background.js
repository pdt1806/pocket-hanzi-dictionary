var lang = "vie";

chrome.runtime.onMessage.addListener((message) => {
  if (message.event === "changeLang") {
    chrome.contextMenus.remove("pocket-hanzi-dictionary");
    fetchLang();
  }
});

// context menu

const fetchLang = () => {
  chrome.storage.local.get(["lang"], function (result) {
    lang = !!result.lang ? result.lang : lang;
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

chrome.contextMenus.onClicked.addListener(async function (word, tab) {
  var data = await getword(word.selectionText.replace(" ", ""));
  if (!!data) {
    data["lang"] = lang;
    data["title"] =
      lang === "vie" ? "Từ điển Hán tự bỏ túi" : "Pocket Hanzi Dictionary";
    chrome.tabs.sendMessage(tab.id, data);
    console.log(data);
    return;
  }
});

// logic

const getword = async (word) => {
  if (word.length === 1) {
    return await characterLookUp(word);
  } else {
    return await wordsLookUp(word);
  }
};

const characterLookUp = async (word) => {
  var json = {
    word: word,
    lang: lang,
  };
  try {
    const response = await fetch("http://localhost:5000/char", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const wordsLookUp = (word) => {
  console.log(word);
};
