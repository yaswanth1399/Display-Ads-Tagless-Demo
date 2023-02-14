const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

const gamImpression = (requestUrl) => {
    fetch(requestUrl)
        .then((impressionRes) => {
            console.log(impressionRes);
        })
    console.log("Impression-Tracking: Ping done")
};

const taglessRequest = () => {
    const trEndpoint = 'https://securepubads.g.doubleclick.net/gampad/adx?',
          adUnitCode = '/6355419/Travel/Europe/France/Paris',
          creativeSize = '300x250',
          adHost = 'www.example.com',
          cacheBust = Math.round(new Date().getTime() / 1000);

    let url = trEndpoint + 'iu=' + adUnitCode + '&sz=' + creativeSize + '&url=' + adHost + '&c=' + cacheBust + '&tile=1&d_imp=1&d_imp_hdr=1';
    return url;
};

app.use('/assets', express.static('assets'));
app.use('/img', express.static('img'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/views/index.html');
});

app.get('/iframe.html', (req, res) => {
    res.sendFile(path.join(__dirname) + '/views/iframe.html');
});

app.get('/get-ad', (req, res) => {
    const url = taglessRequest();

    fetch(url).then((adResponse) => {
        const impressionPing = adResponse.headers.get('google-delayed-impression');
        gamImpression(impressionPing);
        return adResponse.text();
    })
    .then((adText) => {
        res.send(adText);
    })
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname) + '/views/contact.html');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, _ => {
    console.log(`App deployed at Port ${PORT}`);
});
