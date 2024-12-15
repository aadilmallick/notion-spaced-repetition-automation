import dotenv from "npm:dotenv";

dotenv.config();

export class Constants {
  static API_KEY = Deno.env.get("API_KEY") as string;
  static USER_GMAIL = Deno.env.get("USER_GMAIL") as string;
  static USER_GMAIL_APP_PASSWORD = Deno.env.get(
    "USER_GMAIL_APP_PASSWORD"
  ) as string;
  static USER_GMAIL_APP_NAME = Deno.env.get("USER_GMAIL_APP_NAME") as string;
  static PUSHOVER_APPLICATION_KEY = Deno.env.get(
    "PUSHOVER_APPLICATION_KEY"
  ) as string;
  static PUSHOVER_USER_KEY = Deno.env.get("PUSHOVER_USER_KEY") as string;
  static phoneNumber = Deno.env.get("PHONE_NUMBER") as string;
  static {
    for (const key of Object.keys(this)) {
      if (!this[key as keyof typeof Constants]) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }
  }
  static DATABASE_ID = "8d8c263637f04cd1b032dfad77569957";
}
