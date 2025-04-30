import { json } from 'stream/consumers';

const axios = require('axios');
const { JSDOM } = require('jsdom');
const express = require('express');
const fs = require('fs')


const app = express();
const PORT = process.env.PORT;

app.use(express.static('public')) //to serve files from the public directory

//test route
app.get('/test',(req,res) => {
  const data = fs.readFileSync("test.json")
  const jsondata = JSON.parse(data)
  res.json(jsondata)
})

//main route
app.get('/search',async(require,res) => {

  const keyword = require.query.q;

  const encodedKeyword = encodeURIComponent(keyword);
  const url = `https://www.amazon.com/s?k=${encodedKeyword}`;

  const randomDelay = Math.floor(Math.random() * 2300) + 1000

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  await delay(randomDelay); // sets a delay time between 1000 and 2300 ms, to try and avoid blocks
                            //still possibly happens

  try{
  const { data: html } = await axios.get(url, {
    headers: { //use user-agent to seem more "human"
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });


    const dom = new JSDOM(html);
    const document = dom.window.document;
    const results = [];

    const items = document.querySelectorAll('div[data-component-type="s-search-result"]');
    console.log(`Encontrados ${items.length} resultados.`);

    items.forEach((item, i) => {
      //tries to collect data by searching for css classes in tags, if unavailabe uses placeholders
      const title = item.querySelector('a h2 span')?.textContent.trim() || 'no title';
      let price = item.querySelector('span.a-price-whole')?.textContent.trim() || null
      const priceFraction = item.querySelector('span.a-price-fraction')?.textContent.trim() || null
      const imgLink = item.querySelector('img.s-image')?.getAttribute('src') || 'image unavailable'
      const rating = item.querySelector('span.a-icon-alt')?.textContent.trim()|| '0';
      const reviewNumber = item.querySelector('span.a-size-base.s-underline-text')?.textContent.trim() ||'unavailable'
      const productLink = item.querySelector('a.a-link-normal')?.getAttribute('href') || 'unavailable'


      if(price != null && priceFraction != null)
        price = `$${price}${priceFraction}`
      else if(price == null)
        price = 'see options' //most prices are not available because there are diferent models to choose from
                              //in this case the user can be redirected to the amazon product url
      results.push({title,price,imgLink,rating,reviewNumber,productLink})
    });
    res.json({
      keyword: keyword,
      total: results.length,
      results
    })
  }  catch (error) {
    if(error.message.includes("503")){
      res.status(503).json({error: "Amazon returned code 503, possible block"})
      return
    }
    res.status(500).json({error: "Failed to get amazon data"})
  }
  
})


app.listen(PORT, () =>{
  console.log(`Server listening at http://localhost:${PORT}`)
})


