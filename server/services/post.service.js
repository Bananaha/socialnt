"use strict";

const moment = require("moment");
const async = require("async");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");
const dbService = require("./db.service");
const socketService = require("./socket/socket.service");
const userService = require("./user.service");

const ObjectId = require("mongodb").ObjectID;

moment.locale("fr");

const POSTS_COUNT_PER_PAGE = 10;

const save = (body, currentUser) => {
  const postBody = {
    date: new Date(),
    content: body.post,
    author: currentUser,
    comments: []
  };
  if (body.targetUser !== currentUser) {
    postBody.dest = ObjectId(body.targetUser);
  }
  return dbService.create("posts", postBody).then(result => {
    countPosts()
      .then(postsCounts => {
        socketService.emit("ON_POST_PUBLISH", { postsCounts });
      })
      .catch(error => {
        return {
          status: 502,
          response: "Le post n'a pas pu être enregistré."
        };
      });
  });
};

const USER_KEYS = ["author", "dest"];

const extractUsersFromPosts = posts => {
  return posts
    .reduce((users, post) => {
      USER_KEYS.forEach(key => {
        if (!post[key]) return;

        const id = post[key].toString();
        if (users.indexOf(id) === -1) {
          users.push(id);
        }
      });
      return users;
    }, [])
    .map(id => ObjectId(id));
};

const populatePostsWithUsers = (posts, users) => {
  const usersDictionnary = users.reduce((acc, user) => {
    acc[user._id] = {
      _id: user._id,
      pseudo: user.pseudo
    };
    return acc;
  }, {});
  posts.forEach(post => {
    USER_KEYS.forEach(key => {
      if (post[key] && usersDictionnary[post[key]]) {
        post[key] = usersDictionnary[post[key]];
      }
    });
  });
  return posts;
};

const find = (userId, page, pseudo) => {
  return dbService
    .findAndCount(
      "posts",
      {
        $or: [{ author: ObjectId(userId) }, { dest: ObjectId(userId) }]
      },
      { date: -1 },
      POSTS_COUNT_PER_PAGE * page - POSTS_COUNT_PER_PAGE,
      POSTS_COUNT_PER_PAGE
    )
    .then(results => {
      const posts = results[0];
      const count = results[1];
      const extractedUsers = extractUsersFromPosts(posts);

      return userService
        .find({
          _id: { $in: extractedUsers }
        })
        .then(users => ({
          posts: populatePostsWithUsers(posts, users),
          count
        }));
    });
};

const suppressOne = postId => dbService.deleteOne("posts", postId);

const suppressAll = () => dbService.deleteMany("posts");

const countPosts = () => {
  console.log("countPosts");
  return dbService
    .count("posts", {}, 0)
    .then(nbPosts => {
      console.log("COUNTPOST OK", nbPosts);
      return { status: 200, response: nbPosts };
    })
    .catch(error => {
      console.log("COUNTPOST CATCH", error);
    });
};

const getUsersFromPost = postId =>
  dbService.getOne("posts", { _id: ObjectId(postId) }).then(post => {
    const users = [ObjectId(post.author)];
    if (post.dest) users.push(ObjectId(post.dest));
    return dbService.getAll("users", { _id: { $in: users } });
  });

const addComment = (postId, text, user) =>
  dbService.updateAndReturn(
    "posts",
    { _id: ObjectId(postId) },
    {
      $push: {
        comments: {
          id: uuidv4(),
          date: new Date(),
          text,
          user
        }
      }
    }
  );

module.exports = {
  getUsersFromPost,
  save,
  find,
  suppressOne,
  suppressAll,
  countPosts,
  addComment
};
