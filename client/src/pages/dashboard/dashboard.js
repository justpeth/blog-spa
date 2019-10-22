import React from 'react';
import { Switch, useRouteMatch, Route, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import './dashboard.scss';

import { DashboardHeader, LoginedRoute, NotFound } from '@components';
import {DashboardLogin, DashboardArchives, DashboardTags, DashboardRegister} from '@pages';
import { useStore } from '@config';
import { ME_QUERY } from '@graphql'

const Dashboard = () => {
  let { path, url } = useRouteMatch();
  const { data } = useQuery(ME_QUERY);
  const { isLogin, changeLoginStatus } = useStore('user');
  if (data && data.me && data.me.code === 0 && !isLogin) {
    changeLoginStatus(data.isAdmin, true);
  }
  return (
    <div className="dashboard">
      <DashboardHeader url={url} />
      <Switch>
        <LoginedRoute exact path={path} render={() => <Redirect to={`${path}/archives`} />}></LoginedRoute>
        <Route path={`${path}/login`}>
          <DashboardLogin />
        </Route>
        <Route path={`${path}/register`}>
          <DashboardRegister />
        </Route>
        <LoginedRoute path={`${path}/archives`} component={DashboardArchives}></LoginedRoute>
        <LoginedRoute path={`${path}/tags`} component={DashboardTags}></LoginedRoute>
        <Route component={NotFound} />
      </Switch>
    </div>
  )
};

export default Dashboard;