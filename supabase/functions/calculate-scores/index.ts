// supabase/functions/calculate-scores/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { scoringRules } from "@/scoringRules.ts";

const API_HOST = "v3.football.api-sports.io";
const API_KEY = Deno.env.get("RAPIDAPI_KEY");

// --- Función Helper para añadir un retraso (delay) ---
// (Para no saturar la API con 28 llamadas al mismo tiempo)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req: Request) => {
  console.log("¡Robot 'Seeder' de JUGADORES (Liga Arg 2023) iniciado!");

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // --- ⬇️ ¡LÓGICA DEL SEEDER DE JUGADORES! ⬇️ ---

    // 1. LEER los equipos que YA guardamos en nuestra DB
    console.log("Leyendo equipos desde la tabla 'teams'...");
    const { data: teams, error: teamsError } = await supabaseClient
      .from('teams')
      .select('id, api_team_id, name'); // Pedimos el ID de la API y nuestro ID interno (uuid)

    if (teamsError) {
      throw new Error(`Error leyendo teams: ${teamsError.message}`);
    }

    if (!teams || teams.length === 0) {
      throw new Error("No se encontraron equipos en la tabla 'teams'. ¿Ejecutaste el Seeder de Equipos primero?");
    }

    console.log(`¡Encontrados ${teams.length} equipos! Empezando a buscar jugadores...`);
    let totalPlayersInserted = 0;

    // 2. HACER BUCLE por cada equipo para pedir sus jugadores
    for (const team of teams) {
      console.log(`--- Buscando jugadores para: ${team.name} (API ID: ${team.api_team_id}) ---`);

      // 2a. Construir la URL del endpoint /players
      const url = new URL("https://v3.football.api-sports.io/players");
      url.searchParams.set("league", "128");
      url.searchParams.set("season", "2023");
      url.searchParams.set("team", team.api_team_id.toString()); // El ID del equipo del bucle

      // 2b. Llamar a la API
      const apiResponse = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY!,
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`API-Football falló para el equipo ${team.api_team_id}: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      if (data.response.length === 0) {
        console.log(`No se encontraron jugadores para ${team.name}. Saltando.`);
        continue;
      }

      // 3. PREPARAR los jugadores para guardar
      const playersToInsert = data.response.map((item: any) => ({
        api_player_id: item.player.id,
        name: item.player.name,
        photo_url: item.player.photo,
        position: item.player.type, // Ej: "Attacker", "Midfielder"
        team_id: team.id, // ¡LA CLAVE! El 'id' (uuid) de nuestra tabla 'teams'
        // (Añade cualquier otra columna que tengas en 'players')
      }));

      // 4. GUARDAR estos jugadores en Supabase
      const { error: upsertError } = await supabaseClient
        .from('players') // Tu tabla de jugadores
        .upsert(playersToInsert, {
          onConflict: 'api_player_id', // Clave única
        });

      if (upsertError) {
        console.warn(`Error guardando jugadores de ${team.name}: ${upsertError.message}`);
        // No lanzamos un error, solo advertimos y continuamos con el siguiente equipo
      } else {
        console.log(`¡Guardados ${playersToInsert.length} jugadores de ${team.name}!`);
        totalPlayersInserted += playersToInsert.length;
      }

      // 5. ¡ESPERAR! (Para no violar el "Rate Limit" de la API)
      await delay(2000); // Espera 2 segundos antes de pedir el siguiente equipo
    }

    // --- ⬆️ ¡FIN DE LA LÓGICA DEL SEEDER! ⬆️ ---

    console.log(`¡Seeder de jugadores finalizado! Total: ${totalPlayersInserted} jugadores guardados.`);

    // 6. Devolver una respuesta exitosa
    return new Response(
      JSON.stringify({ message: "¡Jugadores guardados en Supabase!", count: totalPlayersInserted }),
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