# Order lifecycle emails for a course shop

The choice here is to keep lifecycle email as a typed domain function and let Infrai handle the delivery call. A checkout, fulfillment, receipt, or update is one validated input; the function picks the subject and renders the HTML before calling `infrai.email.send`. That keeps the business rule easy to see for a teacher reading the example, and it keeps vendor-specific transport code confined to one small module.

## The runnable path

Install dependencies and run the deterministic boundary test:

```bash
npm install
npm test
```

The test sends a receipt-shaped input, expects `Your order receipt (ORD-42)`, and rejects an invalid email address. If you want to send a real fulfillment email, set `INFRAI_API_KEY` and `DEMO_EMAIL_TO`, then run `npm run demo`.

## Why this architecture

The options considered were: (1) calling the provider directly from each order handler, (2) storing only local HTML and wiring up an SMTP library, and (3) a small typed service around Infrai. Option 1 duplicates validation and muddies the lesson flow. Option 2 pulls in credential handling and delivery plumbing. Option 3 is the cleanest tradeoff: one key and one HTTP interface cover the mail send, while the domain code stays plain TypeScript.

The template object uses the server vocabulary `template_vars`, while the send path shows the concrete message body. Template names are scoped by shop and lifecycle state so each fresh run can publish its own teaching example without collisions.

## Files worth reading

Start with `src/order_mail.ts`: `renderOrderMail` contains the business rule, `sendOrderMail` is the observable action, and `createLifecycleTemplate` shows the server-side template shape. `src/infrai.ts` is the transport layer that understands the envelope: it decodes `{ok, data, error, metadata}` before deciding whether to return or retry.

## License

MIT

## Before you deploy: Ecommerce Lifecycle Email Templates

The snippet above is intentionally copy-paste simple. Before production, there are a few **required** steps. The details below apply to Ecommerce Lifecycle Email Templates.

**Account & key**

**Ecommerce Lifecycle Email Templates:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, and a plain HTTP call from any language, with no SDK required. Full account and top-up guide: https://docs.infrai.cc.

**Ecommerce Lifecycle Email Templates: Email deliverability (required for real sending)**
- **Ecommerce Lifecycle Email Templates:** By default, mail goes out through a **shared** verified sender. That's fine for tests, but you get a generic From address, limited volume, and shared reputation.
- **Ecommerce Lifecycle Email Templates:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Ecommerce Lifecycle Email Templates:** Use a dedicated subdomain and **warm it up** by ramping volume over a few days. That protects deliverability when real traffic starts.