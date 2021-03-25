import { GetServerSideProps } from 'next';
import React from 'react';
import { redirectQuery } from '../utils/graphql';

export default function Redirect(): JSX.Element {
  return (
    <div>
      Go back to home
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({params, res}) => {
  const {link} = params;
  const contentfulRes = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    body: JSON.stringify({query: redirectQuery(link)}),
  });
  const {data, error} = await contentfulRes.json();
  const redirect = data?.redirectCollection?.items;
  if (redirect.length) {
    res.writeHead(301, {location: redirect[0].url});
    res.end();
  }
  return {props: {}};
}