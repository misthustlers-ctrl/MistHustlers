import { handler } from "../../netlify/functions/fetch-audit-html.mjs";
import { bridge } from "../_bridge.js";

export async function onRequest(context) {
  return bridge(context.request, context.env, handler);
}