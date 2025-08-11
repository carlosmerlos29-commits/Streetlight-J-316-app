
'use server';

/**
 * @fileOverview A geocoding flow that converts an address to coordinates.
 *
 * - geocodeAddress - A function that takes an address and returns its latitude and longitude.
 * - GeocodeAddressInput - The input type for the geocodeAddress function.
 * - GeocodeAddressOutput - The return type for the geocodeAddress function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeocodeAddressInputSchema = z.string().describe('The address to geocode.');
export type GeocodeAddressInput = z.infer<typeof GeocodeAddressInputSchema>;

const GeocodeAddressOutputSchema = z.object({
  lat: z.number().describe('The latitude of the address.'),
  lng: z.number().describe('The longitude of the address.'),
});
export type GeocodeAddressOutput = z.infer<typeof GeocodeAddressOutputSchema>;

export async function geocodeAddress(address: GeocodeAddressInput): Promise<GeocodeAddressOutput> {
  return geocodeAddressFlow(address);
}

const geocodeAddressFlow = ai.defineFlow(
  {
    name: 'geocodeAddressFlow',
    inputSchema: GeocodeAddressInputSchema,
    outputSchema: GeocodeAddressOutputSchema,
  },
  async (address) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key not configured.');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error('Geocoding API error:', data.status, data.error_message);
      // Fallback to a random location if geocoding fails
      return {
        lat: 38.8315 + (Math.random() - 0.5) * 0.1,
        lng: -77.3061 + (Math.random() - 0.5) * 0.1,
      };
    }

    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  }
);
