// supabase/functions/calculate-scores/index.ts

// (No te preocupes si VS Code subraya estas líneas en rojo)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Importamos tu fórmula desde la nueva carpeta _shared
import { scoringRules } from "@/scoringRules.ts";

// --- Constantes de la API de Deportes ---
const API_HOST = "v3.football.api-sports.io";
// Carga tu API Key secreta (que guardaste en Supabase)
const API_KEY = Deno.env.get("RAPIDAPI_KEY");

// --- Función Principal del Robot ---
serve(async (req: Request) => {
  console.log("¡Robot 'calculate-scores' iniciado!");

  try {
    // 1. Crear un cliente de Supabase (con permisos de admin)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Usa la service_role para poder escribir en la DB
    );

    // --- 🔄 CAMBIO DE ENDPOINT ---
    // Ahora pedimos los equipos de la Liga Argentina 2024
    const url = new URL("https://v3.football.api-sports.io/teams");
    url.searchParams.set("league", "128"); // Liga Profesional Argentina
    url.searchParams.set("season", "2023"); // Temporada 2024

    console.log("Llamando a la API de Deportes en:", url.toString());

    // 2. Llamado a la API
    const apiResponse = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": API_HOST,
        "x-rapidapi-key": API_KEY!,
      },
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(`API-Football falló: ${apiResponse.status} ${errorBody}`);
    }

    const data = await apiResponse.json();
    console.log("Datos de equipos recibidos con éxito.");

    // --- 👇 NUEVA SECCIÓN: Procesar Equipos ---
    for (const item of data.response) {
      const teamId = item.team.id;
      const teamName = item.team.name;
      const teamCountry = item.team.country;
      const founded = item.team.founded;

      console.log(
        `Equipo recibido: [${teamId}] ${teamName} (${teamCountry}, fundado en ${founded})`,
      );

      // Ejemplo de cómo podrías guardar en Supabase (si quisieras)
      /*
      await supabaseClient
        .from("teams")
        .insert({
          id: teamId,
          name: teamName,
          country: teamCountry,
          founded: founded,
        });
      */
    }

    console.log("¡Procesamiento de Equipos finalizado!");

    // 5. Devolver una respuesta exitosa
    return new Response(
      JSON.stringify({
        message: "¡Equipos recibidos con éxito!",
        data_received: data.response,
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );

  } catch (error: unknown) {
    let errorMessage = "Un error desconocido ocurrió.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error en el robot:", errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
