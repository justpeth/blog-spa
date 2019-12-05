import * as React from 'react';
import { NextPage } from 'next';

import { Layout, PoetryType } from '../../components';
import fetch from 'isomorphic-unfetch';

interface ArticlePageProps {
  id: string
  poetry: PoetryType
}

const ArticlePage: NextPage<ArticlePageProps> = ({ id, poetry }) => (
  <Layout poetry={poetry}>
    {id}
  </Layout>
);

ArticlePage.getInitialProps = async ({query}) => {
  let id = query.id as string
  const res = await fetch('https://v1.jinrishici.com/all.json');
  const json = await res.json();
  let poetry: PoetryType = {
    content: json.content,
    origin: json.origin,
    author: json.author
  };
  return {id, poetry}
}

export default ArticlePage