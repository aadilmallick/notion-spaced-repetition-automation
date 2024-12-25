import { Client } from "npm:@notionhq/client";
import { Mailer } from "./Mailer.ts";

/**
 * You need the 6 environment variables below in a .env file
 * to run this script.
 */

const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY") as string; // your notion api key
const USER_GMAIL = Deno.env.get("USER_GMAIL"); // your gmail
const USER_GMAIL_APP_PASSWORD = Deno.env.get("USER_GMAIL_APP_PASSWORD"); // the app password
const PHONE_NUMBER = Deno.env.get("PHONE_NUMBER"); // any phone number, or ur phone number
const DATABASE_ID = Deno.env.get("DATABASE_ID"); // notion database id for spaced repetition db
const CARRIER = Deno.env.get("CARRIER") as
  | "tmobile"
  | "verizon"
  | "at&t"
  | "cricket"
  | "boost"
  | "googlefi"
  | "metro";

if (
  !USER_GMAIL ||
  !USER_GMAIL_APP_PASSWORD ||
  !PHONE_NUMBER ||
  !NOTION_API_KEY ||
  !DATABASE_ID ||
  !CARRIER
) {
  throw new Error("Missing environment variables");
}
const notion = new Client({ auth: NOTION_API_KEY });

async function getTasks() {
  const db = await notion.databases.query({
    database_id: DATABASE_ID!,
  });

  // just get data we need
  const data = db.results.map((result: any) => {
    return {
      nextReviewDate: result.properties["Next review date"] as NextReviewDate,
      status: result.properties["Status"] as Status,
      lastReviewedDate: result.properties["last reviewed"] as LastReviewedDate,
      name: result.properties["Name"] as Name,
    };
  });

  // get only the late tasks
  const lateTasks = data.filter((item) =>
    item.status.formula.string.startsWith("Needs Review")
  );
  return lateTasks;
}

async function sendText(tasks: Awaited<ReturnType<typeof getTasks>>) {
  // 0) craft message
  const taskNames = tasks.map((task) => task.name.title[0].plain_text);
  const message = "Hurry up and review these tasks: " + taskNames.join(", ");
  const subject = "Notion Spaced Repetition Reminder";
  // setup email provider by authenticating yourself with your email and app password
  const mailer = new Mailer(USER_GMAIL!, USER_GMAIL_APP_PASSWORD!);

  // 1. send gmail from yourself to well ... yourself or anybody else.
  await mailer.sendEmail(
    USER_GMAIL!,
    "Notion Spaced Repetition Reminder",
    message
  );

  // 2. send text
  await mailer.sendSMS(PHONE_NUMBER!, subject, message, {
    carrier: CARRIER,
  });
}

interface Name {
  id: string;
  type: string;
  title: {
    type: string;
    text: {
      content: string;
      link: string | null;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: string | null;
  }[];
}

interface NextReviewDate {
  id: string;
  type: string;
  formula: {
    type: string;
    date: {
      start: string;
      end: string | null;
      time_zone: string | null;
    };
  };
}

interface Status {
  id: string;
  type: string;
  formula: {
    type: string;
    string: string;
  };
}

interface LastReviewedDate {
  id: string;
  type: string;
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  };
}
