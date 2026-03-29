"use client";
import { useEffect, useState } from "react";
import { parseJsonResponse } from "@/lib/fetch";

export default function SuccessPage() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId =
      params.get("order_id") || params.get("orderId") || params.get("id");

    if (!orderId) {
      setError("No order found.");
      setLoading(false);
      return;
    }

    // Fetch PDF URL from your server
    fetch(`/api/get-pdf?order_id=${orderId}`)
      .then(async (res) => {
        const data = await parseJsonResponse<{ error?: string; pdfUrl?: string }>(res);
        if (!res.ok) {
          throw new Error(data?.error || "Unable to load PDF.");
        }
        return data;
      })
      .then((data) => {
        if (data?.pdfUrl) setPdfUrl(data.pdfUrl);
        else setError("Could not find your PDF.");
      })
      .catch((err) => setError(err?.message || "Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading your PDF...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="success-page">
      <h1>✅ Your PDF is ready!</h1>
      <a
        href={pdfUrl}
        className="px-6 py-3 rounded bg-gold text-dark font-bold"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download PDF
      </a>
    </div>
  );
}