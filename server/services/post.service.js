"use strict";

const moment = require("moment");
const async = require("async");
const _ = require("lodash");

const dbService = require("./db.service");
const socketService = require("./socket/socket.service");

const ObjectId = require("mongodb").ObjectID;

moment.locale("fr");

const save = (body, currentUser) => {
  const postBody = {
    date: new Date(),
    content: body.post,
    author: currentUser
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

const find = (targetUser, targetPage, pseudo) => {
  return new Promise((resolve, reject) => {
    const PER_PAGE = 10;
    let page;
    if (targetPage === "undefined") {
      page = 1;
    } else {
      page = targetPage;
    }

    return dbService
      .getOne("users", { _id: ObjectId(targetUser) })
      .then(user => {
        if (!user) {
          reject({ status: 504, response: "utilisateur introuvable" });
          return;
        }

        return dbService
          .findAndCount(
            "posts",
            {
              $or: [{ author: user._id }, { dest: user._id }]
            },
            { date: -1 },
            PER_PAGE * page - PER_PAGE,
            PER_PAGE
          )
          .then(results => {
            const posts = results[0];
            const nbPosts = results[1];

            const targetUserId = user._id.toString();

            async.map(
              posts,
              (post, postcb) => {
                if (targetUserId === post.author.toString()) {
                  post.author = user.pseudo;
                } else {
                  dbService
                    .getOne("users", { _id: ObjectId(post.author.toString()) })
                    .then(author => {
                      if (!author) {
                        post.author = "membre cumulus";
                      } else {
                        post.author = result.pseudo;
                      }
                    })
                    .catch(error => {
                      postcb(error, null);
                    });
                }
                if (post.dest) {
                  console.log("-------post.dest----------");
                  console.log(post.dest);
                  if (targetUserId === post.dest) {
                    console.log("-------targetUserId === post.dest----------");
                    console.log(post.dest);
                    post.dest = user.pseudo;
                    console.log("-------dest pseudo----------");
                    console.log(post.dest);
                  } else {
                    dbService
                      .getOne("users", { _id: ObjectId(post.dest.toString()) })
                      .then(dest => {
                        console.log("-------dest from db----------");
                        console.log(dest);
                        if (!dest) {
                          post.dest = "membre cumulus";
                        } else {
                          console.log("-------dest exit----------");
                          console.log(dest.pseudo);
                          post.dest = dest.pseudo;
                          console.log("-------dest pseudo----------");
                          console.log(post.dest);
                        }
                        console.log(post);
                      })
                      .catch(error => {
                        postcb(error, null);
                      });
                  }
                }
                postcb(null, post);
              },
              (error, results) => {
                console.log(error, results);
                if (error) {
                  reject({ status: 500, response: error });
                } else {
                  console.log("roro");
                }
              }
            );
            console.log("posts ===========");
            console.log(posts);
            const sortedPosts = _.orderBy(posts, ["date"], ["desc"]);
            resolve({
              status: 200,
              response: { posts: sortedPosts, nbPosts: nbPosts }
            });
          })
          .catch(error => {
            console.log("post not found", error);
            reject({ status: 500, response: "aucun post trouvé" });
          });
      })
      .catch(error => {
        console.log("USER NOT FOUND", error);
        reject({ status: 500, response: "no user" });
      });
  });
};

const suppressOne = postId => {
  console.log(req);
};
const suppressAll = postId => {
  console.log(req);
};

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

module.exports = {
  save,
  find,
  suppressOne,
  suppressAll,
  countPosts
};
