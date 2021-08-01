import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Home.module.scss';
import { contentfulQuery } from '../utils';

interface Link {
  url: string;
  displayName: string;
  icon: {url: string}
}

interface HomeProps {
  links: Link[];
}

export default function Home(props: HomeProps): JSX.Element {
  const {links} = props;
  const [dragging, setDragging] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current);
  }, []);

  const onDrag = useCallback(() => {
    setDragging(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setDragging(false), 250);
  }, [dragging]);

  const handleClick = (e) => {
    if (!dragging) return;
    e.preventDefault();
    e.stopPropagation();
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Bryan's Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.desktop}>
        {links.map(({url, displayName, icon}) =>
            <Draggable
              onDrag={onDrag}
              key={displayName}>
                <div className={styles.iconWrapper} onClick={handleClick}>
                  <a href={url} target='_blank' rel='noreferrer'>
                    <div className={styles.icon}>
                      {icon && <img src={icon.url} draggable='false' />}
                      <div>
                        {displayName}
                      </div>
                    </div>
                  </a>
                </div>
            </Draggable>
        )}
      </div>
      <div className={styles.taskbar}>
        <button className={styles.startButton}>
          <Image src={'/windows.png'} width='16' height='16'/>
          <div id={styles.text}>Start</div>
        </button>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    body: JSON.stringify({query: contentfulQuery}),
  });
  const {data} = await res.json();
  const links = data?.redirectCollection?.items;
  console.log(links);
  return { props: {links} };
}
