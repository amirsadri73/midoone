import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Persistor, Store } from './src/utils/Store';
import LoadingView from './src/components/LoadingView';
import Entry from './src/Entry';

const App = () => (
  <Provider store={Store}>
    <PersistGate loading={<LoadingView />} persistor={Persistor}>
      <Entry />
    </PersistGate>
  </Provider>
);

export default App;
