import { createStore, applyMiddleware, compose } from 'redux'
 
import reducer from './reducer'
import thunk from 'redux-thunk'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

//自己做增强函数https://www.cnblogs.com/hejing-work/p/11772433.html
const store = createStore(reducer, enhancer)
export default store