"use client";
import { useState } from "react";

export default function PlanUpload() {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setDownloadUrl("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/process-plan", { method: "POST", body: form });
    const data = await res.json();
    setLoading(false);
    if (data.url) setDownloadUrl(data.url);
    else alert(data.error || "Something went wrong");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input type="file" name="plan" accept="application/pdf" required />
      <button type="submit" disabled={loading} className="rounded px-4 py-2 border">
        {loading ? "Processing…" : "Generate Takeoff"}
      </button>
      {downloadUrl && (
        <a href={downloadUrl} className="underline" target="_blank" rel="noreferrer">
          Download Takeoff (.xlsx)
        </a>
      )}
    </form>
  );
}
