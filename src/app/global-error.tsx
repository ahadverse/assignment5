"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#ffffff",
          color: "#0f172a",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#dc2626",
            }}
          >
            Error
          </p>
          <h1 style={{ marginTop: "0.5rem", fontSize: "1.875rem", fontWeight: 700 }}>
            Something went wrong
          </h1>
          <p
            style={{
              margin: "0.75rem auto 0",
              maxWidth: "28rem",
              color: "#475569",
            }}
          >
            {error.message ||
              "An unexpected error occurred. Please refresh the page."}
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "2rem",
              borderRadius: "0.5rem",
              background: "#0f172a",
              color: "#ffffff",
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
