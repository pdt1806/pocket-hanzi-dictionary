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
  res.send("Server for Pocket Hanzi Dictionary.");
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
    `Server for Pocket Hanzi Dictionary listening on http://localhost:${port}`
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
    if (info === "")
      return {
        error: lang === "vie" ? "Không tìm thấy kết quả!" : "No result found!",
      };
    const tongNet = info.split("Tổng nét: ")[1].split("Bộ")[0];
    const amPinyin = keepLatinLikeCharactersWithSpaces(
      info.includes("Âm Pinyin")
        ? info.split("Âm Pinyin: ")[1].split("Âm")[0]
        : ""
    );
    const thongDungCo = info
      .split("Độ thông dụng trong Hán ngữ cổ: ")[1]
      .split("Độ thông dụng trong tiếng Trung hiện đại: ")[0];
    const thongDungHienDai = info
      .split("Độ thông dụng trong tiếng Trung hiện đại: ")[1]
      .split("Âm Pinyin")[0];
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
    const amHanViet = info.split("Âm Hán Việt: ")[1].split("Tổng nét")[0];

    var returnData = {
      event: "char",
      word: word,
      amHanViet: amHanViet,
      tongNet: tongNet,
      thongDungCo: thongDungCo,
      thongDungHienDai: thongDungHienDai,
      amPinyin: amPinyin,
      amNhatOnyomi: amNhatOnyomi,
      amNhatKunyomi: amNhatKunyomi,
      amHan: amHan,
      amQuangDong: amQuangDong,
    };

    if (lang === "vie") {
      const bo = info.includes("Lục thư")
        ? info.split("Bộ: ")[1].split("Lục thư")[0]
        : info.split("Bộ: ")[1].split(" ")[0];
      const lucthu = info.includes("Lục thư")
        ? info.split("Lục thư: ")[1].split("Nét")[0].split("Hình thái")[0]
        : "";

      const amNom = info.includes("Âm Nôm")
        ? info.split("Âm Nôm: ")[1].split("Âm")[0]
        : "";
      const meaningAll = data(".hvres-details").text();
      var meaning;
      if (meaningAll.includes("Từ điển")) {
        meaning = "a";
        if (meaningAll.includes("trích dẫn"))
          meaning = meaningAll
            .split("Từ điển trích dẫn")[1]
            .split("Từ điển")[0];
        if (
          !meaning.includes("Giản thể của") &&
          meaningAll.includes("trích dẫn")
        ) {
          meaning = meaning
            .replace(/^\s+/gm, "")
            .match(/\b\d+\.\s(?!\d+\.\s)[\s\S]*?(?=\n\d+\.\s|\n\n|$)/g);
        } else {
          if (meaningAll.includes("phổ thông")) {
            meaning = meaningAll.split("Từ điển phổ thông")[1].split("Từ")[0];
          } else if (meaningAll.includes("Trần Văn Chánh")) {
            meaning = meaningAll
              .split("Từ điển Trần Văn Chánh")[1]
              .split("Từ điển")[0];
          } else if (meaningAll.includes("Thiều Chửu")) {
            meaning = meaningAll
              .split("Từ điển Thiều Chửu")[1]
              .split("Từ điển")[0];
          }
        }
        if (meaning[0].includes("1. ") && meaningAll.includes("trích dẫn")) {
          temp = [];
          meaning.forEach((sentence) => {
            const formattedSentence = `${sentence.replace(/\s+/g, " ").trim()}`;
            temp.push(formattedSentence);
          });
          meaning = temp.join("\n").split("\n");
        } else if (meaning.includes("①")) {
          meaning = meaning.split("\n");
          meaning = meaning.map((line) => line.trim());
          meaning = meaning.map((line) => line.replace(/^[①-⑦]/, ""));

          meaning = meaning.join("\n").split("\n");
          meaning = meaning.filter((e) => e !== "");
          meaning = meaning.map((line, index) => {
            return `${index + 1}. ${line}`;
          });
        } else {
          meaning = meaning.split("\n");
        }
      }

      returnData["bo"] = bo;
      returnData["lucthu"] = lucthu;
      returnData["amNom"] = amNom;
      returnData["meaning"] = meaning;
      return returnData;
    }
    if (lang === "eng") {
      const axiosResponseEng = await axios.request({
        method: "GET",
        url: `https://www.dong-chinese.com/wiki/${word}`,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        },
      });
      var dataEng = cheerio.load(axiosResponseEng.data);
      if (dataEng("body").text().includes("Word not found"))
        return {
          error:
            "The character you are looking for is not available in the database!",
        };

      if (
        dataEng("body")
          .text()
          .includes(
            "This information for this character has not been manually reviewed and may not be accurate."
          )
      )
        return {
          error:
            "This information for this character has not been manually reviewed and may not be accurate, so we cannot provide you with the information you need!",
        };
      var explanation = dataEng(".MuiTypography-root.MuiTypography-body1")
        .eq(12)
        .text();
      var meaningEng = dataEng(".MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12")
        .first()
        .text();
      var statistics = [];
      if (dataEng("body").text().includes("Historical pronunciation")) {
        var mark;
        for (var i = 0; i < 100; i++) {
          if (
            dataEng(".MuiTypography-root.MuiTypography-body1")
              .eq(i)
              .text()
              .includes("HSK")
          ) {
            mark = i;
            break;
          }
        }
        for (var i = mark; i < mark + 4; i++) {
          statistics.push(
            dataEng(".MuiTypography-root.MuiTypography-body1").eq(i).text()
          );
        }
      }
      returnData["explanation"] = explanation;
      returnData["meaning"] = meaningEng;
      returnData["statistics"] = statistics;

      return returnData;
    }
  } catch (error) {
    console.log(error);
    return {
      error:
        lang === "vie"
          ? "Đã có lỗi xảy ra! Mong bạn thông cảm cho sự bất tiện này"
          : "An error has occured! Please try again later!",
    };
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
