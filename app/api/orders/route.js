// /app/api/orders/route.js  (or wherever your POST handler lives)
import { createAdminClient } from "@/lib/supabaseAdmin";

const supabase = createAdminClient();

const RESEND_API_URL = "https://api.resend.com/emails";
const ADMIN_EMAIL = process.env.CONTACT_TO;
const FROM_EMAIL = process.env.CONTACT_FROM || `no-reply@${process.env.SUPABASE_URL?.replace(/^https?:\/\//, "") || "example.com"}`;

// small helper to format currency
function formatCurrency(n) {
  if (typeof n !== "number") n = Number(n) || 0;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// build product rows HTML
function buildItemsHtml(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return `<tr><td colspan="4">No items</td></tr>`;
  }
  return items.map((it, i) => {
    const name = it.name ?? it.product_name ?? "Product";
    const qty = Number(it.quantity ?? it.qty ?? 1);
    const unit = Number(it.unit_price ?? it.price ?? 0);
    const line = unit * qty;
    return `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:8px">${i + 1}. ${escapeHtml(name)}</td>
        <td style="padding:8px; text-align:right">${formatCurrency(unit)}</td>
        <td style="padding:8px; text-align:center">${qty}</td>
        <td style="padding:8px; text-align:right">${formatCurrency(line)}</td>
      </tr>
    `;
  }).join("");
}

