/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.eventbriteapi.com', 'img.evbuc.com'], // Adicione os domínios necessários
  },
  env: {
    EVENTBRITE_API_KEY: process.env.EVENTBRITE_API_KEY,
  },
}

module.exports = nextConfig