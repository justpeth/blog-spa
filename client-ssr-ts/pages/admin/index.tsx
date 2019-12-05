import * as React from 'react';
import { NextPage } from 'next';

import { Dashboard, Editor } from '../../components';

const AdminPage: NextPage = () => (
  <Dashboard>
    <Editor></Editor>
  </Dashboard>
);

export default AdminPage