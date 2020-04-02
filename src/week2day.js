import React from 'react';
import store from './store'
import { saveStep2Action,saveList1Action } from './store/actionCreator'
import { Collapse, message,Icon, Drawer, Button } from 'antd';
import GridLayout from 'react-grid-layout';
import "./week2day.css"
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
const { Panel } = Collapse;
let layoutHasChanged = 0
class Dw1 extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        // var layout = [
        //     {
        //         name: "跑步",
        //         detail: [
        //             { i: 'c1_1', x: 0, y: 0, w: 1, h: 1, name: "跑步5km" },
        //             { i: 'c1_2', x: 0, y: 0, w: 1, h: 1, name: "跑步3km" },
        //             { i: 'c1_3', x: 0, y: 0, w: 1, h: 1, name: "跑步5km" },
        //             { i: 'c1_4', x: 0, y: 0, w: 1, h: 1, name: "跑步7km" },
        //             { i: 'c1_5', x: 0, y: 0, w: 1, h: 1, name: "跑步5km" },
        //             { i: 'c1_6', x: 0, y: 0, w: 1, h: 1, name: "跑步5km" },]
        //     },
        //     {
        //         name: "跑步2",
        //         detail: [
        //             { i: 'c2_1', x: 0, y: 0, w: 1, h: 1, name: "跑步5km" },
        //             { i: 'c2_2', x: 0, y: 0, w: 1, h: 1, name: "跑步3km" },
        //         ]
        //     },
        //     {
        //         name: "跑步3",
        //         detail: [
        //             { i: 'c3_1', x: 0, y: 0, w: 1, h: 1, name: "跑步5km" },
        //         ]
        //     },
        // ]
        this.storeChange = this.storeChange.bind(this)
        this.unSubscribe = store.subscribe(this.storeChange)
        this.state = { layout: store.getState().data.list0, visible: false, list0: [], list1: [] };
    }
    componentDidMount() {
        console.log("did mount")
        //console.log("store.name="+store.getState().name+"   my name="+this.state.name)
        //调试发现，store更新name值比组件挂载晚，导致组件获取的name值是旧值
        //强制等0.1s后再去store拿name值。能不能用异步函数来做？
        //没有清除计时器，是因为相信用户在页面上最少停留一秒
        setTimeout(() => { this.setState({ name: store.getState().name }) }, 100)
    }
    unSubscribe = () => { }
    componentWillUnmount() {
        this.unSubscribe()
        //注销掉监听器，否组store改变且该组件被卸载时，此组件方法被调用
    }
    storeChange() {
        let oldLayout = store.getState().data.list0
        this.lastlayout = oldLayout
        let layout = []
        for (let x in oldLayout) {
            layout.push(oldLayout[x])
        }
        if (this.state.layout !== layout) {
            this.setState({ layout: layout })
        }
    }
    userCheck(name) {
        const { cookies } = this.props;
        //console.log("cookie user='" + cookies.get('name') + "'", name)
        return name === cookies.get('name')
    }
    showDrawer = () => {
        if (!this.userCheck(this.state.name)) return message.info("只能查看别人的任务哦")
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        //这里BUG 当用户第二次关闭时，给服务器保存了NULL，且控制台报错
        //console.log(this.props.layout)
        this.setState({
            visible: false,
        });
        if (layoutHasChanged === 1) {
            //console.log("保存layout到redux")
            //layout不变时，不保存list
            layoutHasChanged = 0;
            store.dispatch(saveStep2Action(this.state.list1))
        }
    };
    onLayoutChange = (e) => {
        if(this.state.visible===false) return
        layoutHasChanged = 1
        for (let x in e) {
            let name = e[x].i
            //console.log(name.lastIndexOf('_'))
            name = name.substring(name.lastIndexOf('_') + 1)
            let pos = e[x].x
            //console.log(name, pos)
            let list1 = store.getState().data.list1//从redux提取
            if (pos === 1) {
                //去到了右边，且list1中没有该元素，增加到list1
                if (list1.indexOf(name) === -1) {
                    list1.push(name)
                    console.log("list1 新增了"+name)
                    console.log(list1)
                }
            } else {
                //去左边，且list1中有此元素，删除此元素
                var index = list1.indexOf(name)
                if (index !== -1) {
                    list1.splice(index, 1)
                    console.log("list1 删除了"+name)
                }
            }
            this.setState({ list1: list1 })
            store.dispatch(saveList1Action(list1))
        }
        //console.log(this.state.list1)
    }
    render() {
        const { cookies } = this.props;
        return (
            <div style={
                this.state.name === cookies.get('name')
                ?{ display: "inline-block", marginLeft: "15px"  }
                :{display: "none" }}>
                <Button type="primary" onClick={this.showDrawer}>
                    Step2：选择日计划
                </Button>
                <Drawer
                    title={<> <Button
                        type="primary"
                        style={{ float: "left", marginLeft: "10px" }}
                        onClick={this.onClose}
                    ><Icon type="left" />保存</Button>拖拽任务便条到日计划（请横屏） 💖</>}
                    placement="top"
                    height="100%"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <div id="main">
                        <Collapse >
                            <GridLayout
                                className="layout"
                                isResizable={false}
                                cols={2}
                                margin={[100, 10]}
                                rowHeight={30}
                                width={700}>
                                <div key='a1' data-grid={{ i: 'a1', x: 0, y: 0, w: 1, h: 1, static: true, }} className="banner" >
                                    <p>周任务表</p>
                                </div>
                                <div key="a2" data-grid={{ i: 'a2', x: 1, y: 0, w: 1, h: 1, static: true, }} className="banner" >
                                    <p>日任务表</p>
                                </div>
                            </GridLayout>
                            {this.state.layout.map((item, index) => {
                                return (
                                    <Panel key={item.name + index} header={item.name} >
                                        <GridLayout
                                            className="layout"
                                            isResizable={false}
                                            cols={2}
                                            layout={item.detail}
                                            onLayoutChange={this.onLayoutChange}
                                            margin={[100, 10]}
                                            rowHeight={30}
                                            width={700}>
                                            {item.detail.map((it, ind) => {
                                                //console.log(this.state)
                                                return (
                                                    <div
                                                        key={it.i}
                                                    >{it.name}
                                                    </div>)
                                            }
                                            )}
                                        </GridLayout>
                                    </Panel>
                                )
                            })}
                        </Collapse>
                    </div>
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '100px'
                        }}
                    >
                    </div>
                </Drawer>
            </div>
        );
    }
}
export default withCookies(Dw1)