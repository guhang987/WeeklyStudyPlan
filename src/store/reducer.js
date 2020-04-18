import moment from 'moment';
import axios from 'axios';
import serverUrl from '../config'
import qs from 'qs'
const defaultState = {
    visible: false,
    is_login_page: 1,
    name: "NULL",
    id: 1,
    data: {
        inputValue: '',
        list0: [],
        list1: [
        ],
        list2: [
        ],
        total_tasks: 0,
        todo_tasks: 0,
        percent: 0,
    },
    submitting: false,
    submitValue: '',
    commentData: [
        {
            author: '蒙奇·D·路飞',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: "今日事，今日毕。",
            reply: [
                {
                    author: '特拉法加尔·劳',
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content: "一起加油，奥里给!",
                }
            ],
            replyVisible: 'none',
            submitting: false,
            submitValue: '',
        },
    ]
}
function saveData(id, list1, list2, percent) {
    //https://blog.csdn.net/wangshang1320/article/details/88716464
    //就是axios发起post请求得时候发送过去的数据成了键，而值是空
    axios.post(serverUrl + '/saveData', qs.stringify({ id: id, list1: list1, list2: list2, percent: percent }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        }
    })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
function saveCommentData(id, data) {
    //https://blog.csdn.net/wangshang1320/article/details/88716464
    //就是axios发起post请求得时候发送过去的数据成了键，而值是空
    axios.post(serverUrl + '/saveCommentData', qs.stringify({ id: id, data: data }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        }
    })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
function saveSonCommentData(id, index, data) {
    axios.post(serverUrl + '/saveSonCommentData', qs.stringify({ id: id, index: index, data: data }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        }
    })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
function saveList(id, list, num) {
    //直接保存list试试 可以
    //num表示要存到 哪个list
    //console.log("在数据库保存list" + num)
    axios.post(serverUrl + '/saveList', qs.stringify({ id: id, data: list, num: num }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        }
    })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
