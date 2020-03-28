const puppeteer = require('puppeteer');
const clc = require("cli-color");
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FileType = require('file-type');

fs.mkdirSync(path.resolve(__dirname, 'images'), {recursive: true});
const imgDir = path.resolve(__dirname, 'images')

const myArgs = process.argv.slice(2);
const threadId = myArgs[0];
const startPage = myArgs[1];
let headFull = myArgs[2];

headFull = !!(headFull);
let ImgUrlsDone = [];

let downloadImage = async (url) => {
    return new Promise(async (resolve, reject) => {
        if (!url.startsWith("http:")) {
            url = `http:${url}`;
        }

        if (ImgUrlsDone.includes(url)) {
            console.log(clc.yellow(`\nDownload Skipped Duplicate: ${url}`));
            resolve();
            return;
        } else {
            ImgUrlsDone.push(url);
        }

        const filePath = path.resolve(imgDir, `${Date.now()}_${Math.floor(Math.random() * 100000) + 10000}.part`)
        const writer = fs.createWriteStream(filePath)

        let response = null;
        let downloadSuccess = true;
        let zeroLength = false
        try {
            let retryCount = 10;
            do {
                response = await axios({
                    url,
                    method: 'GET',
                    responseType: 'stream',
                    timeout: 10000
                });
                retryCount--;
            } while (retryCount > 0 && response.length == 0);

            if (response.length == 0) {
                zeroLength = true;
                throw Error('Zero Length File');
            }
            response.data.pipe(writer);
        } catch (error) {
            downloadSuccess = false;
            writer.end();
            let errorCode = null;
            if (error && typeof error === "object" && error.hasOwnProperty('response') && typeof error.response === "object" && error.response.hasOwnProperty('status')) {
                errorCode = error.response.status
            }
            if (zeroLength) {
                console.log(clc.yellow(`\nDownload Failed: ${url}`, "Zero Length File"));
            } else {
                console.log(clc.yellow(`\nDownload Failed: ${url}`, errorCode));
            }
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        writer.on('finish', async () => {
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
            } else if(downloadSuccess){
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

let main = async (threadId, pageNumber) => {
    const browser = await puppeteer.launch({
        headless: !headFull,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    try {
        const page = await browser.newPage();
        let threadUrl = "http://www.elakiri.com/forum/showthread.php?t=" + threadId + "&page=" + pageNumber

        await page.setRequestInterception(true);
        await page.on('request', (req) => {
            if(req.resourceType() === 'image'){
                req.abort();
            }
            else {
                req.continue();
            }
        });
        
        await page.goto(threadUrl);

        let imgUrls = [];
        let endOfPages = false;
        while (!endOfPages) {
            pageNumber++;
            console.log(clc.black.bgGreenBright.underline(`Went to page: ${page.url()}`));
            await page.addScriptTag({path: require.resolve('jquery')})
            imgUrls = await page.$$eval('td div.vb_postbit img:not(.inlineimg)', imgs => imgs.map(img => img.getAttribute('src')));
            console.log(clc.black.bgGreenBright.underline(`Found ${(imgUrls.length)} matches`));
            await asyncForEach(imgUrls, downloadImage);

            let dirCont = fs.readdirSync(imgDir);
            let files = dirCont.filter(function (elm) {
                return elm.match(/.*\.(part)/ig);
            });

            await asyncForEach(files, nameFilesBasedOnMime);

            if (await page.$('div.pagenav a[rel="next"]') === null) {
                endOfPages = true;
                pageNumber = 0;
                break;
            }
            console.log(`\nGoing to Page: ${pageNumber}\n`);
            await Promise.all([
                page.click('div.pagenav a[rel="next"]', {waitUntil: 'domcontentloaded'}),
                page.waitForNavigation({waitUntil: 'networkidle0'}),
            ]);
        }

    } catch (error) {
        pageNumber++;
        console.log(clc.black.bgCyanBright(`Skipping to page ${(pageNumber)} due to ${(error.message)}`));
        console.log('\n');
    } finally {
        await delay(3000);
        await browser.close();
        return pageNumber;
    }
};

(async function() {
    try {
        let pgNumber = startPage ? startPage : 1;
        while (pgNumber > 0) {
            pgNumber = await main(threadId, pgNumber);
        }
    } catch (error) {
        console.error(error);
    }
})();
