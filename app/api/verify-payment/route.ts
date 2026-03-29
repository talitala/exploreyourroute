import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Verify with Lemon Squeezy API
  const res = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      Accept: "application/vnd.api+json",
    },
  });

  const data = await res.json();
  const status = data?.data?.attributes?.status;

  if (status === "paid") {
    const returnUrl = searchParams.get("return_url") || "/";
    let safeReturnUrl = "/";

    try {
      const targetUrl = new URL(returnUrl, req.url);
      if (targetUrl.origin === new URL(req.url).origin) {
        safeReturnUrl = targetUrl.pathname + targetUrl.search + targetUrl.hash;
      }
    } catch (err) {
      safeReturnUrl = "/";
    }

    const response = NextResponse.redirect(new URL(safeReturnUrl, req.url));
    response.cookies.set("eyr_premium", "true", { maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  return NextResponse.redirect(new URL("/", req.url));
}