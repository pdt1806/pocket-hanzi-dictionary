const cheerio = require("cheerio");
const axios = require("axios");

const express = require("express");
const app = express();
const port = 5000;

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "chrome-extension://ombebikgpmfpkmmoglfpbgefcomjmfob"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API for Pocket Hanzi Dictionary.");
});

app.post("/char", async (req, res) => {
  const data = req.body;
  const basic = await getDataforChar(data.word, data.lang);
  //   const expand = getinfoforChar(data.word, data.lang);
  res.send(basic);
});

app.listen(port, () => {
  console.clear();
  console.log(
    `API for Pocket Hanzi Dictionary listening on http://localhost:${port}`
  );
});

const getDataforChar = async (word, lang) => {
  try {
    const axiosResponse = await axios.request({
      method: "GET",
      url: `https://hvdic.thivien.net/whv/${word}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    const data = cheerio.load(axiosResponse.data);
    const info = data(".hvres-meaning").text();
    if (info === "") return {};
    const amHanViet = info.split("Âm Hán Việt: ")[1].split("Tổng nét")[0];
    const tongNet = info.split("Tổng nét: ")[1].split("Bộ")[0];
    const amPinyin = keepLatinLikeCharactersWithSpaces(
      info.includes("Âm Pinyin")
        ? info.split("Âm Pinyin: ")[1].split("Âm")[0]
        : ""
    );
    const amNhatOnyomi = info.includes("Âm Nhật (onyomi): ")
      ? info.split("Âm Nhật (onyomi): ")[1].split("Âm")[0]
      : "";
    const amNhatKunyomi = info.includes("Âm Nhật (kunyomi): ")
      ? info.split("Âm Nhật (kunyomi): ")[1].split("Âm")[0]
      : "";
    const amHan = info.includes("Âm Hàn")
      ? info.includes("Âm Quảng Đông")
        ? info.split("Âm Hàn: ")[1].split("Âm")[0]
        : info.split("Âm Hàn: ")[1].split("\n")[0]
      : "";
    const amQuangDong = info.includes("Âm Quảng Đông")
      ? info.split("Âm Quảng Đông: ")[1].split("\n")[0]
      : "";
    if (lang === "vie") {
      const bo = info.includes("Lục thư")
        ? info.split("Bộ: ")[1].split("Lục thư")[0]
        : info.split("Bộ: ")[1].split(" ")[0];
      const lucthu = info.includes("Lục thư")
        ? info.split("Lục thư: ")[1].split("Nét")[0].split("Hình thái")[0]
        : "";
      const thongDungCo = info
        .split("Độ thông dụng trong Hán ngữ cổ: ")[1]
        .split("Độ thông dụng trong tiếng Trung hiện đại: ")[0];
      const thongDungHienDai = info
        .split("Độ thông dụng trong tiếng Trung hiện đại: ")[1]
        .split("Âm Pinyin")[0];
      const amNom = info.includes("Âm Nôm")
        ? info.split("Âm Nôm: ")[1].split("Âm")[0]
        : "";
      const meaningAll = data(".hvres-details").text();
      var meaning;
      if (meaningAll.includes("Từ điển")) {
        meaning = meaningAll.split("Từ điển trích dẫn")[1].split("Từ điển")[0];

        if (!meaning.includes("Giản thể của")) {
          meaning = meaning
            .replace(/^\s+/gm, "")
            .replace("\n", "")
            .match(/\d+\..*?“[^”]*”.*?\./g);
        } else {
          if (meaningAll.includes("Trần Văn Chánh")) {
            meaning = meaningAll
              .split("Từ điển Trần Văn Chánh")[1]
              .split("Từ điển")[0];
          } else {
            meaning = meaningAll
              .split("Từ điển Thiều Chửu")[1]
              .split("Từ điển")[0];
          }
        }
        console.log(meaning);
        if (meaning[0].includes("1. ")) {
          temp = [];
          meaning.forEach((sentence) => {
            const formattedSentence = `${sentence.replace(/\s+/g, " ").trim()}`;
            temp.push(formattedSentence);
          });
          meaning = temp.join("\n").split("\n");
        } else {
          meaning = meaning.split("\n");
          meaning = meaning.map((line) => line.trim());
          meaning = meaning.map((line) => line.replace(/^[①-⑦]/, ""));

          meaning = meaning.join("\n").split("\n");
          meaning = meaning.filter((e) => e !== "");
          meaning = meaning.map((line, index) => {
            return `${index + 1}. ${line}`;
          });
        }
      }
      const returnData = {
        event: "char",
        word: word,
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
        meaning: meaning,
      };
      return returnData;
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

function keepLatinLikeCharactersWithSpaces(inputString) {
  const latinLikeRegex = /[\p{Script=Latin}\s,]/gu;
  const latinLikeCharacters = inputString.match(latinLikeRegex);
  const resultString = latinLikeCharacters
    ? latinLikeCharacters.join("").replace(/\s/g, "").replace(/,/g, ", ")
    : "";
  return resultString;
}
