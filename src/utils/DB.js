import Realm from 'realm';
// DB schema
export const TrackSchema = {
  name: 'Track',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', indexed: true },
    title: 'string',
    artists: 'string',
    header_image_url: 'string',
    uri: 'string',
    release_date: 'string?',
    pathToFile: 'string?',
  },
};

// DB configuration
const databaseOptions = {
  path: 'midoone.realm',
  schema: [TrackSchema],
};

// add new track
export const insertNewTrack = newTrack => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then((realm) => {
    realm.write(() => {
      realm.create('Track', newTrack);
      resolve(newTrack);
    });
  }).catch(error => reject(error));
});

// update track (path to file)
export const updateTrack = (trackId, pathToFile) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then((realm) => {
    realm.write(() => {
      const updatingTrack = realm.objectForPrimaryKey('Track', trackId);
      updatingTrack.pathToFile = pathToFile; // only pathToFile is updatable
      resolve();
    });
  }).catch(error => reject(error));
});

// delete track
export const deleteTrack = trackId => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then((realm) => {
    realm.write(() => {
      const deletingTrack = realm.objectForPrimaryKey('Track', trackId);
      realm.delete(deletingTrack);
      resolve();
    });
  }).catch(error => reject(error));
});

// get all tracks
export const queryAllTracks = query => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then((realm) => {
    const tracks = (query === undefined)
      ? realm.objects('Track').sorted('title')
      : realm.objects('Track').filtered('title CONTAINS[c] $0', query).sorted('title');
    // map each realm object to regular object
    resolve(tracks.map(x => Object.assign({}, x)));
  }).catch((error) => {
    reject(error);
  });
});

// DB itself
export default new Realm(databaseOptions);
