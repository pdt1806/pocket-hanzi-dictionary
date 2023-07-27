const fetchLang = () => {
  var lang;

  chrome.storage.local.get(["lang"], function (result) {
    lang = result.lang;
    if (!lang) {
      const langToStore = "vie";
      lang = langToStore;
      chrome.storage.local.set({ lang: langToStore }, () => {});
    }
  });

  fetch(chrome.runtime.getURL("lang/lang.json"))
    .then((response) => response.json())
    .then((json) => {
      var langData = json;
      document.getElementById("title").textContent = langData[lang]["title"];
      document.getElementById("description").textContent =
        langData[lang]["description"];
      document.getElementById("lang").textContent = langData[lang]["language"];
      document.getElementById(lang).setAttribute("checked", "");
    });
};

fetchLang();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#eng").addEventListener("click", changeLang);
  document.querySelector("#vie").addEventListener("click", changeLang);
});

const changeLang = () => {
  var radios = document.getElementsByTagName("input");

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].type === "radio" && radios[i].checked) {
      var value = radios[i].value;
    }
  }

  chrome.storage.local.set({ lang: value }, () => {});
  chrome.runtime.sendMessage({ event: "changeLang" });
  fetchLang();
};
