//把changeaction方法写在一个文件里面
export const saveStep2Action = (value) => ({
    type: 'SAVESTEP2',
    value
})
export const saveStep1Action = (value) => ({
    type: 'SAVESTEP1',
    value
})
export const saveList1Action = (value) => ({
    type: 'SAVELIST1',
    value
})
export const changeInputAction = (value) => ({
    type: 'CHANGE_INPUT',
    value
})
export const deleteItemAction = (index) => ({
    type: 'DELETE_ITEM',
    index
})
export const undoItemAction = (index) => ({
    type: 'UNDO_ITEM',
    index
})
export const changeEmojiAction1 = (value) => ({
    type: 'CHANGE_EMOJI1',
    value
})
export const changeEmojiAction2 = (value) => ({
    type: 'CHANGE_EMOJI2',
    value
})
export const addItemAction = () => ({
    type: 'ADD_ITEM',
})
export const cutItemAction1 = (index) => ({
    type: 'CUT_ITEM1',
    index
})
export const cutItemAction2 = (index) => ({
    type: 'CUT_ITEM2',
    index
})

export const showDrawerAction = () => ({
    type: 'SHOW_DRAWER',
})
export const closeDrawerAction = () => ({
    type: 'CLOSE_DRAWER',
})
export const submitCommentAction = (name, value) => ({
    type: 'SUBMIT_COMMENT',
    name,
    value
})
export const submitSonCommentAction = (value, name, index) => ({
    type: 'SUBMIT_SON_COMMENT',
    value,
    name,
    index
})
export const rpyShowAction = (value) => ({
    type: 'SHOW_REPLY',
    value
})
export const changeSonInputAction = (value, index) => ({
    type: 'CHANGE_SON_INPUT',
    value,
    index
})

export const changeSonSubmittingTAction = (index) => ({
    type: 'CHANGE_SON_T_SUBMITTING',
    index
})
export const changeSonSubmittingFAction = (index) => ({
    type: 'CHANGE_SON_F_SUBMITTING',
    index
})
export const rpyHideAction = (index) => ({
    type: 'REPLY_HIDE',
    index
})
export const getNameFromCookieAction = (value) => ({
    type: 'GET_NAME_COOKIE',
    value
})


export const initListAction = (data) => ({
    type: 'INIT_LIST',
    data
});

// export const setListAction = (data) => ({
//     type: SET_LIST,
//     data
// })

// export const getToDoList = () => {
//     return (dispatch) => {
//         axios
//             .post('http://localhost:8001/new')
//             .then((res) => {
//                 const data = res.data
//                 const action = setListAction(data)
//                 dispatch(action)
//             })
//     }
// }