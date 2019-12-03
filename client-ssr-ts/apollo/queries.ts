import gql from 'graphql-tag';
// 获取后台自己的文章列表
export const ARTICLES = gql`
  {
    articles {
      id
      title
      formatDate
      updatedAt
      summary
      tags {
        id
        name
      }
    }
  }
`;