//reducer必须是纯函数
export default function reducer(state = defaultState, action) {
    let newState = JSON.parse(JSON.stringify(state))
    //reducer里只能接收state不能改变state
    switch (action.type) {
        case 'SAVELIST1':
            newState.list1=action.value
            break
        case 'SAVESTEP1':
            //console.log(action.value)
            newState.data.list0 = action.value
            saveList(newState.id, action.value, 0)
            break
        case 'SAVESTEP2':
            console.log(action.value)
            newState.data.list1 = action.value
            newState.data.todo_tasks = action.value.length
            newState.data.total_tasks = action.value.length
            saveList(newState.id, action.value, 1)
            break
        case 'DELETE_ITEM':
            //完成一项list1中的任务，进入到list2中
            let task = newState.data.list1[action.index]
            //必定能在list0中找到task i1为list0中该项目序号,i2为具体序号
             
            for(let item of newState.data.list0){
                var i2=0;
                var finded=0
                for(let it of item.detail){
                    if(it.name===task){
                        //console.log(item.detail)
                        item.detail.splice(i2,1)
                        //console.log(item.detail)
                        finded=1
                        break
                    }
                    i2++
                }
                if(finded===1) break
            }
            //还要删除list1中的该项目
            console.log(action.index,action.value)
            newState.data.list1.splice(action.index, 1)
            newState.data.list2.push(task)
            newState.data.todo_tasks--
            newState.data.percent = ((1 - newState.data.todo_tasks / newState.data.total_tasks) * 100).toFixed(2)
            saveData(newState.id, newState.data.list1, newState.data.list2, newState.data.percent)
            break
        case 'UNDO_ITEM':
            //此功能停用，因为不建议撤销完成某任务了
            //撤销完成一项list2中的任务，进入到list1中
            let task_ = newState.data.list2[action.index]
            //To do 新增list0中该条目，且位置为？？
            newState.data.list2.splice(action.index, 1)
            newState.data.list1.push(task_)
            newState.data.todo_tasks++
            newState.data.percent = ((1 - newState.data.todo_tasks / newState.data.total_tasks) * 100).toFixed(0)
            saveData(newState.id, newState.data.list1, newState.data.list2, newState.data.percent)
            break
        case 'CHANGE_INPUT':
            newState.data.inputValue = action.value
            break
        case 'CUT_ITEM1':
            newState.data.list1.splice(action.index, 1)
            newState.data.total_tasks--;
            newState.data.todo_tasks--;
            newState.data.percent = ((1 - newState.data.todo_tasks / newState.data.total_tasks) * 100).toFixed(0)
            saveData(newState.id, newState.data.list1, newState.data.list2, newState.data.percent)
            break;
        case 'CUT_ITEM2':
            newState.data.list2.splice(action.index, 1)
            newState.data.total_tasks--;
            newState.data.percent = ((1 - newState.data.todo_tasks / newState.data.total_tasks) * 100).toFixed(0)
            saveData(newState.id, newState.data.list1, newState.data.list2, newState.data.percent)
            break;
        case 'SHOW_DRAWER':
            newState.visible = true
            break
        case 'CLOSE_DRAWER':
            newState.visible = false
            break
        case 'SUBMIT_COMMENT':
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
            newState.submitting = false
            newState.submitValue = ""
            let len = newState.commentData.length
            newState.commentData = [
                ...newState.commentData,
                {
                    id: len,
                    author: action.name,
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content: action.value,
                    datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    reply: [],
                    replyVisible: 'none',
                    submitting: false,
                    submitValue: '',
                },
            ]
            saveCommentData(newState.id, newState.commentData)
            break
        case 'SHOW_REPLY':
            newState.commentData[action.value].replyVisible = 'block'
            break
        case 'CHANGE_SON_INPUT':
            newState.commentData[action.index].submitValue = action.value
            break
        case 'SUBMIT_SON_COMMENT':
            newState.commentData[action.index].submitting = false
            newState.commentData[action.index].submitValue = ""
            newState.commentData[action.index].reply = [
                {
                    author: action.name,
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content: action.value,
                    datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                },
                ...newState.commentData[action.index].reply,
            ]
            //console.log(newState.id,action.index,newState.commentData[action.index].reply)
            saveSonCommentData(newState.id, action.index, newState.commentData[action.index].reply)
            break
        case 'CHANGE_SON_T_SUBMITTING':
            newState.commentData[action.index].submitting = true
            break
        case 'CHANGE_SON_F_SUBMITTING':
            newState.commentData[action.index].submitting = false
            break
        case 'REPLY_HIDE':
            newState.commentData[action.index].replyVisible = 'none'
            break
        case 'GET_NAME_COOKIE':
            newState.name = action.value
            break
        case 'INIT_LIST':
            let list0 = action.data.taskData.list0
            //console.log(list0)//得把list0里面的字符串转为数字，例如y:"1"转为y:1
            list0.map((item) => {
                item.detail.map((it)=>{
                    it.x=parseInt(it.x)
                    it.y=parseInt(it.y)
                    it.w=1
                    it.h=1
                    return null
                })
                return null
            })
            // for (let x in list0) {
            //     list0[x].detail[0].x = parseInt(list0[x].detail[0].x)
            //     list0[x].detail[0].y = parseInt(list0[x].detail[0].y)
            //     list0[x].detail[0].w = 1
            //     list0[x].detail[0].h = 1
            // }
            newState.data.list0 = list0
            newState.data.list1 = action.data.taskData.list1
            newState.data.list2 = action.data.taskData.list2
            newState.data.todo_tasks = action.data.taskData.list1.length
            newState.data.total_tasks = action.data.taskData.list1.length + action.data.taskData.list2.length
            newState.data.percent = ((1 - newState.data.todo_tasks / newState.data.total_tasks) * 100).toFixed(0)
            newState.commentData = action.data.commentData
            newState.name = action.data.name
            newState.id = action.data.id
            //console.log(newState)
            break;
        default:
            break;
    }
    return newState
}
