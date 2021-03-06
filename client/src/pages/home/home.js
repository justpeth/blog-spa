import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { List, NetError, Loading } from '@components';
import { ARTICLES } from '@graphql';
 

const Home = () => {
  let { data, loading, error } = useQuery(ARTICLES);
  if (loading) {
    return <Loading title="日志寻找中..."></Loading>
  }
  if (error) {
    return <NetError description={error.message}></NetError>
  }
  let articles = [];
  if (data) {
    articles = data.articles
  }
  return (
    <div className="main-content">
      <List list={articles}></List>
    </div>
  )
}

export default Home;