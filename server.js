const express = require('express'),
    puppeteer = require('puppeteer');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', async(req, res) => {
    let forcast = await forecastScraper('https://www.snow-forecast.com/resorts/Sunshine/6day/mid');
    res.render('index',{forecastThree: forcast.threeDay,forecastFour: forcast.fourDay});
})

app.listen(3000)

async function forecastScraper(url){
    console.log('Loading puppeteer');
    const browser = await puppeteer.launch();
    console.log('Loading: '+url);
    const page = await browser.newPage();
    await page.goto(url);
  
    console.log('Loading content');
    const [el] = await page.$x('/html/body/div[2]/div/div[6]/div/div[1]/div[5]/div/div[1]/div[1]/div[1]/span');
    const threeDayTxt = await el.getProperty('textContent');
    const threeDay = await threeDayTxt.jsonValue();
  
    const [el2] = await page.$x('/html/body/div[2]/div/div[6]/div/div[1]/div[5]/div/div[1]/div[1]/div[2]/span');
    const FourDayTxt = await el2.getProperty('textContent');
    const fourDay = await FourDayTxt.jsonValue();

    console.log('Closing browser');
    browser.close();
    return {threeDay,fourDay};
  }