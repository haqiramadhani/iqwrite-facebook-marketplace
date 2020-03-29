const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const cookies = require('./cookies');

const init = async (sessionId) => {
  const browser = await puppeteer.launch({headless: false, sessionId, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/60.0.3112.50 Safari/537.36'});
  const page1 = await browser.newPage();
  if (Object.keys(cookies).length) {
    await page1.setCookie(...cookies);
  } else {
    await page1.goto('https://facebook.com/');
    await page1.type('#email', config.email, {delay: 30});
    await page1.type('#pass', config.password, {delay: 30});
    await page1.click('#loginbutton');
    await page1.waitForNavigation({waitUntil: 'networkidle2'});
    await page1.waitFor(15000);
    try {
      await page1.waitFor('[data-click="profile_icon"]')
    } catch (e) {
      console.log('Failed to login!')
      process.exit(0);
    }
    let currentCookies = await page1.cookies();
    fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));
  }
  await page1.goto('https://m.facebook.com/marketplace/selling/item/');
  const inputFile = await page1.$('[name="photos-input"]');
  await inputFile.uploadFile(path.join(__dirname, './images', fs.readdirSync('./images')[0]));
  await page1.type('[name="title"]', 'SMS Pelicin dan Pewangi Pakaian');
  await page1.type('[name="price"]', '10000');
  await page1.type('[name="description"]', 'SMS Pelicin dan Pewangi Pakaian');
};

init('hakiramadhani@gmail.com').then(r => console.log('done:', r));