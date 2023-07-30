const popular = {
  "rất thấp": "Very rare",
  thấp: "Rare",
  "trung bình": "Common",
  cao: "Very common",
  "rất cao": "Extremely common",
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.error) {
    const toast = document.createElement("div");
    toast.id = "hanziBox";
    toast.className = "toast";

    const header = document.createElement("p");
    header.style.fontWeight = "bold";
    header.textContent = message.title;

    const error = document.createElement("p");
    error.textContent = `${message.error}`;

    toast.appendChild(header);
    toast.appendChild(document.createElement("br"));
    toast.appendChild(error);

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "1";
    }, 100);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 5000);
  }
  if (message.event === "char") {
    message.lang === "vie" ? charInfoVie(message) : charInfoEng(message);
  }
});

const charInfoVie = (message) => {
  if (!!document.getElementById("hanziBox"))
    document.body.removeChild(document.getElementById("hanziBox"));

  const toast = document.createElement("div");
  toast.id = "hanziBox";
  toast.className = "toast";

  const main = document.createElement("div");
  main.id = "main";

  const header = document.createElement("p");
  header.style.fontWeight = "bold";
  header.textContent = message.title;

  const chuViet = document.createElement("div");
  chuViet.id = "chuViet";

  const char = document.createElement("span");
  char.className = "char";
  char.textContent = message.word;

  const stroke = document.createElement("div");
  stroke.id = "stroke";

  chuViet.appendChild(char);
  chuViet.appendChild(stroke);

  const amHanViet = document.createElement("p");
  amHanViet.textContent = `Âm Hán Việt: ${message.amHanViet}`;

  const tongNet = document.createElement("p");
  tongNet.textContent = `Tổng nét: ${message.tongNet}`;

  const bo = document.createElement("p");
  bo.textContent = `Bộ: ${message.bo}`;

  const lucthu = document.createElement("p");
  lucthu.textContent = message.lucthu ? `Lục thư: ${message.lucthu}` : "";

  const thongDungCo = document.createElement("p");
  thongDungCo.textContent = `Độ thông dụng trong Hán ngữ cổ: ${message.thongDungCo}`;

  const thongDungHienDai = document.createElement("p");
  thongDungHienDai.textContent = `Độ thông dụng trong tiếng Trung hiện đại: ${message.thongDungHienDai}`;

  const amPinyin = document.createElement("h3");
  amPinyin.textContent = message.amPinyin
    ? `Âm Pinyin: ${message.amPinyin}`
    : "";

  const amNom = document.createElement("p");
  amNom.textContent = message.amNom ? `Âm Nôm: ${message.amNom}` : "";

  const amNhatOnyomi = document.createElement("p");
  amNhatOnyomi.textContent = message.amNhatOnyomi
    ? `Âm Nhật (onyomi): ${message.amNhatOnyomi}`
    : "";

  const amNhatKunyomi = document.createElement("p");
  amNhatKunyomi.textContent = message.amNhatKunyomi
    ? `Âm Nhật (kunyomi): ${message.amNhatKunyomi}`
    : "";

  const amHan = document.createElement("p");
  amHan.textContent = message.amHan ? `Âm Hàn: ${message.amHan}` : "";

  const amQuangDong = document.createElement("p");
  amQuangDong.textContent = message.amQuangDong
    ? `Âm Quảng Đông: ${message.amQuangDong}`
    : "";

  const footer = document.createElement("footer");

  const nhanDeDong = document.createElement("p");
  nhanDeDong.id = "nhanDeDong";
  nhanDeDong.textContent = "Đóng";

  const nhanDeXemYNghia = document.createElement("p");
  nhanDeXemYNghia.id = "nhanDeXemYNghia";
  nhanDeXemYNghia.textContent = "Xem ý nghĩa";

  const audioContainer = document.createElement("div");
  audioContainer.id = "audioContainer";

  const audio = `
  <audio controls="" name="media"><source src="https://translate.google.com/translate_tts?ie=UTF-8&tl=zh&client=tw-ob&q=${message.word}" type="audio/mpeg"></audio>
`;

  audioContainer.innerHTML = audio;

  main.appendChild(header);
  main.appendChild(document.createElement("br"));
  main.appendChild(chuViet);
  main.appendChild(document.createElement("br"));
  main.appendChild(amPinyin);
  main.appendChild(amHanViet);
  main.appendChild(audioContainer);
  main.appendChild(document.createElement("br"));
  main.appendChild(tongNet);
  main.appendChild(bo);
  main.appendChild(lucthu);
  main.appendChild(thongDungCo);
  main.appendChild(thongDungHienDai);
  main.appendChild(document.createElement("br"));
  main.appendChild(amNom);
  main.appendChild(amNhatOnyomi);
  main.appendChild(amNhatKunyomi);
  main.appendChild(amHan);
  main.appendChild(amQuangDong);
  main.appendChild(document.createElement("br"));

  if (!!message.meaning) footer.appendChild(nhanDeXemYNghia);
  footer.appendChild(nhanDeDong);
  footer.style.justifyContent = !!message.meaning
    ? "space-between"
    : "flex-end";

  toast.appendChild(main);
  toast.appendChild(footer);

  document.body.appendChild(toast);
  var writer = HanziWriter.create("stroke", message.word, {
    width: 100,
    height: 100,
    padding: 5,
    strokeAnimationSpeed: 2,
    delayBetweenLoops: 2000,
  });

  writer.loopCharacterAnimation();

  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);
  if (!!message.meaning) {
    document.getElementById("nhanDeXemYNghia").addEventListener("click", () => {
      toast.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toast);
        charMeaningVie(message);
      }, 300);
    });
  }
  document.getElementById("nhanDeDong").addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  });
};

