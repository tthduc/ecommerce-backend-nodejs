'use strict';

// Wrap async route handlers
/**
 * Đây là một higher-order function (hàm bọc).
 * Nó nhận vào một hàm fn (thường là middleware hoặc controller có async).
 * Khi gọi fn(req, res, next), nếu trong fn có lỗi (throw error hoặc reject Promise), thì .catch(next) sẽ tự động chuyển lỗi về middleware xử lý lỗi chung của Express.
 * Mục đích: Giúp tránh phải viết try...catch lặp đi lặp lại trong tất cả các middleware hoặc route handler.
 */
const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = asyncHandler