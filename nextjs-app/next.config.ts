import type { NextConfig } from "next";

const API_URL = 'http://localhost:8000' // Database API

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',       // alle Anfragen, die mit /api/ starten
        destination: `${API_URL}/:path*`, // werden an Backend weitergeleitet
      },
    ]
  },
};

export default nextConfig;
