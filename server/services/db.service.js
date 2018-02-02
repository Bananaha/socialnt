const mongo = require("mongodb").MongoClient;

const state = {
  db: null
};

const connect = (url, done) => {
  if (state.db) {
    return done();
  }

  mongo.connect(url, (error, db) => {
    if (error) {
      return done(error);
    }
    state.db = db;
    done();
  });
};

// CREATE ONE DOCUMENT FROM DB
// @params collectionName 'string' 'name of db collection'
// @params props 'object {key: value}'
// @return document
const create = (collectionName, props) => {
  return new Promise((resolve, reject) => {
    state.db.collection(collectionName).insertOne(props, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

// FIND ONE DOCUMENT FROM DB
// @params collectionName 'string' 'name of db collection'
// @params filters 'object {key: value}'
// @return document
const getOne = (collectionName, filters) => {
  return new Promise((resolve, reject) => {
    state.db.collection(collectionName).findOne(filters, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

// UPDATE ONE DOCUMENT FROM DB
// @params collectionName 'string' 'name of db collection'
// @params query
// @params update
const update = (collectionName, filters, doc) => {
  return new Promise((resolve, reject) => {
    state.db
      .collection(collectionName)
      .updateOne(filters, doc, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
  });
};

// getAll documents from a collection
// @params 'string' collectionName
// @params 'object' filter
// @params 'number' limit
// @params 'object' sort
// @return 'array'

const getAll = (collectionName, filter, limit) => {
  if (!limit) {
    limit = 0;
  }
  return new Promise((resolve, reject) => {
    state.db
      .collection(collectionName)
      .find(filter)
      .limit(limit)
      .toArray((error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
  });
};

const findAndCount = (collectionName, filter, sort, skip, limit) => {
  return new Promise((resolve, reject) => {
    state.db
      .collection(collectionName)
      .find(filter)
      .count((err, count) => {
        if (err) {
          return reject(error);
        }
        state.db
          .collection(collectionName)
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .toArray((error, result) => {
            if (error) {
              return reject(error);
            }
            return resolve([result, count]);
          });
      });
  });
};

const aggregate = (
  mainCollection,
  mainCollectionKey,
  secondCollection,
  secondCollectionKey,
  secondCollectionNameOutput
) => {
  return new Promise((resolve, reject) => {
    state.db
      .collection(mainCollection)
      .aggregate([
        {
          $lookup: {
            from: secondCollection,
            localField: mainCollectionKey,
            foreignField: secondCollectionKey,
            as: secondCollectionNameOutput
          }
        }
      ])
      .toArray((error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
  });
};

const close = done => {
  if (state.db) {
    state.db.close((error, result) => {
      state.db = null;
      state.mode = null;

      if (error) {
        done(error);
      }
    });
  }
};

module.exports = {
  close,
  connect,
  create,
  getAll,
  findAndCount,
  getOne,
  update,
  aggregate,
  state
};
