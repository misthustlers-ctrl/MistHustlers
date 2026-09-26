import { handler } from "../../netlify/functions/find-leads.mjs";
import { bridge } from "../_bridge.js";

export async function onRequest(context) {
  return bridge(context.request, context.env, handler);
}