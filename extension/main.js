chrome.runtime.onMessage.addListener((message) => {
  if (message.event === "char") charInfo(message);
});

const charInfo = (message) => {
  if (!!document.getElementById("hanziBox"))
    document.body.removeChild(document.getElementById("hanziBox"));

  const toast = document.createElement("div");
  toast.id = "hanziBox";
  toast.className = "toast";

  const header = document.createElement("p");
  header.textContent = message.title;

  const chuViet = document.createElement("div");
  chuViet.id = "chuViet";

  const char = document.createElement("p");
  char.className = "char";
  char.textContent = message.word;

  chuViet.appendChild(char);

  const amHanViet = document.createElement("h3");
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

  const amPinyin = document.createElement("p");
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

  const nhanDeDong = document.createElement("p");
  nhanDeDong.id = "nhanDeDong";
  nhanDeDong.textContent = "Nhấn vào đây để đóng";

  const nhanDeXemYNghia = document.createElement("p");
  nhanDeXemYNghia.id = "nhanDeXemYNghia";
  nhanDeXemYNghia.textContent = "Nhấn vào đây để xem ý nghĩa";

  toast.appendChild(header);
  toast.appendChild(document.createElement("br"));
  toast.appendChild(chuViet);
  toast.appendChild(document.createElement("br"));
  toast.appendChild(amHanViet);
  toast.appendChild(tongNet);
  toast.appendChild(bo);
  toast.appendChild(lucthu);
  toast.appendChild(thongDungCo);
  toast.appendChild(thongDungHienDai);
  toast.appendChild(document.createElement("br"));
  toast.appendChild(amPinyin);
  toast.appendChild(amNom);
  toast.appendChild(amNhatOnyomi);
  toast.appendChild(amNhatKunyomi);
  toast.appendChild(amHan);
  toast.appendChild(amQuangDong);
  toast.appendChild(document.createElement("br"));
  toast.appendChild(nhanDeXemYNghia);
  toast.appendChild(nhanDeDong);

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);
  document.getElementById("nhanDeXemYNghia").addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
      charMeaning(message);
    }, 300);
  });
  document.getElementById("nhanDeDong").addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  });
};

const charMeaning = (message) => {
  const toast = document.createElement("div");
  toast.id = "hanziBox";
  toast.className = "toast";

  const header = document.createElement("p");
  header.textContent = message.title;

  const chuViet = document.createElement("div");

  const char = document.createElement("p");
  char.className = "char";
  char.textContent = message.word;

  chuViet.appendChild(char);

  const amHanViet = document.createElement("h3");
  amHanViet.textContent = `Âm Hán Việt: ${message.amHanViet}`;

  const title = document.createElement("h4");
  title.textContent = `Ý nghĩa:`;

  for (var i = 0; i < message.meaning.length; i++) {
    this["meaning" + i] = document.createElement("p");
    this["meaning" + i].textContent = message.meaning[i];
  }

  const nhanDeDong = document.createElement("p");
  nhanDeDong.id = "nhanDeDong";
  nhanDeDong.textContent = "Nhấn vào đây để đóng";

  const nhanDeXemThongTin = document.createElement("p");
  nhanDeXemThongTin.id = "nhanDeXemThongTin";
  nhanDeXemThongTin.textContent = "Nhấn vào đây để xem thông tin";

  toast.appendChild(header);
  toast.appendChild(document.createElement("br"));
  toast.appendChild(chuViet);
  toast.appendChild(document.createElement("br"));
  toast.appendChild(amHanViet);
  toast.appendChild(document.createElement("br"));
  toast.appendChild(title);
  for (var i = 0; i < message.meaning.length; i++) {
    toast.appendChild(this["meaning" + i]);
  }
  toast.appendChild(document.createElement("br"));
  toast.appendChild(nhanDeXemThongTin);
  toast.appendChild(nhanDeDong);

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);
  document.getElementById("nhanDeXemThongTin").addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
      charInfo(message);
    }, 300);
  });
  document.getElementById("nhanDeDong").addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  });
};
