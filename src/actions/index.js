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
import { queryAllTracks, insertNewTrack, deleteTrack, updateTrack } from '../utils/DB';

// store
export function setConnectionStatus(connectionStatus) {
  return {
    type: SET_CONNECTION_STATUS,
    isConnected: connectionStatus,
  };
}

// store
export function setLoadingStatus(loadingStatus) {
  return {
    type: SET_LOADING_STATUS,
    isLoading: loadingStatus,
  };
}

// store
export function setBufferingStatus(bufferingStatus) {
  return {
    type: SET_BUFFERING_STATUS,
    isBuffering: bufferingStatus,
  };
}

// store
export function updatePlaylist(tracks) {
  return {
    type: UPDATE_PLAYLIST,
    tracks,
  };
}

// store
export function setCurrentlyPlayingTrack(track) {
  return {
    type: SET_CURRENTLY_PLAYING_TRACK,
    track,
  };
}

// store
export function play() {
  return {
    type: PLAY,
  };
}

// store
export function pause() {
  return {
    type: PAUSE,
  };
}

// store
export function showPlayer() {
  return {
    type: SHOW_PLAYER,
  };
}

// store
export function hidePlayer() {
  return {
    type: HIDE_PLAYER,
  };
}

// store
export function updateHistory(data) {
  return {
    type: UPDATE_HISTORY,
    data,
  };
}

// store
export function clearHistory() {
  return {
    type: CLEAR_HISTORY,
  };
}

// DB
export function getAllTracks(query) {
  return (dispatch) => {
    // db action
    queryAllTracks(query).then((tracks) => {
      // store action
      dispatch(updatePlaylist(tracks));
      // set loading to false
      setTimeout(() => { dispatch(setLoadingStatus(false)); }, 300);
    }).catch((error) => {
      console.log(error);
    });
  };
}

// DB
export function addToPlaylist(newTrack) {
  return () => {
    insertNewTrack(newTrack).then((addedTrack) => {
      console.log('new track:');
      console.log(addedTrack);
    }).catch((error) => {
      console.log(error);
    });
  };
}

// DB
export function removeFromPlaylist(trackId) {
  return () => {
    deleteTrack(trackId).then(() => {
      console.log('removed');
    }).catch((error) => {
      console.log(error);
    });
  };
}

// DB
export function updateDownloadedTrack(trackId, pathToFile) {
  return () => {
    updateTrack(trackId, pathToFile).then(() => {
      console.log('updated');
    }).catch((error) => {
      console.log(error);
    });
  };
}
