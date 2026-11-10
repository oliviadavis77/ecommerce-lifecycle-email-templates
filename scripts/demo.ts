import { sendOrderMail } from "../src/order_mail.js";

const to = process.env.DEMO_EMAIL_TO;
if (!to) throw new Error("DEMO_EMAIL_TO is required");
const result = await sendOrderMail({ to, orderId: "COURSE-1007", status: "fulfilled", customerName: "Ari" });
console.log(`sent order email: ${result.message_id}`);
