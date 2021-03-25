const { writeFileSync } = require('fs');
const fetch = require('node-fetch');
require('dotenv').config({path: `${__dirname}/../.env.local`});

const contentfulQuery = `{
  redirectCollection {
    items {
      url
      redirectPath
    }
  }
}`;

const main = async () => {
  console.log(process.env.SPACE_ID);
  const contentfulRes = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query: contentfulQuery }),
  });
  const {data, error} = await contentfulRes.json();
  const redirects = data?.redirectCollection?.items.map(({redirectPath, url}) => {
    return {
      source: `/${redirectPath}`,
      destination: url,
    };
  });
  writeFileSync(`${__dirname}/../vercel.json`, JSON.stringify({ redirects }, null, 2));
}

main();