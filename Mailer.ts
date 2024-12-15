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
