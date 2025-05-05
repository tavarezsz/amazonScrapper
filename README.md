# amazonscrapper

To install dependencies(bun must be already installed):

```bash
bun install
```

how to run:

```bash
bun start
```

The server runs by default at http://localhost:3000. Just copy paste it into the browser.

Observations:

Some prices might not appear in the frontend due to having multiple options to choose from.
In this case amazon stores the prices for diferent options in another url. In this case, i choose to redirect the user to the amazon page by clicking in the product title

Im using some countermesures but amazon might still block the requests due to bot-like activity
