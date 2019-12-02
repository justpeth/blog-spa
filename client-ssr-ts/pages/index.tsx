import * as React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import Layout, { PoetryType } from '../components/Layout/Layout';

interface IndexProps {
  poetry: PoetryType
}

const IndexPage: NextPage<IndexProps> = ({ poetry }) => (
  <Layout poetry={poetry}>
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
    <p>123156123123</p>
  </Layout>
);

IndexPage.getInitialProps = async () => {
  const res = await fetch('https://v1.jinrishici.com/all.json');
  const json = await res.json();
  let poetry: PoetryType = {
    content: json.content,
    origin: json.origin,
    author: json.author
  }
  // @ts-ignore
  console.log(json);
  return { poetry };
};

export default IndexPage;
