import webpush from "web-push";
import User from "../../Model/User/userSchema.js";
 
// ── Configure VAPID once ───────────────────────────────────────────────────
webpush.setVapidDetails(
  "mailto:kundanpatil0111@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


 
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/push/subscribe
// Called from admin dashboard on first load — saves subscription to DB
// ─────────────────────────────────────────────────────────────────────────────
export const subscribePush = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
 
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid subscription object." });
    }
 
    await User.findByIdAndUpdate(req.userId, {
      pushSubscription: {
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth:   keys.auth,
        },
      },
    });
 
    res.status(200).json({ message: "Push subscription saved." });
  } catch (error) {
    console.error("subscribePush error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/push/unsubscribe
// Called when admin logs out — clears subscription from DB
// ─────────────────────────────────────────────────────────────────────────────
export const unsubscribePush = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      pushSubscription: {
        endpoint: null,
        keys: { p256dh: null, auth: null },
      },
    });
 
    res.status(200).json({ message: "Push subscription removed." });
  } catch (error) {
    console.error("unsubscribePush error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// Internal helper — used by other controllers (not a route)
// Sends push to all subscribed admins of a hostel
// ─────────────────────────────────────────────────────────────────────────────

export const notifyAdmins = async ({ hostelId, title, body }) => {
  try {
    console.log("notifyAdmins called");
    console.log({ hostelId, title, body });

    const admins = await User.find({
      role: "admin",
      "pushSubscription.endpoint": { $ne: null },
    });

    let filteredAdmins = admins.filter((admin) =>
  admin?.hostelId?.some((id) => id.toString() === hostelId.toString())
);

    console.log("Admins found:", admins.length);

    if (!filteredAdmins.length) {
      console.log("No subscribed admins found");
      return;
    }

    const payload = JSON.stringify({ title, body });

    await Promise.allSettled(
      filteredAdmins.map(async (admin) => {
        try {
          console.log(
            `Sending notification to ${admin.email}`
          );

          const result = await webpush.sendNotification(
            admin.pushSubscription,
            payload
          );

          console.log(
            `Notification sent successfully to ${admin.email}`
          );

          return result;
        } catch (err) {
          console.error(
            `Notification failed for ${admin.email}:`,
            err
          );

          if (
            err.statusCode === 404 ||
            err.statusCode === 410
          ) {
            await User.findByIdAndUpdate(filteredAdmins._id, {
              "pushSubscription.endpoint": null,
              "pushSubscription.keys.p256dh": null,
              "pushSubscription.keys.auth": null,
            });

            console.log(
              `Removed expired subscription for ${filteredAdmins.email}`
            );
          }
        }
      })
    );
  } catch (error) {
    console.error("notifyAdmins error:", error);
  }
};