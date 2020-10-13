import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout, Row, Col } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Footer, Content, Sider } = Layout;
const fillWindow = {
  height: '100%',
  position: 'absolute',
  left: '0',
  width: '100%',
  overflow: 'hidden'
}

const colorWhite = {
  color: 'white'
}

const paddingAll = {
  padding: 10
}

export class MainLayout extends Component {

  render(){
    return(
      <div>
        <MainLayoutSite content={this.props.content} />
      </div>
    )
  }
}

const MainLayoutSite = (props) => (
  
  <Layout style={fillWindow}>

    <Header style={{backgroundColor: '#990000' }}>
      <Col span={3}></Col>
      <Col span={18}>
        <h3 style={{...colorWhite, textAlign: 'center'}}>Real Jurídica</h3>
      </Col>
      <Col span={3}>        
        
      </Col>
    </Header>

    <Layout style={{ backgroundColor: 'white' }}>

      <Sider style={{ backgroundColor: '#1c1c1c', paddingTop: "14%" }}>
        
        <Row key="home" style={paddingAll}>
          <Col span={2} />
          <Col span={4}><HomeOutlined style={{color: 'red', fontSize: 25}} /></Col>
          <Col span={10}><Link style={{color: 'white'}} to="/">Início</Link></Col>            
          <Col span={5} />
        </Row>

      </Sider>

      <Content style={{ backgroundColor: 'white', paddingLeft: '0%', margin: 0, minWidth: '100%' }}> {/* white */}

        <Col span={2} />

        <Col span={20} style={{ paddingTop: 0 }}>
          {props.content}
        </Col>

        <Col span={2} />

      </Content>
    </Layout>

    <Footer style={{fontSize: 10, textAlign: 'center', backgroundColor: '#e3e3e3'}}></Footer>
    
  </Layout>    
);