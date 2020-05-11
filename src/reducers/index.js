import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {
  SET_CONNECTION_STATUS,
  SET_LOADING_STATUS,
  SET_BUFFERING_STATUS,
  UPDATE_PLAYLIST,
  SET_CURRENTLY_PLAYING_TRACK,
  PLAY,
  PAUSE,
  SHOW_PLAYER,
  HIDE_PLAYER,
  UPDATE_HISTORY,
  CLEAR_HISTORY,
} from '../constants/ActionTypes';

const initialState = {
  isConnected: false,
  isLoading: false,
  isBuffering: false,
  isPlaying: false,
  currentlyPlaying: null,
  playerVisible: false,
  playlist: [],
  historyList: [],
};

function RootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONNECTION_STATUS:
      return { ...state, isConnected: action.isConnected };

    case SET_LOADING_STATUS:
      return { ...state, isLoading: action.isLoading };

    case SET_BUFFERING_STATUS:
      return { ...state, isBuffering: action.isBuffering };

    case UPDATE_PLAYLIST:
      return { ...state, playlist: action.tracks };

    case SET_CURRENTLY_PLAYING_TRACK:
      return { ...state, currentlyPlaying: action.track };

    case PLAY:
      return { ...state, isPlaying: true };

    case PAUSE:
      return { ...state, isPlaying: false };

    case SHOW_PLAYER:
      return { ...state, playerVisible: true };

    case HIDE_PLAYER:
      return { ...state, playerVisible: false };

    case UPDATE_HISTORY:
      return { ...state, historyList: [action.data, ...state.historyList] };

    case CLEAR_HISTORY:
      return { ...state, historyList: [] };

    default:
      return state;
  }
}

// what to persist
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['currentlyPlaying', 'historyList'],
};

export default persistReducer(persistConfig, RootReducer);
