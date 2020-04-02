import React from 'react'
import { BrowserRouter as Router, Route, Link, HashRouter as Router1, Switch, withRouter } from 'react-router-dom'
import PlanPage from './Plan'
import HomePage from './Home'
import { Button, Drawer, message, Form, Icon, Input, Checkbox } from 'antd'
import './App.css'
import { showDrawerAction, closeDrawerAction, getNameFromCookieAction } from './store/actionCreator'
import store from './store'
import { CookiesProvider } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios'
import serverUrl from './config'
class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = store.getState()
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        axios
          .get(serverUrl+'/identify?username=' + values.username + '&&password=' + values.password)
          .then((res) => {
            //console.log(res.data)
            switch (res.data) {
              case 'WrongPass':
                message.info("密码错误~", 1)
                break
              case 'WrongUser':
                message.info("用户名错误~", 1)
                break
              case 'OK':
                message.info("登陆成功,转到主页~", 1)
                setTimeout(() => {
                  store.dispatch(closeDrawerAction())
                  const { cookies } = this.props;
                  cookies.set('name', values.username, { path: '/' });
                  window.location.reload()
                }, 1000)
                break
              default:
                break
            }
          })
      }
    });
  };
  checkSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        return true
      } else return false
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <CookiesProvider>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
        </CookiesProvider>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住我</Checkbox>)}
          <a className="login-form-forgot" href="/">
            忘记密码？
            </a>
          <Button type="primary" htmlType="submit" className="login-form-button"
            style={{ width: "100%" }}>
            登陆
                </Button>
        </Form.Item>
      </Form>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(withCookies(NormalLoginForm));
class NormalRegForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(values.password1!==values.password2) return
        console.log('Received values of form: ', values);
        axios
          .get(serverUrl+'/register?username=' + values.username + '&&password=' + values.password1)
          .then((res) => {
            //console.log(res.data)
            switch (res.data) {
              case 'WrongUser':
                message.info("用户名已注册", 1)
                break;
              case 'OK':
                message.info("注册成功,转到主页~", 1)
                //注册成功后的动作和登陆成功是一样的
                setTimeout(() => {
                  store.dispatch(closeDrawerAction())
                  const { cookies } = this.props;
                  cookies.set('name', values.username, { path: '/' });
                  window.location.reload()
                }, 1000)
                break
              default:
                message.info("注册失败，服务器返回结果错误", 1)
                break
            }
          })
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="Reg-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password1', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password2', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-reg-button"
            style={{ width: "100%" }}>
            注册
        </Button>
        </Form.Item>
      </Form>
    );
  }
}
const WrappedNormalRegForm = Form.create({ name: 'normal_login' })(withCookies(NormalRegForm));
const DrewerPage = withRouter(props => {
  return (
    <div className="demo">
      <div className="demo-nav">
        {props.is_login_page ?
          <>
            <Link to="/log" replace>登陆</Link>
            <Link
              to="/reg"
              style={{ color: "gray", fontSize: "20px", boxShadow: " 0 2px" }}
              onClick={props.clkReg}
            >注册</Link>
          </> :
          <>
            <Link
              to="/log"
              style={{ color: "gray", fontSize: "20px", boxShadow: " 0 2px" }}
              onClick={props.clkLog}
            >登陆</Link>
            <Link to="/reg" replace>注册</Link>
          </>
        }
      </div>
      <Switch>
        <Route path="/reg" component={WrappedNormalRegForm} />
        <Route path="/" exact component={WrappedNormalLoginForm} />
        <Route path="/log" component={WrappedNormalLoginForm} />
      </Switch>
    </div>
  );
});
class DrawerForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = store.getState()
    this.storeChange = this.storeChange.bind(this)
    store.subscribe(this.storeChange)
  }
  componentWillUnmount() {
    const unSubscribe = store.subscribe(this.storeChange)
    //注销掉监听器，否组store改变且该组件被卸载时，此组件方法被调用
    unSubscribe()
  }
  clkSubmit(e) {
    console.log(e)
  }
  storeChange() {
    this.setState(store.getState())
  }
  showDrawer = () => {
    store.dispatch(showDrawerAction())
  };
  onClose = () => {
    store.dispatch(closeDrawerAction())
  };
  clkReg = () => {//没写action 不用写
    this.setState({
      is_login_page: 0
    })
  }
  clkLog = () => {
    this.setState({
      is_login_page: 1
    })
  }
  render() {
    return (
      <div  >
        <Button
          style={{
            position: 'absolute',
            marginLeft: '120px',
            top: '10px'
          }}
          type="primary"
          onClick={this.showDrawer}>
          <Icon type="plus" />  加入我们
        </Button>
        <Drawer
          height={400}
          placement="top"
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Router1>
            <DrewerPage
              is_login_page={this.state.is_login_page}
              clkReg={this.clkReg}
              clkLog={this.clkLog}
              clkSubmit={this.clkSubmit}
            />
          </Router1>
        </Drawer>
      </div>
    );
  }
}
const JoinUsBtn = Form.create()(DrawerForm);
class App extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props)
    const { cookies } = props;
    //console.log(cookies.get('name'))
    store.dispatch(getNameFromCookieAction(cookies.get('name') || 'NULL'))
    this.state = store.getState()
    this.storeChange = this.storeChange.bind(this)
    //store.subscribe(this.storeChange)
  }
  handleNameChange(name) {
    const { cookies } = this.props;
    cookies.set('name', name, { path: '/' });
    this.setState({ name });
  }
  logOut() {
    
    const { cookies } = this.props;
    cookies.remove('name', { path: '/' });
    message.info('已退出~', 0.4);
    setTimeout(()=>{
      window.location.replace('/')
    },500)
    
  }
  storeChange() {
    this.setState(store.getState())
  }
  render() {
    return (
      <div >
        <Router>
          <Button style={{ position: 'absolute', marginRight: '10px', marginTop: '10px', marginLeft: '10px', width: "100px" }}
            type="primary">
            <Link to="/"> 首页</Link>
          </Button>
          {this.state.name !== 'NULL'
            ?
            <>
              <Button
                style={{ position: 'absolute', marginLeft: '120px', top: "10px", width: "130px" }}
                type="primary">
                {this.state.name}
              </Button>
              <Button
                style={{ position: 'absolute', marginLeft: '270px', top: "10px", width: "100px" }}
                onClick={this.logOut.bind(this)}
                type="primary">
                退出登陆</Button>
            </>
            : <JoinUsBtn />}
          <br />
          <br />
          <br />
          <Route path="/" exact component={HomePage} />
          <Route path="/detail:id" component={PlanPage} />
        </Router>
      </div>
    )
  }
}
export default withCookies(App)