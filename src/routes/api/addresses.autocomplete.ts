import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import axios from "axios";

const SMARTY_AUTOCOMPLETE_PRO_API_URL =
  "https://us-autocomplete-pro.api.smarty.com/lookup";

export const ServerRoute = createServerFileRoute(
  "/api/addresses/autocomplete",
).methods({
  GET: async ({ request }) => {
    const authId = process.env.SMARTY_AUTH_ID; // This is your embedded key
    const authToken = process.env.SMARTY_AUTH_TOKEN;

    const url = new URL(request.url);
    const prefix = url.searchParams.get("prefix");

    if (!prefix) {
      return json({ error: "Missing prefix query parameter" }, { status: 400 });
    }

    if (!authId || !authToken) {
      console.error("SmartyStreets authId (embedded key) is not configured.");
      return json(
        { error: "Server configuration error for address autocomplete." },
        { status: 500 },
      );
    }

    try {
      const response = await axios.get(SMARTY_AUTOCOMPLETE_PRO_API_URL, {
        params: {
          key: authId,
          search: prefix,
          max_results: 10,
          "auth-id": authId,
          "auth-token": authToken,
        },
      });

      let suggestions = [];
      if (response.data && response.data.suggestions) {
        suggestions = response.data.suggestions.map((candidate: any) => {
          const lastLine = `${candidate.city}, ${candidate.state} ${candidate.zipcode}`;
          return {
            streetLine: candidate.street_line,
            secondary: candidate.secondary,
            city: candidate.city,
            state: candidate.state,
            zipcode: candidate.zipcode,
            lastLine: lastLine,
            fullAddress: `${candidate.street_line}${candidate.secondary ? " " + candidate.secondary : ""}, ${lastLine}`,
          };
        });
      }

      return json(suggestions);
    } catch (error: any) {
      console.error(
        "SmartyStreets API error:",
        error.response?.data || error.message,
      );
      return json(
        {
          error: "Failed to fetch address suggestions from SmartyStreets.",
          details: error.response?.data?.errors || String(error.message),
        },
        { status: error.response?.status || 500 },
      );
    }
  },
});
