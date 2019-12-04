import React, { useState } from "react";

import BlogLayout from "../Layout";
import "./Dashboard.styl";

import { Layout, Menu, Breadcrumb, Icon } from "antd";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard: React.FunctionComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <BlogLayout title="控制台" footer={false} header={false}>
      <Layout style={{ height: "100vh" }}>
        <Sider theme="light" trigger={null} collapsible collapsed={collapsed} width={150} className="darshboard-sider">
          <div className="dashboard-logo">H。</div>
          <Menu mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Icon type="snippets" />
              <span>日志</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>标签</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>友链</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="upload" />
              <span>Me</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Icon
              className="dashboard-trigger"
              type={collapsed ? "menu-unfold" : "menu-fold"}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            />
            <span className="dashboard-sitename">烟雨不尽夜流离</span>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: 280
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </BlogLayout>
  );
};

export default Dashboard;
