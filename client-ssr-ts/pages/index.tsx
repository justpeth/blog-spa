import * as React from "react";
import Link from "next/link";
import { NextPage } from "next";
import Layout from "../components/Layout/Layout";

const IndexPage: NextPage = () => (
  <Layout title="aasa">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
