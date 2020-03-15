let puppeteer = require('puppeteer');

module.exports = async () => {
    const browser = await puppeteer.launch({ ignoreDefaultArgs: ['--disable-extensions'] });
    const page = await browser.newPage();

    await page.goto('https://coronavirus.thebaselab.com', {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });

    let dt = new Date();
    let mthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    let time = dt.getDate() + " " + mthNames[dt.getMonth()] + " " + dt.getFullYear() + " " + dt.toLocaleTimeString();

    const data = await page.evaluate(() => {
        let items = {};
        let elems = document.querySelectorAll("#country_data > table > tbody > tr");

        [...elems].filter(el => el.firstElementChild.textContent.search(/^(indonesia|total) (?!\().*/i) !== -1).forEach((el) => {
            let col = el.children

            items[col[0].textContent.toLowerCase().substr(0, col[0].textContent.indexOf(' '))] = {
                infections: col[1].textContent,
                active_cases: col[2].textContent,
                deaths: col[3].textContent,
                recovered: col[4].textContent,
                mortality_rate: col[5].textContent,
                recovery_rate: col[6].textContent
            }
        });

        return {
            ...items,
            affected: document.querySelector(".affected_countries_numbers").textContent
        };
    });

    await browser.close();

    return {
        ...data,
        time: time
    };
};