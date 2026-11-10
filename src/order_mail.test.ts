import assert from "node:assert/strict";
import { renderOrderMail } from "./order_mail.js";

const mail = renderOrderMail({ to: "learner@example.com", orderId: "ORD-42", status: "receipt", customerName: "Mina" });
assert.equal(mail.subject, "Your order receipt (ORD-42)");
assert.match(mail.html, /ORD-42/);
assert.throws(() => renderOrderMail({ to: "bad", orderId: "ORD-42", status: "receipt", customerName: "Mina" }));
console.log("order mail decision test passed");
