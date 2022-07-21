const { default: axios } = require("axios");
const https = require("https");
const fs = require("fs");

const instance = axios.create();

var stringToHTML = function (str) {
  const jsdom = require("jsdom");
  const dom = new jsdom.JSDOM(str);
  return dom;
};

async function getNamesForDownload(url) {
  const result = await instance.get(url);

  const mapped = stringToHTML(result.data);

  const allRows = mapped.window.document.querySelectorAll("td > a");

  const filtered = [];
  allRows.forEach((row) => {
    if (row.innerHTML.includes(".mp3")) {
      filtered.push(row.getAttribute("href"));
      console.log(row.getAttribute("href"));
    }
  });

  return filtered;
}

async function donwloadFile(files, urlToDownload, folder) {
  files.forEach((row) => {
    https.get(urlToDownload + row, (res) => {
      const writeStream = fs.createWriteStream(`${folder}/${row}`);

      res.pipe(writeStream);

      writeStream.on("finish", () => {
        writeStream.close();
        console.log("Download Completed! File: " + row);
      });
    });
  });
}

async function donwloadAll() {
  const a = await getNamesForDownload("https://archive.org/download/30A30");
  const b = await getNamesForDownload("https://archive.org/download/39B39");
  const c = await getNamesForDownload("https://archive.org/download/17C17");

  donwloadFile(a, "https://ia803104.us.archive.org/11/items/30A30/", "A");
  donwloadFile(b, "https://ia800109.us.archive.org/9/items/39B39", "B");
  donwloadFile(c, "https://ia800109.us.archive.org/12/items/17C17/", "C");
}

donwloadAll();
