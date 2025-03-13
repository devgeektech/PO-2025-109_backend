import admin from './firebase';

export const pushNotification = async (token: any, contentDetail: any, cb: any) => {
  const message = {
    token: token,
    data: {
      title: `${contentDetail.title}`,
      body: `${contentDetail.message}`,
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          sound: "alertsSound.wav",
          badge: 1,
          "mutable-content": 1,
        },
        my_custom_parameter: true,
      },
    },
  };
  const resp = await admin
    .messaging()
    .send(message);

    return cb(null, resp);
};
