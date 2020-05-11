import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
// import reducer
import RootReducer from '../reducers';
// logger middleware (for DEV mode)
const loggerMiddleware = createLogger();
// store
const Store = createStore(RootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
// persistor
const Persistor = persistStore(Store);

export { Store, Persistor };
