const util = require("../utils/packages");
const db = require("../Database/postgres");
const { paginate } = require("paginate-info");
const { Op, QueryTypes } = require("sequelize");
import { Request, Response, NextFunction } from "express";

module.exports = {
  postBlog: async (
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const blogSchema = util.Joi.object()
      .keys({
        post: util.Joi.string().required(),
      })
      .unknown();

    const validate = blogSchema.validate(req.body);

    if (validate.error != null) {
      const errorMessage = validate.error.details
        .map((i: any) => i.message)
        .join(".");
      return res.status(400).json(util.helpers.sendError(errorMessage));
    }

    let user = await db.Users.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res
        .status(404)
        .send(util.helpers.sendError("User not logged in or does not exist"));
    }

    const { post } = req.body;

    await db.Blogs.create({
      user_id: user.id,
      uuid: util.uuid(),
      post: post,
      is_deleted: 0,
    });

    return res
      .status(200)
      .json(util.helpers.sendSuccess("Blogs created successfully"));
  },

  allBlogPosts: async (
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { pageNum } = req.query;

    if (!pageNum || isNaN(pageNum)) {
      return res
        .status(400)
        .json(util.helpers.sendError("Kindly add a valid page number"));
    }

    var currentPage = parseInt(pageNum) ? parseInt(pageNum) : 1;

    var page = currentPage - 1;
    var pageSize = 25;
    const offset = page * pageSize;
    const limit = pageSize;

    let allBlogs = await db.Blogs.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    var next_page = currentPage + 1;
    var prev_page = currentPage - 1;
    var nextP = `/api/v1/test/all-blogs?pageNum=` + next_page;
    var prevP = `/api/v1/test/all-blogs?pageNum=` + prev_page;

    const meta = paginate(currentPage, allBlogs.count, allBlogs.rows, pageSize);

    return res.status(200).json({
      status: "SUCCESS",
      data: allBlogs,
      per_page: pageSize,
      current_page: currentPage,
      last_page: meta.pageCount, //transactions.count,
      first_page_url: `/api/v1/test/all-blogs?pageNum=1`,
      last_page_url: `/api/v1/test/all-blogs?pageNum=` + meta.pageCount, //transactions.count,
      next_page_url: nextP,
      prev_page_url: prevP,
      path: `/api/v1/test/all-blogs?pageNum=`,
      from: 1,
      to: meta.pageCount, //transactions.count,
    });
  },

  getPostByUuid: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { uuid } = req.query;
    let blogs = await db.Blogs.findOne({ where: { uuid: uuid } });

    return res.status(200).json({ blogs });
  },

  searchPostByKeyword: async (
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { pageNum, word } = req.query;

    if (!pageNum || isNaN(pageNum)) {
      return res
        .status(400)
        .json(util.helpers.sendError("Kindly add a valid page number"));
    }

    var currentPage = parseInt(pageNum) ? parseInt(pageNum) : 1;

    var page = currentPage - 1;
    var pageSize = 25;
    const offset = page * pageSize;
    const limit = pageSize;

    let allBlogs = await db.Blogs.findAndCountAll({
      offset: offset,
      limit: limit,
      where: {
        post: {
          [Op.like]: `%${word}%`,
        },
      },
      order: [["id", "DESC"]],
    });

    var next_page = currentPage + 1;
    var prev_page = currentPage - 1;
    var nextP = `/api/v1/test/blogs-by-keyword?pageNum=` + next_page;
    var prevP = `/api/v1/test/blogs-by-keyword?pageNum=` + prev_page;

    const meta = paginate(currentPage, allBlogs.count, allBlogs.rows, pageSize);

    return res.status(200).json({
      status: "SUCCESS",
      data: allBlogs,
      per_page: pageSize,
      current_page: currentPage,
      last_page: meta.pageCount, //transactions.count,
      first_page_url: `/api/v1/test/blogs-by-keyword?pageNum=1`,
      last_page_url: `/api/v1/test/blogs-by-keyword?pageNum=` + meta.pageCount, //transactions.count,
      next_page_url: nextP,
      prev_page_url: prevP,
      path: `/api/v1/test/blogs-by-keyword?pageNum=`,
      from: 1,
      to: meta.pageCount, //transactions.count,
    });
  },

  updatePost: async (
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const blogUpdateSchema = util.Joi.object()
      .keys({
        post_id: util.Joi.string().required(),
        post: util.Joi.string().required(),
      })
      .unknown();

    const validate = blogUpdateSchema.validate(req.body);

    if (validate.error != null) {
      const errorMessage = validate.error.details
        .map((i: any) => i.message)
        .join(".");
      return res.status(400).json(util.helpers.sendError(errorMessage));
    }

    let user = await db.Users.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res
        .status(404)
        .send(util.helpers.sendError("User not logged in or does not exist"));
    }

    const { post, post_id } = req.body;

    let checker = await db.Blogs.findOne({ where: { uuid: post_id } });

    if (!checker) {
      return res
        .status(404)
        .send(util.helpers.sendError("blog post does not exist"));
    }

    if (parseInt(checker.user_id) !== parseInt(user.id)) {
      return res
        .status(404)
        .send(
          util.helpers.sendError(
            "You are not allowed to edit posts created by other users"
          )
        );
    }

    checker.post = post;
    await checker.save();

    return res
      .status(200)
      .json(util.helpers.sendSuccess("Blogs updated successfully"));
  },

  deletePost: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { uuid } = req.query;
    let blogs = await db.Blogs.findOne({ where: { uuid: uuid } });

    if (!blogs) {
      return res
        .status(404)
        .send(util.helpers.sendError("blog post does not exist"));
    }

    await blogs.destroy();

    return res
      .status(200)
      .json(util.helpers.sendSuccess("Blog post deleted successfully"));
  },
};
