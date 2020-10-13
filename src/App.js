import React, { Component, useState } from 'react';
import { Table, Row, Card, Input, Button, Modal, Form, Popconfirm, Divider, message } from 'antd';
import { MainLayout } from './MainLayout';
import 'antd/dist/antd.css';
import Highlighter from 'react-highlight-words';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import apiRegister from './Services/register';

class App extends Component {

  componentDidMount(){
    this.showData();
  }

  state = {
    form: {},
    loadingTable: true,
    editing: false,
    pagination: {
      pageSize: 10
    }
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }} 
          placeholder={'Localizar'}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <div>
          <Button
            type='primary'
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90, background: 'red' }}
          >
            Pesq.
          </Button>

          <Button
            onClick={() => this.handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Limpar
          </Button>
        </div>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if(visible){
            setTimeout(() => this.searchInput.select());
          }
        },
    render: text =>
        this.state.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
  });

  showData = () => {
    apiRegister.get('/', (req, res) => {
      res.send(req.data)
    })
      .then(res => this.setState((prev, props) => ( {
          ...prev.data,
          data: res.data,
          loadingTable: false
      })))
      .catch(err => console.warn(err));
  }

  handleSubmit = async e => {
    const { form } = this.state
    console.log( form.tx_nome )
    e.preventDefault();
    await apiRegister.post('/', form);
    await this.showData();
    this.setState({ visibleAdd: false });
    message.success('Cadastro realizado com sucesso');
  };

  onChange = e => {
    const value = e.target.value, key = e.target.id;

    this.setState((prev, props) => ({
      form: {
        ...prev.form,
        [key]: value
      }
    }));
  };

  onCancelModal = async () => {
    await this.setState((prev, props) => ({ 
      ...prev,
      visibleAdd: false,
      visibleEdit: false,
      form: {}
    }));
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleAdd = (e) => {
    this.setState({
      visibleAdd: true
    });
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  }

  onConfirmDelete = async (props) => {
    await apiRegister.delete(`/${props.id}`);
    await this.showData();
    message.success('Removido com sucesso');
  };

  handleEdit = async (props) => {
    await apiRegister.get(`/${props.id}`)
      .then(async res => {
        await this.setState({ 
          form: res.data[0],
          visibleEdit: true 
        });
      })
      .catch(err => console.warn(err));
      document.querySelector('#tx_nome').value = this.state.form.tx_nome;
      document.querySelector('#tx_cpf').value = this.state.form.tx_cpf;
  };

  handleSubmitEdit = async () => {    
    const { form } = this.state
    if(!form.tx_nome || !form.tx_cpf){
      message.warning('Preencha todos os campos');
      return
    } else {
      await apiRegister.put(`/${form.id}`, form);
      await this.showData();
      this.setState({ visibleEdit: false, form: {} });
      message.success('Cadastro alterado com sucesso');
    }
  };

  columns = [  

    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: 'Nome',
      dataIndex: 'tx_nome',
      key: 'tx_nome',
      align: 'center',
      ...this.getColumnSearchProps('tx_nome')
    },
  
    {
      title: 'CPF',
      dataIndex: 'tx_cpf',
      key: 'tx_cpf',
      ...this.getColumnSearchProps('tx_cpf')
    },

    {
      key: 'actions',
      title: 'Ações',
      align: 'center',
      render: (textColumn, record) => (
        <span>
          <Button 
            style={{width: 30, textAlign: 'center'}} 
            type='primary' 
            size='small' 
            onClick={() => this.handleEdit(record)}
            ghost
          >
            <EditOutlined style={{color: 'gray'}} />
          </Button>
  
          <Divider type='vertical' />
  
          <Popconfirm title='Deseja realmente apagar?' onConfirm={() => this.onConfirmDelete(textColumn)} okText='Sim' cancelText='Não'>
            <Button 
              style={{width: 30, color: 'gray'}} 
              type='primary' 
              size='small' 
              ghost 
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </span>
      )
    }
  
  ];

  render(){
    const { pagination } = this.state;
    const layout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
    return(
      <Row>
        <MainLayout content={
          <div>
            <Card style={{ width: '85%'}} title='Cadastrar' extra={
                <Button onClick={(e) => this.handleAdd(e)}>
                  <PlusOutlined />
                    Adicionar
                </Button>
              }></Card>
            <Table 
              rowKey='id' 
              size='small' 
              style={{ marginLeft: '3%', width: '100%', textAlign: 'center' }}
              dataSource={this.state.data}
              columns={this.columns} 
              onChange={this.handleChange}
              loading={this.state.loadingTable}
              pagination={pagination}
            />
          </div>
        } />

        <Modal
          title={'Cadastrar'}
          visible={this.state.visibleAdd} 
          onOk={async e => await this.handleSubmit(e)}
          onCancel={this.onCancelModal}
        >
          <Form {...layout} onChange={this.onChange}>
            <Form.Item id='tx_nome' name='tx_nome' label='Nome' rules={[{ required: true }]}>
              <Input placeholder='Nome completo' />
            </Form.Item>

            <Form.Item id='tx_cpf' name='tx_cpf' label='CPF' rules={[{ required: true }]}>
              <Input placeholder='000.000.000-00' />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={'Editar'}
          visible={this.state.visibleEdit}
          onOk={async e => await this.handleSubmitEdit(e)}
          onCancel={this.onCancelModal}
          onClick={() => this.setState({ form: {} })}
        >
          <Form {...layout} onChange={this.onChange}>
            <Form.Item id='tx_nome' name='tx_nome' label='Nome' rules={[{ required: true }]}>
              <Input 
                id='tx_nome'
                name='tx_nome'
              />
            </Form.Item>

            <Form.Item value={this.state.form.tx_cpf} id='tx_cpf' name='tx_cpf' label='CPF' rules={[{ required: true }]}>
              <Input 
                id='tx_cpf' 
                name='tx_cpf'
              />
            </Form.Item>
          </Form>
        </Modal>

        {console.log('state', this.state.form)}
      </Row>
    );
  }
}

export default App;
