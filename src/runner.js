const puppeteer = require("puppeteer");
const fs = require('fs');
const { sleep } = require('./utils');

async function run(artUrl) {
	try {
		const cookie = JSON.parse(fs.readFileSync('./cookie.json', 'utf8'));
		console.log('Open browser...');
		const browser = await puppeteer.launch({
			headless: true,
		});
		const page = await browser.newPage();
		await page.setCookie(...cookie);
		await page.setViewport({
			width: 1600,
			height: 900,
		});
		await page.goto(artUrl);

		const groupsMenuXpath = '//div[@tabindex="-1" and descendant::*[contains(text(), "Add to Group")]]';
		const albumsMenuXpath = '//div[@tabindex="-1" and descendant::*[contains(text(), "Gallery")]]';
		let index = 0;
		let length = 0;
		do {
			await page.click('button[data-hook="group_counter"]');
			await page.waitForXPath(groupsMenuXpath + '//img');
			const groups = await page.$x(groupsMenuXpath + '//img');
			if (!length) {
				length = groups.length;
			}

			await groups[index].click();
			try {
				await page.waitForXPath(albumsMenuXpath + '//img', { timeout: 5000 });
				await page.click('div[tabindex="-1"] img');
			} catch (e) {
				console.log('Failed to upload to group');
				await page.click('header');
			}

			await sleep(1000);
			index++;
			console.log(`Progress: [${index} / ${length}]`);
		} while (index < length);


	} catch(error) {
		console.log(error);
	}
}

module.exports.run = run;