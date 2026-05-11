export const ENDPOINT = {
  //auth
  login: `/auth/signin`,
  signup: `/auth/signup`,
  logout: `/auth/signout`,
  refresh: `/auth/refresh`,

  // profile
  getProfile: `/user/profile`,
  updateProfile: `/user/profile`,

  //users
  getUsers: `/users`,

  // blood pressure
  listBP: `/blood-pressure/list`,
  createBP: `/blood-pressure`,
  getBP: `/blood-pressure/%s`,
  updateBP: `/blood-pressure/%s`,

  // reminders
  listReminder: `/reminder`,
  createReminder: `/reminder`,
  getReminder: `/reminder/%s`,
  updateReminder: `/reminder/%s`,
  deleteReminder: `/reminder/%s`,

  // notifications
  subscribeWebPush: `/notification/subscribe-webpush`,
};
