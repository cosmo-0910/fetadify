import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get or create session ID
        let sessionId = localStorage.getItem("visitor_session_id");
        if (!sessionId) {
          sessionId = uuidv4();
          localStorage.setItem("visitor_session_id", sessionId);
        }

        // Gather browser info
        const userAgent = navigator.userAgent;
        const language = navigator.language;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const platform = navigator.platform;
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const currentUrl = window.location.href;

        // Try to get IP address (optional, use a public API)
        let ipAddress = "Unknown";
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch("https://api.ipify.org?format=json", {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          const data = await response.json();
          ipAddress = data.ip;
        } catch (ipErr) {
          console.warn("Could not fetch IP address (timed out or failed):", ipErr);
        }

        // Upsert visitor data
        // We use upsert on session_id to update 'updated_at' and 'total_visits' or 'visited_urls'
        // First, check if session exists
        const { data: existingVisitor, error: fetchError } = await supabase
          .from("visitor_analytics")
          .select("*")
          .eq("session_id", sessionId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching visitor:", fetchError);
          return;
        }

        if (existingVisitor) {
          // Update existing session
          const visitedUrls = Array.from(new Set([...(existingVisitor.visited_urls || []), currentUrl]));
          await supabase
            .from("visitor_analytics")
            .update({
              updated_at: new Date().toISOString(),
              total_visits: (existingVisitor.total_visits || 0) + 1,
              visited_urls: visitedUrls,
              ip_address: ipAddress !== "Unknown" ? ipAddress : existingVisitor.ip_address,
            })
            .eq("session_id", sessionId);
        } else {
          // Insert new session
          const browserType = getBrowserType(userAgent);
          const os = getOS(userAgent);

          await supabase.from("visitor_analytics").insert([
            {
              session_id: sessionId,
              ip_address: ipAddress,
              browser_type: browserType,
              operating_system: os,
              timezone: timezone,
              location: "Detected via IP/Timezone",
              visited_urls: [currentUrl],
              total_visits: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error("Visitor tracking failed:", err);
      }
    };

    trackVisitor();
  }, []);
};

// Helper functions to parse User Agent
function getBrowserType(userAgent: string) {
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident")) return "Internet Explorer";
  return "Unknown";
}

function getOS(userAgent: string) {
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
  if (userAgent.includes("Linux")) return "Linux";
  return "Unknown";
}
