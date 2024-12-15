import { Constants } from "./Constants.ts";
import { Mailer } from "./Mailer.ts";

const mailer = new Mailer(
  Constants.USER_GMAIL,
  Constants.USER_GMAIL_APP_PASSWORD
);

for (let i = 0; i < 10; i++) {
  await mailer.sendSMS(
    "8042459612",
    "Buttcheecks",
    "Big Booty Buttcheeks ".repeat(15),
    {
      carrier: "verizon",
    }
  );
}
