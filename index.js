require('dotenv').config()
const http = require('http');
const fs = require('fs');
const requests = require('requests');
const path = require('path');
const KtoC = (feh) => {
    return ((feh-273.15).toFixed(2));
}
const homeFile = fs.readFileSync("home.html", "utf8");

const replaceVal = ((tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", KtoC(orgVal.main.temp));
    temperature = temperature.replace("{%tempmin%}", KtoC(orgVal.main.temp_min));
    temperature = temperature.replace("{%tempmax%}", KtoC(orgVal.main.temp_max));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("<%descript%>", orgVal.weather[0].description);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
})

const server = http.createServer((req, res) => {
    if(req.url == '/'){
        const apikey = process.env.APIKEY;
        requests(`http://api.openweathermap.org/data/2.5/weather?q=Rourkela&appid=${apikey}`)
        .on('data', (chunk) => {
            const obj = JSON.parse(chunk);
            const array = [obj];
            //console.log(array[0].main.temp);
            const realtime = array.map((val) => replaceVal(homeFile, val)) //console.log(val.main);
            .join("")
        res.write(realtime);
        console.log(realtime)
    })
    .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
    });
    }
})

server.listen(8000, (req, res) => {
    console.log(`listening on port 8000`);
})