// ============================================================================
//  Optional: send an email to people who don't have the app yet.
//  Deploy as a Supabase Edge Function named "invite-email".
//
//    supabase functions deploy invite-email
//    supabase secrets set RESEND_API_KEY=xxxxx APP_URL=https://domlte94-bot.github.io/FPA/
//
//  Needs a free Resend account (https://resend.com) + a verified sender.
//  Without this function the share still works: it attaches automatically the
//  moment the invited person signs up with that email. This just nudges them.
// ============================================================================

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const APP_URL = Deno.env.get("APP_URL") || "https://domlte94-bot.github.io/FPA/";
const FROM = "My Goals <onboarding@resend.dev>"; // replace with your verified sender

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { email, ownerName, itemName, itemType } = await req.json();
    if (!email || !itemName) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400, headers: cors });
    }
    const kind = itemType === "investment" ? "an investment" : "a goal";
    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:auto">
        <h2 style="margin:0 0 8px">${ownerName || "Someone"} shared ${kind} with you</h2>
        <p style="color:#444;font-size:15px;line-height:1.5">
          They shared <b>${itemName}</b> on My Goals. Create an account with
          <b>${email}</b> and it will show up automatically.
        </p>
        <a href="${APP_URL}" style="display:inline-block;background:#0071e3;color:#fff;
           text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:700;margin-top:8px">
          Open My Goals
        </a>
      </div>`;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: email, subject: `${ownerName || "Someone"} shared "${itemName}" with you`, html }),
    });
    const data = await r.json();
    return new Response(JSON.stringify(data), { status: r.ok ? 200 : 500, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
