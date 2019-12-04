import * as React from "react";
import { NextPage } from "next";
import fetch from "isomorphic-unfetch";
// import { PoetryType } from "../components/Layout/Layout";
import { Layout, IndexArticles, PoetryType } from "../components";
import { withApollo } from "../apollo";
interface IndexProps {
  poetry: PoetryType;
}
const IndexPage: NextPage<IndexProps> = ({ poetry }) => (
  <Layout poetry={poetry}>
    <IndexArticles />
  </Layout>
);

IndexPage.getInitialProps = async () => {
  const res = await fetch("https://v1.jinrishici.com/all.json");
  const json = await res.json();
  let poetry: PoetryType = {
    content: json.content,
    origin: json.origin,
    author: json.author
  };
  return { poetry };
};

export default withApollo(IndexPage, {});
