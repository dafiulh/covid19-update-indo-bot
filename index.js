const axios = require("axios");
const cron = require("node-cron");
const data = require("./lib/data.js");

require("dotenv").config();
process.env.TZ = "Asia/Jakarta";

let cronExpr = "0 */6 * * *";

async function postToFacebook(){
    let {total, indonesia, affected, time} = await data();
    let msg = `Update Terbaru Virus Corona (COVID-19) di Indonesia

- Terkonfirmasi: ${indonesia.infections}
- Dirawat: ${indonesia.active_cases}
- Kematian: ${indonesia.deaths}
- Sembuh: ${indonesia.recovered}

Jumlah keseluruhan korban di seluruh dunia
- Terkonfirmasi: ${total.infections}
- Dirawat: ${total.active_cases}
- Kematian: ${total.deaths}
- Sembuh: ${total.recovered}
- Tingkat kematian: ${total.mortality_rate}
- Tingkat kesembuhan: ${total.recovery_rate}
- Jumlah terdampak: ${affected} negara

Data diperbarui pada ${time}
Info selengkapnya dapat diakses di http://thewuhanvirus.com`;
    let url = "https://graph.facebook.com/" + process.env.PAGE_ID + "/feed?access_token=" + process.env.ACCESS_TOKEN + "&message=" + encodeURI(msg);
    
    await axios.post(url);

    console.log("posted to facebook on " + new Date().toLocaleString());
}

console.log("server is running now ...");

postToFacebook();
cron.schedule(cronExpr, postToFacebook, { timezone: "Asia/Jakarta" });