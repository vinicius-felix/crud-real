import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { MainLayout } from './MainLayout';

class PageNotFound extends Component{
  render(){
    return(
      <MainLayout content={<h1> Page Not Found </h1>} />
    )
  }
}

export default PageNotFound;