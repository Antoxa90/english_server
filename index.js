const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27018/englishdb', { useNewUrlParser: true, useUnifiedTopology: true });

const brokenWords = {};

const wrongWords = [];

const getData = async (page, word) => {
  if (word in brokenWords) {
    word = brokenWords[word];
  }

  await page.type('#searchword', word, { delay: 300 });
  const banner = await page.$('.iwc.bh.hdib.hao.fon') || null;
  if (banner) {
    await page.click('.iwc.bh.hdib.hao.fon');
  }

  await page.click('.cdo-search-button');
  await page.waitForNavigation();
  await page.waitForSelector('.def');

  const result = await page.evaluate(() => {
    const definition = document.querySelector('.def').innerText;
    const examples = document.querySelectorAll('.pr.dictionary:first-child .entry:first-child .dexamp') || [];
    const type = document.querySelector('.pos.dpos') && document.querySelector('.pos.dpos').innerText;
    const data = []
    for (let element of examples) {
      data.push(element.innerText)
    }
    return {
      definition,
      examples: data,
      type,
    }
  });

  return result;
}

const scrape = async (page, words) => {
  const result = [];
  try {
    for (let word of words) {
      console.log('CURRENT WORD -', word)
      if (word.length === 1 || wrongWords.includes(word)) {
        result.push({ word, examples: [] });
        continue;
      }
      result.push({
        word,
        ...await getData(page, word)
      });
    }
    return result;
  } catch (error) {
    console.log(error);
    return result;
  }
}

const parseWord = async (word) => {
  let browser, result = [];
  try {
    browser = await puppeteer.launch({ headless: false, executablePath: '/usr/bin/google-chrome' });
    const page = await browser.newPage();
    await page.setViewport({ 'width': 1100, 'height': 700 });
    await page.goto('https://dictionary.cambridge.org/');
    await page.waitFor(1000);
    await page.click('body > div.pr.pg-h.fon > div.bh.pr.lbt.lb-ch.lmb-15.z2.pg-hh > div.lmax.lch1 > div > div > div.hflx1.lpb-25.lp-m_t-10.lp-l_b-0.lp-l_t-15.lml--10.lmr--10.lm-s-auto > form > div.hcb.lpt-2 > div > div > div > span:nth-child(1) > span');
    result = await scrape(page, [word]);
  } catch (error) {
    console.log(error);
  } finally {
    browser.close();
    return result[0];
  }
}

module.exports = {
  parseWord,
};