const charInfoEng = (message) => {
  if (!!document.getElementById("hanziBox"))
    document.body.removeChild(document.getElementById("hanziBox"));

  const toast = document.createElement("div");
  toast.id = "hanziBox";
  toast.className = "toast";

  const main = document.createElement("div");
  main.id = "main";

  const header = document.createElement("p");
  header.style.fontWeight = "bold";
  header.textContent = message.title;

  const chuViet = document.createElement("div");
  chuViet.id = "chuViet";

  const char = document.createElement("div");
  char.className = "char";
  char.textContent = message.word;

  const stroke = document.createElement("div");
  stroke.id = "stroke";

  chuViet.appendChild(char);
  chuViet.appendChild(stroke);

  const pinyin = document.createElement("h3");
  pinyin.textContent = `Pinyin: ${message.amPinyin}`;

  const meaning = document.createElement("p");
  meaning.textContent = `Meaning: ${message.meaning}`;

  const tongNet = document.createElement("p");
  tongNet.textContent = `Stroke: ${message.tongNet}`;

  const explanation = document.createElement("p");
  explanation.textContent = `Explanation: ${message.explanation}`;

  const thongDungCo = document.createElement("p");
  thongDungCo.textContent = `Occurrence rate in Old Chinese: ${
    popular[message.thongDungCo]
  }`;

  const thongDungHienDai = document.createElement("p");
  thongDungHienDai.textContent = `Occurrence rate in Modern Chinese: ${
    popular[message.thongDungHienDai]
  }`;

  const amNhatOnyomi = document.createElement("p");
  amNhatOnyomi.textContent = message.amNhatOnyomi
    ? `Japanese (onyomi): ${message.amNhatOnyomi}`
    : "";

  const amNhatKunyomi = document.createElement("p");
  amNhatKunyomi.textContent = message.amNhatKunyomi
    ? `Japanese (kunyomi): ${message.amNhatKunyomi}`
    : "";

  const amHanViet = document.createElement("p");
  amHanViet.textContent = message.amHanViet
    ? `Vietnamese: ${message.amHanViet}`
    : "";

  const amHan = document.createElement("p");
  amHan.textContent = message.amHan ? `Korean: ${message.amHan}` : "";

  const amQuangDong = document.createElement("p");
  amQuangDong.textContent = message.amQuangDong
    ? `Cantonese: ${message.amQuangDong}`
    : "";

  const statisticsTitle = document.createElement("p");
  statisticsTitle.style.fontWeight = "bold";
  statisticsTitle.textContent = `Statistics:`;

  for (var i = 0; i < message.statistics.length; i++) {
    this["statistics" + i] = document.createElement("p");
    this["statistics" + i].textContent = message.statistics[i];
  }

  const footer = document.createElement("footer");

  const nhanDeDong = document.createElement("p");
  nhanDeDong.id = "nhanDeDong";
  nhanDeDong.textContent = "Close";

  const audioContainer = document.createElement("div");
  audioContainer.id = "audioContainer";

  const audio = `
  <audio controls="" name="media"><source src="https://translate.google.com/translate_tts?ie=UTF-8&tl=zh&client=tw-ob&q=${message.word}" type="audio/mpeg"></audio>
`;

  audioContainer.innerHTML = audio;

  main.appendChild(header);
  main.appendChild(document.createElement("br"));
  main.appendChild(chuViet);
  main.appendChild(document.createElement("br"));
  main.appendChild(pinyin);
  main.appendChild(meaning);
  main.appendChild(explanation);
  main.appendChild(audioContainer);
  main.appendChild(document.createElement("br"));
  main.appendChild(tongNet);
  main.appendChild(thongDungCo);
  main.appendChild(thongDungHienDai);
  main.appendChild(document.createElement("br"));
  main.appendChild(amNhatOnyomi);
  main.appendChild(amNhatKunyomi);
  main.appendChild(amHanViet);
  main.appendChild(amHan);
  main.appendChild(amQuangDong);
  main.appendChild(document.createElement("br"));
  if (!!message.statistics) main.appendChild(statisticsTitle);
  for (var i = 0; i < message.statistics.length; i++) {
    main.appendChild(this["statistics" + i]);
  }
  main.appendChild(document.createElement("br"));
  footer.appendChild(nhanDeDong);
  footer.style.justifyContent = "flex-end";

  toast.appendChild(main);
  toast.appendChild(footer);

  document.body.appendChild(toast);
  var writer = HanziWriter.create("stroke", message.word, {
    width: 100,
    height: 100,
    padding: 5,
    strokeAnimationSpeed: 2,
    delayBetweenLoops: 2000,
  });

  writer.loopCharacterAnimation();
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);

  document.getElementById("nhanDeDong").addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  });
};

