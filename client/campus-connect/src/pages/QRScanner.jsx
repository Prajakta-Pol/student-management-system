import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export default function QRScanner() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const scannedRef = useRef(false);

  const [status, setStatus] = useState("Starting camera...");

  useEffect(() => {

  const startScanner = async () => {
    try {
      // ✅ STEP 1: REQUEST CAMERA PERMISSION FIRST
      await navigator.mediaDevices.getUserMedia({ video: true });

      // ✅ STEP 2: START SCANNER AFTER PERMISSION
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },

        async (decodedText) => {
          if (scannedRef.current) return;
          scannedRef.current = true;

          try {
            setStatus("Processing...");

            const data = JSON.parse(decodedText);

            await API.post("/app/scan-qr", {
              userId: user.id,
              eventId: data.eventId,
              qrToken: data.qrToken
            });

            setStatus("✅ Attendance marked!");

            if (isRunningRef.current) {
              await scanner.stop();
              isRunningRef.current = false;
            }

            setTimeout(() => {
              navigate("/dashboard/events");
            }, 800);

          } catch (err) {
            setStatus("❌ Invalid QR");
            scannedRef.current = false;
          }
        }
      );

      isRunningRef.current = true;
      setStatus("Scanning...");

    } catch (err) {
      console.log("Camera error:", err);

      // 🔥 IMPORTANT MESSAGE
      if (err.name === "NotAllowedError") {
        setStatus("⚠️ Camera permission denied. Please allow camera.");
      } else {
        setStatus("Camera failed to start ❌");
      }
    }
  };

  startScanner();

  return () => {
    if (scannerRef.current && isRunningRef.current) {
      scannerRef.current.stop().catch(() => {});
      isRunningRef.current = false;
    }
  };

}, []);

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold mb-2">Scan QR 📷</h1>
      <p className="text-gray-500 mb-4">{status}</p>

      <div
        id="reader"
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "auto"
        }}
      ></div>
    </div>
  );
}