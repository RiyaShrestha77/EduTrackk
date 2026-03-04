const Notification = require("../models/notificationModel");

const getUserId = (user) => user?.user_id || user?.id || null;

const getMyNotifications = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [updatedCount] = await Notification.update(
      { is_read: true },
      {
        where: {
          notification_id: req.params.id,
          user_id: userId,
        },
      }
    );

    if (!updatedCount) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.json({ success: true });
  } catch (_error) {
    return res.status(500).json({ success: false });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await Notification.update(
      { is_read: true },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );

    return res.json({ success: true });
  } catch (_error) {
    return res.status(500).json({ success: false });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
