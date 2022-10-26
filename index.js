const puppeteer = require("puppeteer");
const fs = require('fs');

const link = 'https://www.deviantart.com/tumaatt/art/Chibi-Adoptables-OPEN-933787385';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    try {
        const cookie = JSON.parse(fs.readFileSync('./cookie.json', 'utf8'));
        const browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();
        await page.setCookie(...cookie);
        await page.setViewport({
            width: 1600,
            height: 900,
        });
        await page.goto(link);

        const groupsMenuXpath = '//div[@tabindex="-1" and descendant::*[contains(text(), "Add to Group")]]';
        const albumsMenuXpath = '//div[@tabindex="-1" and descendant::*[contains(text(), "Gallery")]]';
        let index = 0;
        let length = 0;
        do {
            await page.click('button[data-hook="group_counter"]');
                console.log('click');
            await page.waitForXPath(groupsMenuXpath + '//img');
                console.log('waited for groups menu');
            const groups = await page.$x(groupsMenuXpath + '//img');
            length = groups.length;

            await groups[index].click();
            await page.waitForXPath(albumsMenuXpath + '//img');
                console.log('waited for albums');
            await page.click('div[tabindex="-1"] img');
            await sleep(1000);
            index++;
        } while (index < length);


    } catch(error) {
        console.log(error);
    } 
})();