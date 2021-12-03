require('dotenv').config();
const fetch = require('isomorphic-fetch');
const fs = require('fs');

const [,, day] = process.argv;

const session = process.env.session;

fetch(`https://adventofcode.com/2021/day/${day}/input`, {
  "headers": {
    "cookie": `session=${session}`
  },
  "method": "GET",
})
.then(data => data.text())
.then(data => data.split('\n').filter(el => el))
.then(data => {
  const dataStr = `
const data = ${JSON.stringify(data, null, 2)};

module.exports = { data };
  `.trim();

  fs.writeFile(`./data/day${day}.js`, dataStr, (err) => {
    if (err) {
      console.log({ err });
      return;
    }

    console.log(`Fetched data for day ${day}, exported as 'data' from './data/day${day}.js'`);
  });
});
