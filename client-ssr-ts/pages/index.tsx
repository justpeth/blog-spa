import * as React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import Layout from '../components/Layout/Layout';

import {
  Button,
  message
} from 'antd'

const IndexPage: NextPage = () => (
  <Layout title="aasa">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
    <Button type="primary" onClick={
     e =>message.info('This is an error message')
    }>button</Button>
  </Layout>
);

export default IndexPage;
