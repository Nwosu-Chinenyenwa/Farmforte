export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createAdminClient, debugSupabase } from "@/lib/supabaseAdmin";
import { Resend } from "resend";
import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    console.log("DEBUG: debugSupabase ->", debugSupabase());

    const supabase = createAdminClient();

    const payload = await req.json();
    console.log("API received payload:", JSON.stringify(payload));

    if (
      !payload?.name ||
      typeof payload.name !== "string" ||
      !payload.name.trim()
    ) {
      return NextResponse.json(
        { error: "Missing or invalid name" },
        { status: 400 }
      );
    }

    if (
      payload.price === undefined ||
      payload.price === null ||
      isNaN(Number(payload.price))
    ) {
      return NextResponse.json(
        { error: "Missing or invalid price" },
        { status: 400 }
      );
    }

    const readTest = await supabase.from("products").select("id").limit(1);
    if (readTest.error) {
      console.error("READ TEST ERROR:", readTest.error);
      return NextResponse.json(
        { error: "Read test failed", detail: JSON.stringify(readTest.error) },
        { status: 500 }
      );
    }
    console.log("READ TEST OK, sample data:", readTest.data);

    const insertObj = {
      name: payload.name.trim(),
      price: Number(payload.price),
      description: payload.description || null,
      category: payload.category || null,
      stock: payload.stock !== undefined ? Number(payload.stock) : 0,
      weight: payload.weight !== undefined ? Number(payload.weight) : null,
      discount_price:
        payload.discount_price !== undefined
          ? Number(payload.discount_price)
          : null,
      slug:
        payload.slug || payload.name.trim().toLowerCase().replace(/\s+/g, "-"),
      image_url: payload.image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: payload.created_by || null,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([insertObj])
      .select();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        {
          error: "Supabase insert error",
          detail: {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          },
        },
        { status: 500 }
      );
    }

    try {
      const { data: subscribers, error: subErr } = await supabase
        .from("subscribers")
        .select("email");

      if (subErr) {
        console.error("Error fetching subscribers:", subErr.message);
      } else if (subscribers?.length) {
        const emails = subscribers.map((sub) => sub.email);

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: emails,
          subject: `New Product Added! 🎉`,
          html: `
            <h2>New Product Alert!</h2>
            <p>${payload.name} has just been added to our store. Check it out!</p>
         <a href="http://localhost:3000/Shop" 
       style="
         background-color: #3b82f6; 
         border-radius: 4px; 
         color: #fff; 
         display: inline-block; 
         font-size: 16px; 
         font-weight: 600; 
         padding: 12px 24px; 
         text-decoration: none;
       ">
       View Products
    </a>
          `,
        });

        console.log("Newsletter sent to subscribers:", emails.length);
      }
    } catch (newsletterErr) {
      console.error("Error sending newsletter:", newsletterErr);
    }

    return NextResponse.json(
      { ok: true, product: data?.[0] ?? null },
      { status: 201 }
    );
  } catch (err) {
    console.error("API unexpected error:", err);
    return NextResponse.json(
      { error: "Server error", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "4px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
};
