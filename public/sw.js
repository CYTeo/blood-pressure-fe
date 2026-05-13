// public/sw.js
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.");

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.warn("[Service Worker] Push data is not JSON:", event.data.text());
    data = { title: "New Reminder", body: event.data.text() };
  }

  console.log("[Service Worker] Push Data:", data);

  const options = {
    body: data.body || data.message || "It's time to take your blood pressure reading!",
    icon: "/logo/icon-192.webp",
    badge: "/logo/icon-192.webp",
    data: { url: data.url || "/" },
    tag: "reminder-notification",
    renotify: true,
    vibrate: [100, 50, 100],
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration
      .showNotification(data.title || "Reminder", options)
      .then(() =>
        console.log("[Service Worker] Notification shown successfully"),
      )
      .catch((err) =>
        console.error("[Service Worker] Notification error:", err),
      ),
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification clicked.");
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
