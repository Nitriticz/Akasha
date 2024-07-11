import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";

const clientId =
  "AYPqMlX2NdsJ62tQOQov3TVOv5DIZUVBlnnFyLjFTPitEL29s14U5hFgGXrfR0l2weJc2DIkzr6A14WU";
const clientSecret =
  "EFdy9UWkdVYpMbXYiiOsZntQc58QN00yiiM4jVlflslxp_nT7OK9mtQ645mTKHzApuraS1PN3JW543ru";

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST() {
  const request = new paypal.orders.OrdersCreateRequest();

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "5.00",
        },
        description: "Akasha Plus Subscription",
      },
    ],
  });

  const response = await client.execute(request);

  return NextResponse.json({
    id: response.result.id,
  });
}
