# The world's first automated notion spaced repetition system

You may want to get into spaced repetition and use it to achieve your goals, but if you're anything like me, you'll forget you had to do review to stop forgetting what you're trying to remember.
This notion system stops that from happening - you get text message and email reminders every day telling you which tasks you need to review.

## How it works

To create gmail text messaging reminders, follow these steps:

1. Create a gmail application password by going here https://myaccount.google.com/apppasswords
2. Save the app name and password to your `.env`

Here is a basic example of how to use mail to carrier syntax with nodemailer to send a text message:

```ts
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brandon@brandon.com", // Replace with your Gmail address
    pass: "password", // Replace with your Gmail password or App Password
  },
});

const mailOptions = {
  from: "brandon@brandon.com", // Replace with your Gmail address
  to: "5555555555@tmomail.net", // Replace with the recipient's phone number
  subject: "Hello, world!",
  text: "Hello, world! this is message body", // SMS content
};

const info = await transporter.sendMail(mailOptions);
console.log("Message sent:", info.response);
```

## Mailer class

This Mailer class can send both emails and SMS using gmail.

```ts
// ! this is how you fucking do it
// @ts-types="npm:@types/nodemailer"
import nodemailer from "npm:nodemailer";

type Carrier =
  | "tmobile"
  | "verizon"
  | "at&t"
  | "cricket"
  | "boost"
  | "googlefi"
  | "metro";
export class Mailer {
  private transporter: ReturnType<typeof nodemailer.createTransport>;
  constructor(
    public readonly senderEmail: string,
    public readonly senderPassword: string
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail, // Replace with your Gmail address
        pass: senderPassword, // Replace with your Gmail password or App Password
      },
    });
  }

  async sendEmail(recipient: string, subject: string, message: string) {
    // Create a transporter

    // Email options
    const mailOptions = {
      from: this.senderEmail, // Sender address
      to: recipient, // Receiver address (your Gmail)
      subject: subject, // Subject line
      text: message, // Plain text body
    };

    try {
      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  private getCarrierGateway(carrier: Carrier) {
    const carrierToGateway: Record<Carrier, string> = {
      tmobile: "tmomail.net",
      verizon: "vtext.com",
      "at&t": "txt.att.net",
      cricket: "sms.cricketwireless.net",
      boost: "myboostmobile.com",
      googlefi: "msg.fi.google.com",
      metro: "mymetropcs.com",
    };
    return carrierToGateway[carrier];
  }

  /**
   *
   * @param phoneNumber The US 10 digit phone number
   * @param message
   */
  async sendSMS(
    phoneNumber: string,
    subject: string,
    message: string,
    options?: {
      carrier?: Carrier;
    }
  ) {
    if (!phoneNumber.match(/^\d{10}$/)) {
      throw new Error("Invalid phone number, must be 10 digits");
    }

    // SMS gateway address
    const carrier: Carrier = options?.carrier ?? "tmobile";
    const tMobileGateway = `${phoneNumber}@${this.getCarrierGateway(carrier)}`;

    // Email message details
    const mailOptions = {
      from: this.senderEmail, // Your email address
      to: tMobileGateway,
      subject: subject,
      text: message, // SMS content
    };

    try {
      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent:", info.response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}
```

Here is an example of how to use the Mailer class to send an email and an SMS:

```ts
const mailer = new Mailer("brandon@brandon.com", "password");
await mailer.sendEmail("brandon@brandon.com", "Hello, world!", "Hello, world!");
await mailer.sendSMS("5555555555", "Hello, world!", "Hello, world!");
```
