const express = require('express');
const axios = require('axios');
const os = require('os');
const bodyParser = require('body-parser');

const {title,c} = require("./beautyConsole")

const app = express();
const PORT = 3005;
const PROXY_URL = "http://localhost:3001";

const proxy = axios.create({
  baseURL: PROXY_URL
});


app.use(bodyParser.json());

app.all('*', async (req, res) => {
  try {
    const startTime = Date.now();
    console.log("\n".repeat(3) + c("yellow") + title("REQUEST") + c("reset"))
    console.log(c("red") + `Incoming request: ${req.method} ${req.originalUrl}` + c("reset"));
    console.log(c("cyan")+ `Headers: ${JSON.stringify(req.headers, null, 2)}` + c("reset"));
    console.log(c("magenta") +`Body: ${JSON.stringify(req.body, null, 2)}` + c("reset"));
    
    let response;
    if (PROXY_URL !== "") {
      
      const conf = {headers: req.headers};
      
      const {data, status, headers} = await   proxy[req.method.toLowerCase()](req.originalUrl, req.body);
      response = data;
      
      console.log(c("yellow") + title("RESPONSE") + c("reset") )
      console.log(c("green") + `Response: ${JSON.stringify(response, null, 2)}` + c("reset"));
      console.log(c("cyan") + `Response Status Code: ${status}` + c("reset"));
      console.log(c("magenta") + `Content-Type: ${headers["content-type"]}` + c("reset"));
      
    } else {
      // If no PROXY_URL is defined, just return a success message
      response = { message: 'API endpoint called successfully' };
    }

    const endTime = Date.now();
    const elapsedStr = `${endTime - startTime}ms`;


    console.log(c("yellow") + title("END "+elapsedStr ) + c("reset") )

    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});




app.listen(PORT, () => {
  // Find the IPv4 addresses for internal network interfaces
  const interfaces = os.networkInterfaces();
  const addresses = Object.values(interfaces)
    .flat()
    .filter(iface => iface.family === 'IPv4' && !iface.internal)
    .map(iface => iface.address);

  const localUrl = `http://localhost:${PORT}`;
  const networkUrl = `http://${addresses.length > 0 ? addresses[0] : 'localhost'}:${PORT}`;

  console.log(c("yellow",title(`API running at:`)))
  console.log(c("yellow",`- Local:   ${localUrl}`))
  console.log(c("yellow",`- Network: ${networkUrl}`));
  console.log(c("yellow",title()))


});





//UTILS

