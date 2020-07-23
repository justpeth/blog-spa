import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import './blog.scss';

import { Header, Footer, NotFound } from '@components';
import { loadable } from '@config';

const Home = loadable(() => import('@pages/home'));
const ArticleDetail = loadable(() => import('@pages/detail'));
const Tags = loadable(() => import('@pages/tags'));
const Archive = loadable(() => import('@pages/archive'));
const TagArticles = loadable(() => import('@pages/tagArticles'));
const SearchArticles = loadable(() => import('@pages/searchArticles'));
const TestEditor = loadable(() => import('@pages/test-editor'))

const Blog = () => {
  let { path, url } = useRouteMatch();
  return (
    <div className="blog-main">
      <Header url={url} />
      <Switch>
        <Route exact path={path} component={Home}></Route>
        <Route path={`${path}/detail/:id`}>
          <ArticleDetail blog></ArticleDetail>
        </Route>
        <Route path={`${path}/tags`} component={Tags}></Route>
        <Route path={`${path}/tag/:id`} component={TagArticles}></Route>
        <Route path={`${path}/search/:filter`} component={SearchArticles}></Route>
        <Route path={`${path}/archive`} component={Archive}></Route>
        <Route path={`${path}/editor`} component={TestEditor}></Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  )
};

export default Blog;