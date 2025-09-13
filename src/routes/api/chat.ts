import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import OpenAI from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const blueprint = {
  buildingType: "Studio ADU",
  architecturalStyles: [
    {
      name: "Spanish",
      referenceCode: "3 A1-201",
    },
    {
      name: "Craftsman",
      referenceCode: "3 A1-202",
    },
    {
      name: "Ranch",
      referenceCode: "3 A1-203",
    },
    {
      name: "Modern",
      referenceCode: "3 A1-204",
    },
  ],
  featuredStyle: "Spanish Option",
  mainDimensions: {
    totalWidth: "16'-0\"",
    totalDepth: "14'-0\"",
    rightSideDepth: "12'-0\"",
  },
  rooms: [
    {
      name: "Studio",
      width: "11'-4\"",
      depth: "7'-1\"",
      maxHeight: "7'-3/4\" MAX",
    },
    {
      name: "Kitchen",
      width: "8'-0\"",
      depth: "5'-3\"",
    },
    {
      name: "Bathroom",
      width: "5'-0\"",
      depth: "3'-1\"",
    },
    {
      name: "Covered Porch",
      width: "8'-0\"",
      depth: "5'-0\"",
    },
  ],
  fixtures: {
    bathroom: [
      {
        code: "F23",
        likelyType: "Sink/Vanity",
      },
      {
        code: "F22",
        likelyType: "Toilet",
      },
      {
        code: "B05",
        likelyType: "Bathtub/Shower",
      },
      {
        code: "B47",
        likelyType: "Medicine Cabinet/Storage",
      },
    ],
    kitchen: [
      {
        code: "S02",
        likelyType: "Sink",
      },
      {
        code: "A07",
        likelyType: "Refrigerator",
      },
      {
        code: "C08",
        likelyType: "Cabinet/Counter",
      },
      {
        code: "A14",
        likelyType: "Appliance",
      },
      {
        code: "A12",
        likelyType: "Appliance",
      },
      {
        code: "A10",
        likelyType: "Appliance",
      },
    ],
  },
  doors: [
    {
      code: "D1",
      location: "Main entry",
    },
    {
      code: "D2",
      location: "Studio to exterior",
    },
    {
      code: "D3",
      location: "Bathroom entry",
    },
  ],
  keyMeasurements: [
    {
      description: "Distance between edge and window",
      measurement: "4'-8\"",
    },
    {
      description: "Distance between window and opposite edge",
      measurement: "11'-4\"",
    },
    {
      description: "Distance between middle of main window and edge of porch",
      measurement: "4'-6\"",
    },
    {
      description:
        "Distance between middle of main window and other edge of porch",
      measurement: "7'-6\"",
    },
    {
      description: "Distance between wall and middle of door",
      measurement: "2'-0\"",
    },
  ],
};

export const ServerRoute = createServerFileRoute("/api/chat").methods({
  POST: async ({ request }) => {
    try {
      const { messages: userMessages } = await request.json();

      const openAIMessages = [
        {
          role: "system",
          content: `You are Cody. You know everything about the user's permit applications. The ones that are pending and are complete. Your task is to answer questions related to them. For all questions, answer only what is required and no more. Here is your context: 
          You are working with the following AHJs: Goodyear, AZ; Sterling, VA; West Jordan, UT; Rancho Cucamonga, CA. 
          You need to submit structural reports for all current projects. When asked about a specific project, say that you need it. 
          Blueprint of the ADU floorplan: ${JSON.stringify(blueprint)}`,
        },
        ...userMessages,
      ];

      const openaiStream = await client.chat.completions.create({
        model: "gpt-4o",
        messages:
          openAIMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        stream: true,
      });

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for await (const chunk of openaiStream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8", // Or "text/plain; charset=utf-8" if preferred for simpler client handling
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (error) {
      console.error("[API /api/chat ERROR]:", error);
      const errorResponse = {
        error: "Failed to process chat request.",
        details: error instanceof Error ? error.message : String(error),
      };
      return json(errorResponse, { status: 500 });
    }
  },
});
