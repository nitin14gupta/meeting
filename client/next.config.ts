import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || 'AIzaSyBeUdFBeVDzSwxs6c7qS53J_KNlyvqlKkU',
    NEXT_PUBLIC_GEMINI_MODEL_NAME: process.env.GEMINI_MODEL_NAME || 'gemini-2.5-flash',
  },
};

export default nextConfig;
