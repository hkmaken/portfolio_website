import assert from "node:assert";
import { contactSchema } from "./contact.schema";

assert.ok(
  !contactSchema.safeParse({ name: "", email: "x", message: "short" }).success,
  "invalid input rejected",
);
assert.ok(
  contactSchema.safeParse({
    name: "A",
    email: "a@b.co",
    message: "a valid message here",
  }).success,
  "valid input accepted",
);
assert.ok(
  !contactSchema.safeParse({
    name: "A",
    email: "a@b.co",
    message: "a valid message here",
    company: "bot",
  }).success,
  "honeypot rejects",
);

console.log("contact.schema.test OK");
