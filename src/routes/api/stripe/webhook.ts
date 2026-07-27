import { createAPIFileRoute } from "@tanstack/react-start/api";
import { db } from "~/db/index";
import { enrollments } from "~/db/schema";
import { eq, and } from "drizzle-orm";
import { getStripe } from "~/lib/stripe";

// Stripe webhook handler for production-grade enrollment fulfillment.
// This runs when Stripe sends a checkout.session.completed event,
// ensuring enrollment is created even if the user never reaches
// the success page (e.g., browser closed, network error).

export const APIRoute = createAPIFileRoute("/api/stripe/webhook")({
  POST: async ({ request }) => {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return new Response(
          JSON.stringify({ error: "Webhook secret not configured" }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      const stripe = getStripe();
      const signature = request.headers.get("stripe-signature");

      if (!signature) {
        return new Response(
          JSON.stringify({ error: "Missing stripe-signature header" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const body = await request.text();

      let event;
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Handle checkout.session.completed
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const bundleId = parseInt(session.metadata?.bundleId ?? "0");
        const userId = session.metadata?.userId;

        if (bundleId && userId) {
          const d = db();

          // Check for existing enrollment
          const [existing] = await d
            .select()
            .from(enrollments)
            .where(
              and(
                eq(enrollments.userId, userId),
                eq(enrollments.bundleId, bundleId),
              ),
            );

          if (!existing) {
            await d.insert(enrollments).values({
              userId,
              bundleId,
            });
            console.log(
              `Webhook: Created enrollment for user ${userId}, bundle ${bundleId}`,
            );
          }
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("Webhook error:", err);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
