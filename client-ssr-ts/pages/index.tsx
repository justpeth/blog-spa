import * as React from "react";
import Link from "next/link";
import { NextPage } from "next";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout/Layout";

const IndexPage: NextPage = () => (
  <Layout title="首页">
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
  const res = await fetch("https://v1.jinrishici.com/all.json");
  const json = await res.json();
  console.log(json);
  return { stars: json.stargazers_count };
};

export default IndexPage;
