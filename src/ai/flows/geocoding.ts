
'use server';

/**
 * @fileOverview Un flujo de geocodificación que convierte una dirección en coordenadas.
 *
 * - geocodeAddress - Una función que toma una dirección y devuelve su latitud y longitud.
 * - GeocodeAddressInput - El tipo de entrada para la función geocodeAddress.
 * - GeocodeAddressOutput - El tipo de retorno para la función geocodeAddress.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import fetch from 'node-fetch';

const GeocodeAddressInputSchema = z.string().describe('La dirección a geocodificar.');
export type GeocodeAddressInput = z.infer<typeof GeocodeAddressInputSchema>;

const GeocodeAddressOutputSchema = z.object({
  lat: z.number().describe('La latitud de la dirección.'),
  lng: z.number().describe('La longitud de la dirección.'),
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
      throw new Error('La clave de API de Google Maps no está configurada.');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error('Error de la API de geocodificación:', data.status, data.error_message);
      // Fallback a una ubicación aleatoria si falla la geocodificación
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
