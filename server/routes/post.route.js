const express = require("express");
const Router = express.Router;

const permission = require("../services/permission.service")
  .permissionDispatcher;
const postService = require("../services/post.service");
const socketService = require("../services/socket/socket.service");
const router = new Router();

const send = (req, res) => {
  postService
    .save(req.body, req.__user)
    .then(() => {
      res.status(200).json({ post: "Votre post a été créé avec succès." });
    })
    .catch(error => {
      console.error("ERROR => POST SERVICES save ", error);
      res.status(error.status).json(error.response);
    });
};

const countAll = (req, res) => {
  postService
    .countPosts()
    .then(posts => {
      const nbUsers = socketService.nbConnectedUsers();

      res
        .status(posts.status)
        .json({ nbConnectedUsers: nbUsers, nbPosts: posts.response });
    })

    .catch(error => console.log("countAll postRoute", error));
};

const suppressOne = (req, res) => {
  postService.suppress(req.postId);
};

const suppressAll = (req, res) => {
  postService.suppressAll(req.postId);
};

const find = (req, res) => {
  postService
    .find(req.params.id, req.params.page, req.params.pseudo)
    .then(result => {
      res.status(200).json({ posts: result.posts, nbPosts: result.count });
    })
    .catch(error => {
      res
        .status(error.status || 500)
        .json(error.response || "Error while getting posts");
    });
};

const createComment = (req, res) => {
  postService
    .addComment(req.params.id, req.body.text, req.__user)
    .then(post => {
      console.log(post);
      res.status(200).send(post);
    })
    .catch(error => {
      console.error(error);
      res.status(502).send(`Error while commenting post ${req.params.id}`);
    });
};

const deleteComment = (req, res) => {};

const getComments = (req, res) => {};
// TODO => manque des permissions
router.route("/newPost").post(permission("canSendPost"), send);
router.route("/deletePost").delete(suppressOne);
router.route("/deleteAllPosts").delete(suppressAll);
router
  .route("/:id/comment")
  .post(permission("canSeePost"), createComment)
  .delete(permission("canEditComment"), deleteComment)
  .get(permission("canSeePost"), getComments);
router.route("/:id/:page").get(find);
router.route("/").get(countAll);

module.exports = router;
