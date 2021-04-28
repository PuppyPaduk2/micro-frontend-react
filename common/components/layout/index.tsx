import React, { FC, ReactNode } from 'react';
import { Layout as ALayout, Menu, Breadcrumb } from "antd";

const { Header, Content, Footer } = ALayout;

type Props = {
  headerExtra?: ReactNode;
  footer?: ReactNode;
};

export const Layout: FC<Props> = (props) => {
  return (
    <ALayout className="layout" style={{ height: "100%" }}>
      <Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </div>
          <div style={{ color: "#ffffff" }}>
            {props.headerExtra}
          </div>
        </div>
      </Header>
      <Content style={{ padding: '0 48px', height: "100%" }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item> */}
        </Breadcrumb>
        <div style={{ padding: '24px', backgroundColor: "white", height: "100%" }}>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {props.footer}
      </Footer>
    </ALayout>
  )
};