const charMeaningVie = (message) => {
  if (!!message.meaning) {
    const toast = document.createElement("div");
    toast.id = "hanziBox";
    toast.className = "toast";

    const main = document.createElement("div");
    main.id = "main";

    const header = document.createElement("p");
    header.style.fontWeight = "bold";
    header.textContent = message.title;

    const chuViet = document.createElement("div");
    chuViet.id = "chuViet";

    const char = document.createElement("span");
    char.className = "char";
    char.textContent = message.word;

    const stroke = document.createElement("div");
    stroke.id = "stroke";

    chuViet.appendChild(char);
    chuViet.appendChild(stroke);

    const amPinyin = document.createElement("h3");
    amPinyin.textContent = `Âm Pinyin: ${message.amPinyin}`;

    const amHanViet = document.createElement("p");
    amHanViet.textContent = `Âm Hán Việt: ${message.amHanViet}`;

    const title = document.createElement("p");
    title.textContent = `Ý nghĩa:`;

    for (var i = 0; i < message.meaning.length; i++) {
      this["meaning" + i] = document.createElement("p");
      this["meaning" + i].textContent = message.meaning[i];
    }

    const footer = document.createElement("footer");

    const nhanDeDong = document.createElement("p");
    nhanDeDong.id = "nhanDeDong";
    nhanDeDong.textContent = "Đóng";

    const nhanDeXemThongTin = document.createElement("p");
    nhanDeXemThongTin.id = "nhanDeXemThongTin";
    nhanDeXemThongTin.textContent = "Xem thông tin";

    main.appendChild(header);
    main.appendChild(document.createElement("br"));
    main.appendChild(chuViet);
    main.appendChild(document.createElement("br"));
    main.appendChild(amPinyin);
    main.appendChild(amHanViet);
    main.appendChild(document.createElement("br"));
    main.appendChild(title);
    for (var i = 0; i < message.meaning.length; i++) {
      main.appendChild(this["meaning" + i]);
    }
    main.appendChild(document.createElement("br"));

    footer.appendChild(nhanDeXemThongTin);
    footer.appendChild(nhanDeDong);
    footer.style.justifyContent = "space-between";

    toast.appendChild(main);
    toast.appendChild(footer);

    document.body.appendChild(toast);
    var writer = HanziWriter.create("stroke", message.word, {
      width: 100,
      height: 100,
      padding: 5,
      strokeAnimationSpeed: 2,
      delayBetweenLoops: 2000,
    });

    writer.loopCharacterAnimation();
    setTimeout(() => {
      toast.style.opacity = "1";
    }, 100);
    document
      .getElementById("nhanDeXemThongTin")
      .addEventListener("click", () => {
        toast.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(toast);
          charInfoVie(message);
        }, 300);
      });
    document.getElementById("nhanDeDong").addEventListener("click", () => {
      toast.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    });
  }
};
