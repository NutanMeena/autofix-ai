import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";

function Editor() {

  const [code, setCode] = useState(
`function calculateTotal(price, tax) {

console.log("Calculating total...")

let total = price + tax

if(total > 100)
console.log("High amount")

return total

}

calculateTotal(50, 20)`
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/analyze",
        { code }
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Backend API Error");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #020617)",
        color: "white",
        overflow: "hidden",
        fontFamily: "Arial"
      }}
    >

      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 30px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          animation: "slideDown 0.7s ease"
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              background: "linear-gradient(to right, #38bdf8, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            🚀 AutoFix AI
          </h1>
          <p style={{ opacity: 0.7 }}>AI Powered Code Debugger</p>
        </div>

        <button
          onClick={analyzeCode}
          style={{
            background: loading
              ? "#334155"
              : "linear-gradient(to right, #2563eb, #7c3aed)",
            color: "white",
            border: "none",
            padding: "14px 28px",
            borderRadius: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0px 0px 25px rgba(99,102,241,0.4)",
            transition: "0.3s"
          }}
        >
          {loading ? "⚡ Analyzing..." : "✨ Fix Code"}
        </button>
      </div>

      {/* MAIN */}
      <div style={{ display: "flex", height: "calc(100vh - 100px)" }}>

        {/* LEFT PANEL */}
        <div style={{ width: "50%", padding: "20px", animation: "fadeLeft 1s ease" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              overflow: "hidden",
              height: "100%",
              backdropFilter: "blur(20px)",
              boxShadow: "0px 0px 40px rgba(0,0,0,0.3)"
            }}
          >
            <div
              style={{
                padding: "12px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)"
              }}
            >
              <strong>🧠 AI Editor</strong>
            </div>

            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            width: "50%",
            padding: "20px",
            overflowY: "auto",
            animation: "fadeRight 1s ease"
          }}
        >

          {/* ERRORS */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "20px",
              backdropFilter: "blur(20px)",
              boxShadow: "0px 0px 30px rgba(0,0,0,0.3)"
            }}
          >
            <h2>⚠ Detected Errors</h2>

            {result?.errors?.length > 0 ? (
              result.errors.map((err, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "15px",
                    animation: "popIn 0.5s ease"
                  }}
                >
                  <p><strong>Line:</strong> {err.line}</p>
                  <p><strong>Error:</strong> {err.message}</p>
                  <p><strong>Suggestion:</strong> {err.suggestion}</p>
                </div>
              ))
            ) : (
              <p>No errors detected</p>
            )}
          </div>

          {/* FIXED CODE */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "20px",
              backdropFilter: "blur(20px)",
              boxShadow: "0px 0px 30px rgba(0,0,0,0.3)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>✅ Corrected Code</h2>
              <button
                onClick={() => {
                  if (result?.correctedCode) {
                    setCode(result.correctedCode);
                  }
                }}
                style={{
                  background: "linear-gradient(to right, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0px 0px 20px rgba(16,185,129,0.4)"
                }}
              >
                ⚡ Apply Fix
              </button>
            </div>

            <div style={{ height: "300px", borderRadius: "12px", overflow: "hidden" }}>
              <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={result?.correctedCode || "// Fixed code appears here"}
                options={{ readOnly: true }}
              />
            </div>
          </div>

          {/* SCORE */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "20px",
              backdropFilter: "blur(20px)",
              boxShadow: "0px 0px 30px rgba(0,0,0,0.3)"
            }}
          >
            <h2>📊 AI Score</h2>
            <p>Overall: {result?.score?.overall ?? 0}</p>
            <p>Performance: {result?.score?.performance ?? 0}</p>
            <p>Security: {result?.score?.security ?? 0}</p>
            <p>Readability: {result?.score?.readability ?? 0}</p>
          </div>

          {/* EXPLANATION */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "20px",
              backdropFilter: "blur(20px)",
              boxShadow: "0px 0px 30px rgba(0,0,0,0.3)"
            }}
          >
            <h2>🧠 AI Explanation</h2>
            <p>{result?.explanation || "AI explanation will appear here"}</p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0px); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        @keyframes popIn {
          from { transform: scale(0.9); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>

    </div>
  );
}

export default Editor;