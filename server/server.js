const cheerio = require("cheerio");
const axios = require("axios");

const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API for Pocket Hanzi Dictionary.");
});

app.get("/char", async (req, res) => {
  const data = req.body;
  const basic = await getDataforChar(data.word, data.lang);
  //   const expand = getMeaningforChar(data.word, data.lang);
  res.send(basic);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

const getDataforChar = async (word, lang) => {
  if (lang === "vie") {
    const axiosResponse = await axios.request({
      method: "GET",
      url: `https://hvdic.thivien.net/whv/${word}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    const data = cheerio.load(axiosResponse.data);
    const meaning = data(".hvres-meaning").text();
    const amHanViet = meaning.split("Âm Hán Việt: ")[1].split("Tổng nét")[0];
    const tongNet = meaning.split("Tổng nét: ")[1].split("Bộ")[0];
    const bo = meaning.split("Bộ: ")[1].split("Lục thư")[0];
    const lucthu = meaning.split("Lục thư: ")[1].split("Nét")[0];
    const thongDungCo = meaning
      .split("Độ thông dụng trong Hán ngữ cổ: ")[1]
      .split("Độ thông dụng trong tiếng Trung hiện đại: ")[0];
    const thongDungHienDai = meaning
      .split("Độ thông dụng trong tiếng Trung hiện đại: ")[1]
      .split("Âm Pinyin")[0];
    const amPinyin = meaning.split("Âm Pinyin: ")[1].split(" ")[0];
    const amNom = meaning.split("Âm Nôm: ")[1].split("Âm Nhật")[0];
    const amNhatOnyomi = meaning
      .split("Âm Nhật (onyomi): ")[1]
      .split("Âm Nhật (kunyomi")[0];
    const amNhatKunyomi = meaning
      .split("Âm Nhật (kunyomi): ")[1]
      .split("Âm Hàn")[0];
    const amHan = meaning.split("Âm Hàn: ")[1].split("Âm Quảng Đông")[0];
    const amQuangDong = meaning.split("Âm Quảng Đông: ")[1].split("\n")[0];
    const data1 = {
      amHanViet: amHanViet,
      tongNet: tongNet,
      bo: bo,
      lucthu: lucthu,
      thongDungCo: thongDungCo,
      thongDungHienDai: thongDungHienDai,
      amPinyin: amPinyin,
      amNom: amNom,
      amNhatOnyomi: amNhatOnyomi,
      amNhatKunyomi: amNhatKunyomi,
      amHan: amHan,
      amQuangDong: amQuangDong,
    };
    return data1;
  }
};
