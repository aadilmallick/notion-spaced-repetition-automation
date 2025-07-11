import { Client } from "npm:@notionhq/client";
import { Mailer } from "./Mailer.ts";
import { Constants } from "./Constants.ts";

const notion = new Client({ auth: Constants.API_KEY });

async function getTasks() {
  const thing = await notion.databases.query({
    database_id: Constants.DATABASE_ID,
  });

  const data = thing.results.map((result: any) => {
    return {
      nextReviewDate: result.properties["Next review date"] as NextReviewDate,
      status: result.properties["Status"] as Status,
      lastReviewedDate: result.properties["last reviewed"] as LastReviewedDate,
      name: result.properties["Name"] as Name,
    };
  });

  const lateTasks = data.filter((item) =>
    item.status.formula.string.startsWith("Needs Review")
  );
  return lateTasks;
}

async function sendText(tasks: Awaited<ReturnType<typeof getTasks>>) {
  const taskNames = tasks.map((task) => task.name.title[0].plain_text);
  const message = "Hurry up and review these tasks: " + taskNames.join(", ");
  const subject = "Notion Spaced Repetition Reminder";
  console.log(message);

  const mailer = new Mailer(
    Constants.USER_GMAIL,
    Constants.USER_GMAIL_APP_PASSWORD
  );

  // 1. send gmail
  await mailer.sendEmail(
    Constants.USER_GMAIL,
    "Notion Spaced Repetition Reminder",
    message
  );

  // 2. send text
  await mailer.sendSMS(Constants.phoneNumber, subject, message, {
    carrier: "at&t",
  });

  // 3. send push
  await fetch("https://api.pushover.net/1/messages.json", {
    method: "post",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      token: Constants.PUSHOVER_APPLICATION_KEY,
      user: Constants.PUSHOVER_USER_KEY,
      message,
    }),
  });
}

const tasks = await getTasks();
if (tasks.length > 0) {
  await sendText(tasks);
}