// escape HTML to reduce XSS risk in emails
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Create email HTML containing full order and form details
function buildOrderEmailHtml(orderRecord, verifyData = null) {
  const md = orderRecord.metadata || {};
  const items = md.items || [];
  const subtotal = items.reduce((s, it) => s + (Number(it.unit_price ?? it.price ?? 0) * Number(it.quantity ?? 1)), 0);
  const shipping = Number(orderRecord.shipping ?? 0) || 0;
  const total = Number(orderRecord.amount ?? subtotal + shipping);

  const customerFields = [
    ["First name", md.first_name],
    ["Last name", md.last_name],
    ["Email", md.email],
    ["Phone", md.phone],
    ["State / County", md.state],
    ["Country", md.country],
    ["Company / Full address", md.company],
    ["Order note", md.order_note],
  ].map(([k, v]) => `<tr><td style="padding:6px 8px; font-weight:600">${escapeHtml(k)}</td><td style="padding:6px 8px">${escapeHtml(v ?? "")}</td></tr>`).join("");

  const verifyHtml = verifyData ? `
    <tr><td style="padding:6px 8px; font-weight:600">Payment channel</td><td style="padding:6px 8px">${escapeHtml(verifyData.channel ?? "")}</td></tr>
    <tr><td style="padding:6px 8px; font-weight:600">Payment method</td><td style="padding:6px 8px">${escapeHtml(verifyData.payment_type ?? verifyData.authorization?.channel ?? "")}</td></tr>
    <tr><td style="padding:6px 8px; font-weight:600">Paid at</td><td style="padding:6px 8px">${escapeHtml(String(verifyData.paid_at ?? ""))}</td></tr>
  ` : "";

  return `
  <div style="font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#222; line-height:1.4;">
    <h2>Thanks for your order</h2>
    <p>Order reference: <strong>${escapeHtml(orderRecord.payment_reference ?? orderRecord.id ?? "N/A")}</strong></p>

    <h3>Items</h3>
    <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
      <thead>
        <tr style="background:#fafafa; text-align:left;">
          <th style="padding:8px">Product</th>
          <th style="padding:8px; text-align:right">Unit</th>
          <th style="padding:8px; text-align:center">Qty</th>
          <th style="padding:8px; text-align:right">Line</th>
        </tr>
      </thead>
      <tbody>
        ${buildItemsHtml(items)}
      </tbody>
      <tfoot>
        <tr><td colspan="3" style="padding:8px; text-align:right; font-weight:600">Subtotal</td><td style="padding:8px; text-align:right">${formatCurrency(subtotal)}</td></tr>
        <tr><td colspan="3" style="padding:8px; text-align:right; font-weight:600">Shipping</td><td style="padding:8px; text-align:right">${formatCurrency(shipping)}</td></tr>
        <tr><td colspan="3" style="padding:8px; text-align:right; font-weight:800">Total</td><td style="padding:8px; text-align:right; font-weight:800">${formatCurrency(total)}</td></tr>
      </tfoot>
    </table>

    <h3>Customer details</h3>
    <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
      ${customerFields}
    </table>

    ${verifyHtml ? `<h3>Payment verification</h3><table style="width:100%; border-collapse:collapse; margin-bottom:12px;">${verifyHtml}</table>` : ""}

    <p style="color:#666; font-size:13px">This is an automated receipt. If anything looks wrong, reply to this email or contact support.</p>
  </div>
  `;
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🟢 Received order payload:", {
      user_id: body.user_id ?? null,
      amount: body.amount ?? null,
      item_count: body.item_count ?? null,
    });

    // require Paystack payment_reference
    const reference = body.payment_reference;
    if (!reference) {
      return new Response(JSON.stringify({ error: "Missing Paystack payment reference" }), { status: 400 });
    }

    // verify with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    if (!verifyRes.ok) {
      const text = await verifyRes.text();
      console.error("Paystack verify fetch failed:", verifyRes.status, text);
      return new Response(JSON.stringify({ error: "Failed to verify payment with Paystack" }), { status: 502 });
    }

    const verifyDataWrapped = await verifyRes.json();
    if (!verifyDataWrapped.status || verifyDataWrapped.data.status !== "success") {
      console.error("Payment verification failed:", verifyDataWrapped);
      return new Response(JSON.stringify({ error: "Payment not verified" }), { status: 400 });
    }
    const verifyData = verifyDataWrapped.data;
    console.log("✅ Payment verified:", verifyData.id);

    // Prepare record safely
    const metadata = { ...(body.metadata || {}), items: (body.metadata && body.metadata.items) || [] };
    const userId = body.user_id && body.user_id !== "anonymous" ? body.user_id : null;

    const record = {
      user_id: userId,
      status: "paid",
      currency: body.currency ?? "NGN",
      amount: body.amount ?? 0,
      item_count: body.item_count ?? (Array.isArray(metadata.items) ? metadata.items.length : 0),
      metadata,
      payment_reference: reference,
      stripe_session_id: body.stripe_session_id ?? null,
    };
    if (verifyData.channel) record.payment_channel = verifyData.channel;
    if (verifyData.payment_type) record.payment_method = verifyData.payment_type;
    if (verifyData.paid_at) record.paid_at = verifyData.paid_at;

    // insert to supabase
    const { data: supaData, error: supaError } = await supabase.from("orders").insert([record]);

    if (supaError) {
      console.error("❌ Supabase insert error:", supaError.message, supaError.details);
      return new Response(JSON.stringify({ error: supaError.message }), { status: 400 });
    }

    const savedOrder = Array.isArray(supaData) ? supaData[0] : supaData;
    console.log("✅ Order saved to Supabase:", savedOrder?.id ?? "(no id)");

    // Build email content
    const emailHtml = buildOrderEmailHtml(record, verifyData);

    // send to customer (if email found) and to admin
    const toCustomer = (metadata.email && metadata.email.length > 3) ? metadata.email : null;
    const recipients = [];
    if (toCustomer) recipients.push(toCustomer);
    if (ADMIN_EMAIL && ADMIN_EMAIL.length > 3 && !recipients.includes(ADMIN_EMAIL)) recipients.push(ADMIN_EMAIL);

    const sendResults = [];
    if (recipients.length > 0 && process.env.RESEND_API_KEY) {
      for (const to of recipients) {
        try {
          const res = await fetch(RESEND_API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to,
              subject: `Your order receipt — ${escapeHtml(record.payment_reference || "")}`,
              html: emailHtml,
            }),
          });
          const json = await res.json();
          if (!res.ok) {
            console.error("Resend send error for", to, res.status, json);
            sendResults.push({ to, ok: false, status: res.status, body: json });
          } else {
            sendResults.push({ to, ok: true, id: json.id ?? json.messageId ?? null });
          }
        } catch (err) {
          console.error("Resend send exception for", to, err);
          sendResults.push({ to, ok: false, error: err?.message ?? String(err) });
        }
      }
    } else {
      console.warn("Skipping email send: no recipients or RESEND_API_KEY missing", { recipients, hasKey: !!process.env.RESEND_API_KEY });
    }

    return new Response(JSON.stringify({ order: savedOrder, emailSend: sendResults }), { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500 });
  }
}
