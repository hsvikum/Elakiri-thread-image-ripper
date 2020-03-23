const puppeteer = require('puppeteer');
const clc = require("cli-color");
const fs = require('fs')  
const path = require('path')  
const axios = require('axios')
const FileType = require('file-type');

fs.mkdirSync(path.resolve(__dirname, 'images'), { recursive: true });
const imgDir = path.resolve(__dirname, 'images')

const myArgs = process.argv.slice(2);
const threadUrl = myArgs[0];
let headFull = myArgs[1];
headFull = !!(headFull);

let downloadImage = async (url) => {
    return new Promise(async (resolve, reject) => {

        if (!url.startsWith("http:")) {
            url = `http:${url}`;
        }

        const filePath = path.resolve(imgDir, `${Date.now()}_${Math.floor(Math.random() * 100000) + 10000}.part`)
        const writer = fs.createWriteStream(filePath)
    
        let response = null;
        try {
            response = await axios({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: 10000
            });
            response.data.pipe(writer);
        } catch(error) {
            let errorCode = null;
            if (error && typeof error === "object" && error.hasOwnProperty('response') && typeof error.response === "object" && error.response.hasOwnProperty('status')) {
                errorCode = error.response.status
            }
            writer.end();
            console.log(clc.yellow(`\nDownload Failed: ${url}`, errorCode));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        writer.on('finish',async () => {
            if (
                response &&
                typeof response === "object" &&
                response.hasOwnProperty('headers') &&
                response.headers.hasOwnProperty('content-type') &&
                response.headers['content-type'].includes('text/html')
            ) {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } else {
                console.log(clc.green(`\nDownload Success: ${url}`));
            }
            resolve()
        });
        writer.on('error', () => {
            reject();
        });
    });
}

let nameFilesBasedOnMime = async (file) => {
    file = path.resolve(imgDir, file);
    if (fs.existsSync(file)) {
        let stream = fs.createReadStream(file);
        let mimeInfo = await FileType.fromStream(stream);
        if (!!(mimeInfo) && mimeInfo.hasOwnProperty('ext')) {
            let newFileBase = file.split('.').slice(0, -1)
            fs.renameSync(file, `${newFileBase}.${mimeInfo.ext}`);
        } else {
            console.log(file);
        }
    }
}

let delay = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

let asyncForEach = async (array, callback) => {
      let parallel = [];
      for (let index = 0; index < array.length; index++) {
          parallel.push(callback(array[index], index, array));
      }
      await Promise.all(parallel)
  }

(async function(){
    const browser = await puppeteer.launch({headless: !headFull, ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    try {
        const page = await browser.newPage();
        await page.goto(threadUrl);

        let imgUrls = [];
        let endOfPages = false;
        while(!endOfPages) {
            console.log('\n\n');
            console.log(clc.black.bgGreenBright.underline(`Went to page: ${page.url()}`));
            await page.addScriptTag({path: require.resolve('jquery')})
            imgUrls = await page.$$eval('td div.vb_postbit img:not(.inlineimg)', imgs => imgs.map(img => img.getAttribute('src')));
            console.log(clc.black.bgGreenBright.underline(`Found ${(imgUrls.length)} matches`));
            await asyncForEach(imgUrls, downloadImage);

            let dirCont = fs.readdirSync(imgDir);
            let files = dirCont.filter(function( elm ) {return elm.match(/.*\.(part)/ig);});

            await asyncForEach(files, nameFilesBasedOnMime);

            if (await page.$('div.pagenav a[rel="next"]') === null) {
                endOfPages = true;
                break;
            }
            await Promise.all([
                page.click('div.pagenav a[rel="next"]'),
                page.waitForNavigation({waitUntil: 'networkidle0'}),
            ]);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await delay(3000);
        await browser.close();
    }
})();