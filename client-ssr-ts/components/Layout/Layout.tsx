import * as React from 'react';
import Head from 'next/head';
import './Layout.styl';

import Header from '../Header';
import Footer from '../Footer';

type LayoutProps = {
  title?: string;
  poetry?: PoetryType;
  footer?: boolean;
  header?: boolean;
};

export interface PoetryType {
  author: string;
  content: string;
  origin: string;
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  children,
  title,
  poetry,
  header = true,
  footer = true
}) => {
  let defaultTitle = '烟雨不尽夜流离';
  title = title ? `${title} | ${defaultTitle}` : defaultTitle;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="//at.alicdn.com/t/font_809308_9oclrjzs1vu.css"
        />
        <link
          href="//fonts.loli.net/css?family=Zilla Slab:300,300italic,400,400italic,700,700italic&subset=latin&text=!%22%23%24%25%26%27()*%2b%2c-.%2f0123456789%3a%3b%3c%3d%3e%3f%40ABCDEFGHIJKLMNOPQRSTUVWXYZ%5b%5c%5d%5e_%60abcdefghijklmnopqrstuvwxyz%7b%7c%7d%7e%e2%80%98%e2%80%99"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="stylesheet" href="/fonts/font.css" />
        <link rel="stylesheet" href="/HProgress/HProgress.css" />
        <script src="/HProgress/HProgress.js" />
      </Head>
      <script>HProgress.start();</script>
      {header && footer ? (
        <div className="blog-mian">
          {header && <Header poetry={poetry} />}
          {children}
          {footer && <Footer />}
        </div>
      ) : (
        <>
          {children}
        </>
      )}

      <script>HProgress.done()</script>
    </>
  );
};

export default Layout;
