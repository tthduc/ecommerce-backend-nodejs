'use strict';

const NotificationModel = require('../models/notification.model');

const pushNotiToSystem = async ({
    notification_type,
    notification_senderId,
    notification_receiverId,
    notification_content,
    notification_options = {}
}) => {
    try {
        let notificationContent
        if (notification_type === 'ORDER-001') {
            notificationContent = `Your order has been placed successfully. ${notification_content}`;
        } else if (notification_type === 'ORDER-002') {
            notificationContent = `Your order placement failed. ${notification_content}`;
        } else if (notification_type === 'SHOP-001') {
            notificationContent = `A new product is available from a shop you follow. ${notification_content}`;
        } else {
            notificationContent = notification_content;
        }

        const newNotification = await NotificationModel.create({
            notification_type,
            notification_senderId,
            notification_receiverId,
            notification_content: notificationContent,
            notification_options
        });

        return newNotification;
    } catch (error) {
        console.error('Error pushing notification to system:', error);
        throw error;
    }
};