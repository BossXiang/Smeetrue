const sgMail = require("@sendgrid/mail");

const sendgridAPIKey =
  "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";

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "b10815066@gapps.ntust.edu.tw",
    subject: "[Smeetrue] Welcome to use Smeetrue!",
    text: `Welcome to the app, ${name}. Let me know how you get alone with the appl!`,
  });
};

const sendInvitationEmail = (
  email,
  hostName,
  meetingName,
  month,
  day,
  startTime,
  endTime
) => {
  sgMail.send({
    to: email,
    from: "b10815066@gapps.ntust.edu.tw",
    subject: "[Smeetrue] Invitation to the meeting",
    text: `You are invited by ${hostName} to attend meeting '${meetingName}' on 2022/${
      month + 1
    }/${day + 1}, starting from ${startTime}:00 to ${endTime}:00`,
  });
};

const sendCancelEmail = (
  email,
  hostName,
  meetingName,
  month,
  day,
  startTime,
  endTime
) => {
  sgMail.send({
    to: email,
    from: "b10815066@gapps.ntust.edu.tw",
    subject: "[Smeetrue] Meeting cancelation notification",
    text: `The meeting '${meetingName}' hosted by ${hostName} on 2022/${
      month + 1
    }/${day + 1}, starting from ${startTime}:00 to ${endTime}:00 is cancelled!`,
  });
};

const sendGenericEmail = (email, _text) => {
  sgMail.send({
    to: email,
    from: "b10815066@gapps.ntust.edu.tw",
    subject: "[Smeetrue] Meeting notification!",
    text: `${_text}`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendInvitationEmail,
  sendCancelEmail,
  sendGenericEmail,
};
