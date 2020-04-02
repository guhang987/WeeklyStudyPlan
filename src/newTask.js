import React from 'react';
import store from './store'
import { saveStep1Action } from "./store/actionCreator"
import { Form, InputNumber,List, Select, Tooltip, Icon, Input, Drawer, Button, message } from 'antd';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
const { Option } = Select;
class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tasks: store.getState().data.list0 }
        this.storeChange = this.storeChange.bind(this)
        this.unSubscribe = store.subscribe(this.storeChange)
    }
    storeChange() {
        this.setState({ tasks: store.getState().data.list0 })
    }
    componentWillUnmount() {
        this.unSubscribe()
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log(values)
                this.props.form.resetFields('u2');
                this.props.form.resetFields('u3');
                //console.log('Received values of form: ', values);
                let index = this.state.tasks.findIndex((obj) => {
                    return obj.name === values.u1
                })
                //保存元素个数
                if (index === -1) {
                    //没找到
                    let newState = this.state.tasks
                    if(values.u3===1){
                        newState = [
                            {
                                detail: [{  x: 0, y: 0, w: 1, h: 1, i: `c_1_${values.u2}`,name: values.u2 }],
                                name: values.u1,
                            },
                            ...newState,
                        ]
                    }else{
                        //已有类被
                        console.log()
                        let detail=[]
                        for(let i=1;i<=values.u3;i++){
                            detail.unshift({
                                x: 0, y: 0, w: 1, h: 1,i: `c_1_${values.u2}(${i}/${values.u3})`,  name: `${values.u2}(${i}/${values.u3})`
                            })
                        }
                        newState = [
                            {
                                detail: detail,
                                name: values.u1,
                            },
                            ...newState,
                        ]
                    }
                    this.setState({
                        tasks: newState
                    })
                    store.dispatch(saveStep1Action(newState))
                } else {
                    let newState = this.state.tasks
                    //console.log(newState)
                    if(values.u3===1){
                        newState[index].detail.unshift({ i: 'c_' + (index) + '_' + values.u2, x: 0, y: 0, w: 1, h: 1, name: `${values.u2}` })
                    }else{
                        for(let i=1;i<=values.u3;i++){
                            newState[index].detail.unshift({ i: 'c_' + (index) + '_' + values.u2+i, x: 0, y: 0, w: 1, h: 1, name: `${values.u2}(${i}/${values.u3})` })
                        }
                    }
                    this.setState({
                        tasks: newState
                    })
                    //console.log(newState)
                    store.dispatch(saveStep1Action(newState))
                }
                //console.log(store.getState().data.list0)
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} layout="inline" className="login-form">
                <Form.Item>
                    {getFieldDecorator('u1', {
                        rules: [{ required: true, message: 'Please input your !' }],
                    })(
                        <Select  placeholder="类型" style={{ width: 80 }} >
                        <Option value="学习">学习</Option>
                        <Option value="工作">工作</Option>
                        <Option value="运动">运动</Option>
                        <Option value="阅读">阅读</Option>
                        <Option value="娱乐">娱乐</Option>
                        <Option value="生活">生活</Option>
                        <Option value="其他">其他</Option>
                      </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('u2', {
                            rules: [{ required: true, message: 'Please input your !' }],
                        })
                            (
                                <Input
                                    style={{ width: "100%" }}
                                    type="具体内容"
                                    placeholder="具体内容"
                                    suffix={
                                        <Tooltip title="具体内容是XXXX">
                                            <Icon type="question-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                />,
                            )}
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('u3', {
                            rules: [{ required: true, message: 'Please input your !' }],
                        })
                            (
                               <InputNumber 
                                style={{ width: "100px" }}
                                min={1} 
                                max={7} 
                                placeholder="重复次数"
                                 />
                            )}
                </Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                        +
            </Button>               
                {this.state.tasks.map(
                    (it, ind) => {
                        return (
                            <div key={'3' + it.name}>
                                <List
                                    style={{ width: "100%", marginTop: "10px" }}
                                    size="small"
                                    header={<p><strong>{it.name}</strong>
                                        <Icon
                                            type="close-circle"
                                            onClick={() => {
                                                let newState = this.state.tasks
                                                newState.splice(ind, 1)
                                                this.setState({ tasks: newState })
                                                //保存到redux-->mongodb
                                                store.dispatch(saveStep1Action(newState))
                                            }}
                                            style={{ right: '20px', fontSize: '150%', position: 'absolute' }}
                                            theme="twoTone"
                                        />
                                    </p>
                                    }
                                    bordered
                                    dataSource={it.detail}
                                    renderItem={(item, i) =>
                                        <div key={'2' + item.name}>
                                            <List.Item key={'1' + item.name}><p>{item.name}</p>
                                                <Icon
                                                    type="close-circle"
                                                    onClick={() => {
                                                        let newState = this.state.tasks
                                                        newState[ind].detail.splice(i, 1)
                                                        this.setState({ tasks: newState })
                                                        store.dispatch(saveStep1Action(newState))
                                                    }}
                                                    style={{ right: '20px', fontSize: '150%', position: 'absolute' }}
                                                    theme="twoTone"
                                                />
                                            </List.Item>
                                        </div>
                                    }
                                />
                            </div>
                        )
                    }
                )
                }
            </Form>
        );
    }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login1' })(NormalLoginForm);
class Dw0 extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = { visible: false,name:store.getState().name };
    }
    componentDidMount(){
        console.log("did mount")
        //console.log("store.name="+store.getState().name+"   my name="+this.state.name)
        //调试发现，store更新name值比组件挂载晚，导致组件获取的name值是旧值
        //强制等1s后再去store拿name值。能不能用异步函数来做？
        setTimeout(()=>{this.setState ({ name:store.getState().name })},100)
    }
    //unSubscribe = () => { }
    showDrawer = () => {
        if (!this.userCheck(this.state.name)) return message.info("只能查看别人的任务哦")
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        //console.log(this.state.tasks)
        this.setState({
            visible: false,
        });
    };
    onFinish = values => {
        console.log('Success:', values);
    };
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    userCheck(name) {
        const { cookies } = this.props;
        //console.log("cookie user='"+cookies.get('name')+"'",name)
        return name === cookies.get('name')
    }
    render() {
        const { cookies } = this.props;
        return (
            <div style={this.state.name === cookies.get('name')?{ display: "inline-block",  }:{display: "none"}}>
                <Button type="primary" onClick={this.showDrawer}>
                    Step1:写下周计划
                </Button>
                <Drawer
                    title={<>
                        <Button
                            type="primary"
                            style={{ float: "left", marginLeft: "10px" }}
                            onClick={this.onClose}
                        ><Icon type="left" />保存</Button>
                    详细地写下具体任务💖
                    </>}
                    placement="top"
                    height="100%"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <WrappedNormalLoginForm />
                </Drawer>
            </div>
        );
    }
}
export default withCookies(Dw0)