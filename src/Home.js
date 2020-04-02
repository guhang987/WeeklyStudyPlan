import React, { Component } from 'react';
import { Progress, List,message } from 'antd';
import { Link } from 'react-router-dom'
import 'antd/dist/antd.css'
import serverUrl from './config'
import axios from 'axios'
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [
                {},
            ]
        }
    }
    componentDidMount() {
        axios
            .get(serverUrl+"/all")
            .then(res => {
                //console.log(res.data)
                // 改变state中的数据
                this.setState({
                    user:res.data
                })
            })
            .catch(function (thrown) {
                message.info('未能从服务器获取数据', 1);
                console.log(thrown)
            })
    }
    render() {
        return (
            <div style={{ marginLeft: "10%",marginTop:"15px"}}>
                <List
                    size="large"
                    grid={{
                        gutter: 16,
                        xs: 2,
                        sm: 3,
                        md: 3,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                    }}
                    dataSource={this.state.user}
                    renderItem={(item, index) => (
                        <List.Item >
                            <Link to={"detail"+item.id}>
                                <Progress
                                    type="circle"
                                    percent={Number(item.percent)}
                                    strokeColor={{
                                        '0%': '#108ee9',
                                        '100%': '#33FF00',
                                    }}
                                    strokeWidth={10}
                                />
                                <h3 style={{ marginLeft: "30px" }}>{item.name}</h3>
                            </Link>
                            <br />
                        </List.Item>  
                    )}>
                </List>
            </div>
        );
    }
}
export default HomePage;