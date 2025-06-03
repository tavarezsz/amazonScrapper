# amazonscrapper
This is a small project aimed at scrapping the amazon website and the return the first page of results base on a keyword

To install dependencies bun muste be already installed(instalation guide: https://bun.sh/docs/installation):

```bash
bun install
```

how to run:

```bash
bun start
```

The server runs by default at http://localhost:3000. Just copy and paste it into the browser after running the scipt.

Observations:

Some prices might not appear in the frontend due to having multiple options to choose from.
In this case amazon stores the prices for diferent options in another url. In this case, i choose to redirect the user to the amazon page by clicking in the product title

Im using some countermesures but amazon might still block the requests due to bot-like activity
