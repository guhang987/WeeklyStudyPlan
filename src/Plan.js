import React, { Component } from 'react';
import store from './store'
import { initListAction, submitCommentAction, rpyShowAction, rpyHideAction, changeSonInputAction, submitSonCommentAction, changeSonSubmittingTAction, changeSonSubmittingFAction, deleteItemAction, undoItemAction, changeInputAction, addItemAction, cutItemAction1, cutItemAction2 } from './store/actionCreator'
import axios from 'axios';
import { Tooltip, Input, Button,  Progress, List, Badge, message, Comment, Avatar, Form } from 'antd';
import serverUrl from './config'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import moment from 'moment'
import Dw0 from './newTask'
import Dw1 from './week2day'
import Swipeout from 'rc-swipeout';
import './re-swipeout.css';

const { TextArea } = Input;
//以下是评论提交功能
const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit"
                loading={typeof (submitting) === 'string' ? submitting === 'true' : submitting}
                onClick={onSubmit} type="primary">
                提交我的评论
      </Button>
        </Form.Item>
    </div>
);
let isChange3
//input 和 area 这两个组件最好设置成为一个组件 有点混乱了
class CommentInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = store.getState()
        this.storeChange = this.storeChange.bind(this)
        this.unSubscribe = store.subscribe(this.storeChange)
    }
    unSubscribe = () => { }
    componentWillUnmount() {
        //注销掉监听器，否组store改变且该组件被卸载时，此组件方法被调用
        this.unSubscribe()
    }
    componentDidMount() {
        isChange3 = true
    }
    storeChange() {
        //console.log(isChange3)
        if (isChange3) {
            //console.log(store.getState())
            this.setState(store.getState())
            isChange3 = false
        }
    }
    handleSubmit = () => {

        if (!this.props.cookies.get('name')) {
            message.info('请先登陆哦', 2);
            return
        };
        if (!this.state.submitValue) {
            message.info('输入不能为空哦', 2);
            return;
        }
        this.setState({
            submitting: true,
        });
        setTimeout(() => {
            isChange = true
            isChange3 = true
            //改变评论区
            store.dispatch(submitCommentAction(this.props.cookies.get('name'), this.state.submitValue))
            this.setState({
                submitting: false
            })
        }, 1000);
    };
    handleChange = e => {
        this.setState({
            submitValue: e.target.value,
        });
    };
    render() {
        const { submitting, submitValue } = this.state;
        return (
            <div>
                <Comment
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Slo"
                        />
                    }
                    content={
                        <Editor
                            onChange={this.handleChange}
                            onSubmit={this.handleSubmit}
                            submitting={submitting}
                            value={submitValue}
                        />
                    }
                />
            </div>
        );
    }
}
//以下是评论区内容
//ischange用来判断子评论区是否变化，未变化不用改变state
let isChange = false
class CommentArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = store.getState()
        //this.clkReply=this.clkReply.bind(this)
        this.storeChange = this.storeChange.bind(this)
        this.unSubscribe = store.subscribe(this.storeChange)
    }
    unSubscribe = () => { }
    componentDidMount() {
        isChange = true
    }
    componentWillUnmount() {
        //注销掉监听器，否组store改变且该组件被卸载时，此组件方法被调用(其实没用)
        this.unSubscribe()
    }
    clkReply(index) {
        isChange = true
        store.dispatch(rpyShowAction(index))
    }
    storeChange() {
        //console.log(isChange)
        if (isChange) {
            this.setState(store.getState())
            isChange = false
        }
    }
    handleSubmit = (index) => {
        if (!this.props.cookies.get('name')) {
            message.info('请先登录哦', 2);
            return
        };
        if (!this.state.commentData[index].submitValue) {
            message.info('评论不能为空哦', 2);
            return;
        }
        isChange = true
        store.dispatch(changeSonSubmittingTAction(index))
        setTimeout(() => {
            isChange = true
            store.dispatch(submitSonCommentAction(this.state.commentData[index].submitValue, this.props.cookies.get('name'), index))
            isChange = true
            store.dispatch(changeSonSubmittingFAction(index))
            isChange = true
            store.dispatch(rpyHideAction(index))
        }, 1000);
    };
    handleChange = (index, e) => {
        e.persist()
        isChange = true
        store.dispatch(changeSonInputAction(e.target.value, index))
    };
    render() {
        return (
            <>
                <p />
                <List
                    locale={{ emptyText: '~' }}
                    className="comment-list"
                    bordered
                    header={`${this.state.commentData.length} 条评论`}
                    itemLayout="horizontal"
                    dataSource={this.state.commentData}
                    renderItem={(item, index) => (
                        <li>
                            <Comment
                                actions={[
                                    <span
                                        onClick={() => { this.clkReply(index) }}
                                        key="comment-list-reply-to-0">回复
                                    </span>]}
                                author={item.author}
                                avatar={item.avatar}
                                content={item.content}
                                datetime={
                                    <Tooltip title={item.datetime}>
                                        <span>{moment(item.datetime).fromNow()}</span>
                                    </Tooltip>
                                }
                            >
                                <div style={{
                                    display:
                                        item.replyVisible ? item.replyVisible : "none"
                                }}>
                                    <Editor
                                        onChange={this.handleChange.bind(this, index)}
                                        onSubmit={this.handleSubmit.bind(this, index)}
                                        submitting={item.submitting}
                                        value={item.submitValue}
                                    />
                                </div>
                                <List
                                    className="comment-list"
                                    locale={{ emptyText: " " }}
                                    itemLayout="horizontal"
                                    dataSource={item.reply}
                                    renderItem={it => (
                                        <li>
                                            <Comment
                                                actions={it.actions}
                                                author={it.author}
                                                avatar={it.avatar}
                                                content={it.content}
                                                datetime={
                                                    <Tooltip title={it.datetime}>
                                                        <span>{moment(it.datetime).fromNow()}</span>
                                                    </Tooltip>
                                                }
                                            />
                                        </li>
                                    )}
                                />
                            </Comment>
                        </li>
                    )}
                />
            </>
        );
    }
}
const CommentInputCookie = withCookies(CommentInput)
const CommentAreaCookie = withCookies(CommentArea)
//isChange2也是标志位 判断是否需要往store放数据
// eslint-disable-next-line
let isChange2 = false
class PlanPage extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = store.getState()
        this.deleteItem = this.deleteItem.bind(this)
        this.undoItem = this.undoItem.bind(this)
        this.storeChange = this.storeChange.bind(this)
        this.clickBtn = this.clickBtn.bind(this)
        this.changeInputValue = this.changeInputValue.bind(this)
        this.cutItem1 = this.cutItem1.bind(this)
        this.cutItem2 = this.cutItem2.bind(this)
        this.unSubscribe = store.subscribe(this.storeChange)
    }
    unSubscribe = () => { }
    componentDidMount() {
        axios
            .get(serverUrl + "/detail?userId=" + this.props.match.params.id)
            .then(res => {
                // 改变store中的数据
                //console.log("set true beacuse ajax")
                store.dispatch(initListAction(res.data));
                //isChange2=true
            })
            .catch(function (thrown) {
                console.log(thrown)
            })
        isChange2 = true
    }
    componentWillUnmount() {
        this.unSubscribe()
        //注销掉监听器，否组store改变且该组件被卸载时，此组件方法被调用
        //isChange2=false
    }
    render() {
        return (
            <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                <Dw0 />
                <Dw1 />
                <Progress
                    type="line"
                    status={'active'}
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#33FF00',
                    }}
                    strokeWidth={14}
                    percent={Number(this.state.data.percent)}
                    style={{ marginTop: "20px", marginBottom: "20px", marginRight: '10px' }}
                />
                <List
                    locale={{ emptyText: '~' }}
                    bordered
                    header={<div>未完成 <Badge count={this.state.data.todo_tasks} /> </div>}
                    dataSource={this.state.data.list1}
                    renderItem={(item, index) => (
                        <List.Item >
                            <Swipeout

                                left={[
                                    {
                                        text: '完成',
                                        onPress: () => this.deleteItem(index),
                                        style: { backgroundColor: '#52c41a', color: 'white' },
                                        className: 'custom-class-2'
                                    },
                                    {
                                        text: '删除',
                                        onPress: () => this.cutItem1(index),
                                        style: { backgroundColor: 'red', color: 'white' },
                                        className: 'custom-class-2'
                                    }
                                ]}
                                onOpen={() => console.log('open')}
                                onClose={() => console.log('close')}
                            >
                                <div style={{ width: "700px", height: "30px", float: "letf" }}>
                                    &nbsp;{item}
                                </div>
                            </Swipeout>
                        </List.Item>
                    )}>
                </List>
                <p></p>
                <List
                    locale={{ emptyText: '~' }}
                    bordered
                    dataSource={this.state.data.list2}
                    header={<div>已完成 <Badge count={this.state.data.total_tasks - this.state.data.todo_tasks} style={{ backgroundColor: '#52c41a' }} /> </div>}
                    renderItem={(item, index) => (
                        <List.Item >

                            <Swipeout

                                left={[
                                    {
                                        text: '撤销完成',
                                        onPress: () => this.undoItem(index),
                                        style: { backgroundColor: '#52c41a', color: 'white' },
                                        className: 'custom-class-2'
                                    },
                                    {
                                        text: '删除',
                                        onPress: () => this.cutItem2(index),
                                        style: { backgroundColor: 'red', color: 'white' },
                                        className: 'custom-class-2'
                                    }
                                ]}
                                onOpen={() => console.log('open')}
                                onClose={() => console.log('close')}
                            >
                                <div style={{ width: "700px", height: "30px", float: "letf" }}>
                                    &nbsp; <del>{item}</del>
                                </div>
                            </Swipeout>


                           
                            
                        </List.Item>
                    )}>
                </List>
                <CommentAreaCookie />
                <CommentInputCookie />
            </div>
        );
    }
    userCheck(name) {
        const { cookies } = this.props;
        return name === cookies.get('name')
    }
    storeChange() {
        this.setState(store.getState())
        // console.log("change",isChange2)
        // //console.log(isChange2)
        // if (isChange2) {
        //     isChange2 = false
        // }
    }
    deleteItem(index) {
        if (!this.userCheck(this.state.name)) return message.info("只能查看别人的任务哦")
        const action = deleteItemAction(index)
        isChange2 = true
        store.dispatch(action)
    }
    undoItem(index) {
        if (!this.userCheck(this.state.name)) return message.info("只能查看别人的任务哦")
        const action = undoItemAction(index)
        isChange2 = true
        store.dispatch(action)
    }
    changeInputValue(e) {
        if (!this.userCheck(this.state.name)) return message.info("只能查看别人的任务哦")
        const action = changeInputAction(e.target.value)
        isChange2 = true
        store.dispatch(action)
    }
    clickBtn() {
        if (!this.userCheck(this.state.name)) return message.info("只能查看别人的任务哦")
        const action = addItemAction()
        isChange2 = true
        store.dispatch(action)
    }
    cutItem1(index) {
        if (!this.userCheck(this.state.name)) return message.info("只能查看别人的任务哦")
        const action = cutItemAction1(index)
        isChange2 = true
        store.dispatch(action)
    }
    cutItem2(index) {
        if (!this.userCheck(this.state.name)) return message.info("只能查看别人的任务哦")
        const action = cutItemAction2(index)
        isChange2 = true
        store.dispatch(action)
    }
}
export default withCookies(PlanPage);