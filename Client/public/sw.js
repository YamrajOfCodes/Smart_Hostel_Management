self.addEventListener("install", () => {
  console.log("Service Worker Installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker Activated");
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Notification",
      body: event.data?.text() || "",
    };
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Notification",
      {
        body: data.body || "",
        icon: "/logo192.png", // optional
        badge: "/logo192.png", // optional
      }
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/")
  );
});