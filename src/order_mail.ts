import { z } from "zod";
import { infrai } from "./infrai.js";

const OrderMail = z.object({
  to: z.string().email(),
  orderId: z.string().min(1),
  status: z.enum(["checkout", "fulfilled", "receipt", "update"]),
  customerName: z.string().min(1)
});
export type OrderMailInput = z.infer<typeof OrderMail>;

const subjects = { checkout: "Your checkout is ready", fulfilled: "Your order has shipped", receipt: "Your order receipt", update: "An update about your order" } as const;

export function renderOrderMail(input: OrderMailInput) {
  const value = OrderMail.parse(input);
  return { to: value.to, subject: `${subjects[value.status]} (${value.orderId})`, html: `<p>Hello ${value.customerName},</p><p>Order <strong>${value.orderId}</strong> is in the <strong>${value.status}</strong> stage.</p>` };
}

export async function sendOrderMail(input: OrderMailInput) {
  return infrai.email.send(renderOrderMail(input));
}

export function createLifecycleTemplate(status: OrderMailInput["status"]) {
  return { name: `course-store-${status}`, subject: subjects[status], html: `<p>Hello {{customerName}}, your order {{orderId}} is ${status}.</p>`, template_vars: ["customerName", "orderId"] };
}
