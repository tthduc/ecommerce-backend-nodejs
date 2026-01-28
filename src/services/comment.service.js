'user strict';

const CommentModel = require('../models/comment.model');

class CommentService {
    async createComment({
        productId, userId, content, parentId = null
    }) {
        try {
            const comment = new CommentModel({
                comment_productId: productId,
                comment_userId: userId,
                comment_content: content,
                comment_parentId: parentId
            });

            let rightValue;
            if (parentId) {
                const parentComment = await CommentModel.findById(parentId);
                rightValue = parentComment.comment_right;

                await CommentModel.updateMany(
                    { comment_productId: productId, comment_right: { $gte: rightValue } },
                    { $inc: { comment_right: 2 } }
                );

                await CommentModel.updateMany(
                    { comment_productId: productId, comment_left: { $gt: rightValue } },
                    { $inc: { comment_left: 2 } }
                );

                await CommentModel.findByIdAndUpdate(parentId, { $inc: { comment_right: 2 } });
            } else {
                const maxRightComment = await CommentModel.findOne({ comment_productId: productId })
                    .sort('-comment_right')
                    .exec();
                rightValue = maxRightComment ? maxRightComment.comment_right + 1 : 1;
            }

            // insert the new comment
            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;

            await comment.save();

            return comment;
        } catch (error) {
            throw new Error('Error creating comment: ' + error.message);
        }
    }

    async getCommentsByProductId(productId) {
        try {
            const comments = await CommentModel.find({ comment_productId: productId, isDeleted: false });
            return comments;
        } catch (error) {
            throw new Error('Error fetching comments: ' + error.message);
        }
    }

    async getCommentByParentId(parentId) {
        try {
            const comments = await CommentModel.find({ 
                comment_parentId: parentId, 
                comment_left: { $gt: parentId.comment_left },
                comment_right: { $lt: parentId.comment_right },
                isDeleted: false });
            return comments;
        } catch (error) {
            throw new Error('Error fetching comments by parent ID: ' + error.message);
        }
    }

    async deleteComment({ commentId, productId }) {
        try {
            const foundProduct = await ProductModel.findById(productId);
            if (!foundProduct) {
                throw new Error('Product not found');
            }

            const comment = await CommentModel.findById(commentId);
            if (!comment) {
                throw new Error('Comment not found');
            }

            const leftValue = comment.comment_left;
            const rightValue = comment.comment_right;
            const width = rightValue - leftValue + 1;

            // delete parent comment and children comments
            // Mark the comment and its descendants as deleted
            await CommentModel.updateMany(
                { comment_left: { $gte: leftValue, $lte: rightValue } },
                { isDeleted: true }
            );

            // Update the left and right values of remaining comments
            await CommentModel.updateMany(
                { comment_productId: productId, comment_left: { $gt: rightValue } },
                { $inc: { comment_left: -width } }
            );

            await CommentModel.updateMany(
                { comment_productId: productId, comment_right: { $gt: rightValue } },
                { $inc: { comment_right: -width } }
            );

            return true;
        } catch (error) {
            throw new Error('Error deleting comment: ' + error.message);
        }
    }
}

module.exports = new CommentService();