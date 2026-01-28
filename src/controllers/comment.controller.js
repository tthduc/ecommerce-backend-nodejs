'use strict';

const { createComment, getCommentsByProductId } = require('../services/comment.service');

class CommentController {
    async createComment(req, res) {
        try {
            const { productId, userId, content, parentId } = req.body;
            const comment = await createComment({ productId, userId, content, parentId });
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCommentsByProductId(req, res) {
        try {
            const { productId } = req.params;
            const comments = await getCommentsByProductId(productId);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CommentController();