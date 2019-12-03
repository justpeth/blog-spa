import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ARTICLES } from '../../apollo/queries';

const IndexArticles: React.FunctionComponent = () => {
  const { loading, error, data, networkStatus } = useQuery(ARTICLES);
  console.log(data);
  return <div>list</div>;
};

export default IndexArticles;
