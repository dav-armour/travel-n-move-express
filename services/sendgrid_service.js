const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEnquiryEmail({ first_name, last_name, email, subject, message }) {
  const messageDetails = {
    to: [
      {
        email,
        name: `${first_name} ${last_name}`
      }
    ],
    dynamic_template_data: {
      first_name,
      last_name,
      email,
      subject,
      message
    },
    template_id: "d-62c9844ec1eb44fd8f2c732bd824f17b"
  };
  sendEmail(messageDetails);
}

function sendQuoteEmail({ user, start_date, end_date, ...otherDetails }) {
  let data = { ...user };
  data[otherDetails.type] = true;
  data.start_date = new Date(Date.parse(start_date)).toDateString();
  data.end_date = new Date(Date.parse(end_date)).toDateString();
  Object.keys(otherDetails).map(key => (data[key] = otherDetails[key]));
  const messageDetails = {
    to: [
      {
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      }
    ],
    dynamic_template_data: data,
    template_id: "d-52b281a0268346fdba8e30baf83827ef"
  };
  sendEmail(messageDetails);
}

function sendEmail(messageDetails) {
  const message = {
    ...messageDetails,
    from: {
      email: "dav.armour@gmail.com",
      name: "David Armour"
    },
    reply_to: {
      email: "dav.armour@gmail.com",
      name: "David Armour"
    }
  };
  // Skip actually sending email for test running
  if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "circle-ci") {
    message.mail_settings = {
      sandbox_mode: {
        enable: true
      }
    };
  }
  sgMail
    .send(message)
    .then(response => {
      if (!(response[0].statusCode === 202 || response[0].statusCode === 200)) {
        throw Error("Could not send email");
      }
      console.log("Successfully sent email");
    })
    .catch(err => {
      throw Error("Could not send email");
    });
}

module.exports = {
  sendEnquiryEmail,
  sendQuoteEmail
};
