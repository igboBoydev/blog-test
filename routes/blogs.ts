export {};
const express = require("express");
require("../config/passport");
const util = require("../utils/packages");
const router = express.Router();
const { personalSignature } = require("../middlewares/personalSignature");
const passport = require("passport");
const jwtMiddleWare = passport.authenticate("jwt", { session: false });
require("dotenv").config();

const blogs = require("../controllers/Blogs");

router.post(
  "/create-blog-post",
  [jwtMiddleWare, personalSignature],
  blogs.postBlog
);

router.get("/all-blogs", [personalSignature], blogs.allBlogPosts);

router.get("/post-by-id", [personalSignature], blogs.getPostByUuid);

router.get("/blogs-by-keyword", [personalSignature], blogs.searchPostByKeyword);

router.put(
  "/update-blog",
  [jwtMiddleWare, personalSignature],
  blogs.updatePost
);

router.delete(
  "/delete-blog",
  [jwtMiddleWare, personalSignature],
  blogs.deletePost
);

module.exports = router;
