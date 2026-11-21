const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sacrament Meetings API",
            version: "1.0.0",
            description: "API for sacrament meeting agendas.",
        },
        servers: [{ url: "/", description: "Current server" }],
        components: {
            schemas: {
                Hymn: {
                    type: "object",
                    required: ["number", "title"],
                    properties: {
                        number: { type: "integer" },
                        title: { type: "string" },
                    },
                },
                SpeakerItem: {
                    type: "object",
                    required: ["name", "topic", "type"],
                    properties: {
                        name: { type: "string" },
                        topic: { type: "string" },
                        type: { type: "string", enum: ["speaker", "musical-number"] },
                    },
                },
                WardBusinessItem: {
                    type: "object",
                    required: ["description"],
                    properties: {
                        description: { type: "string" },
                    },
                },
                SacramentMeeting: {
                    type: "object",
                    required: [
                        "id", "date", "meeting_type", "presiding", "conducting",
                        "opening_hymn", "opening_prayer", "ward_business",
                        "stake_business", "sacrament_hymn", "speakers",
                        "closing_hymn", "closing_prayer",
                    ],
                    properties: {
                        id: { type: "integer" },
                        date: { type: "string", format: "date" },
                        meeting_type: {
                            type: "string",
                            enum: ["testimony", "regular", "stake", "general"],
                        },
                        presiding: { type: "string" },
                        conducting: { type: "string" },
                        announcements: { type: "array", items: { type: "string" } },
                        opening_hymn: { $ref: "#/components/schemas/Hymn" },
                        opening_prayer: { type: "string" },
                        ward_business: {
                            type: "array",
                            items: { $ref: "#/components/schemas/WardBusinessItem" },
                        },
                        stake_business: { type: "boolean" },
                        sacrament_hymn: { $ref: "#/components/schemas/Hymn" },
                        speakers: {
                            type: "array",
                            items: { $ref: "#/components/schemas/SpeakerItem" },
                        },
                        closing_hymn: { $ref: "#/components/schemas/Hymn" },
                        closing_prayer: { type: "string" },
                    },
                },
                MeetingInput: {
                    type: "object",
                    required: [
                        "date", "meeting_type", "presiding", "conducting",
                        "opening_hymn", "opening_prayer", "ward_business",
                        "stake_business", "sacrament_hymn", "speakers",
                        "closing_hymn", "closing_prayer",
                    ],
                    properties: {
                        date: { type: "string", format: "date" },
                        meeting_type: {
                            type: "string",
                            enum: ["testimony", "regular", "stake", "general"],
                        },
                        presiding: { type: "string", minLength: 1, maxLength: 255 },
                        conducting: { type: "string", minLength: 1, maxLength: 255 },
                        announcements: {
                            type: "array",
                            items: { type: "string" },
                        },
                        opening_hymn: { $ref: "#/components/schemas/Hymn" },
                        opening_prayer: { type: "string", minLength: 1, maxLength: 255 },
                        ward_business: {
                            type: "array",
                            items: { $ref: "#/components/schemas/WardBusinessItem" },
                        },
                        stake_business: { type: "boolean" },
                        sacrament_hymn: { $ref: "#/components/schemas/Hymn" },
                        speakers: {
                            type: "array",
                            items: { $ref: "#/components/schemas/SpeakerItem" },
                        },
                        closing_hymn: { $ref: "#/components/schemas/Hymn" },
                        closing_prayer: { type: "string", minLength: 1, maxLength: 255 },
                    },
                },
                ApiFieldError: {
                    type: "object",
                    required: ["field", "message"],
                    properties: {
                        field: { type: "string" },
                        message: { type: "string" },
                    },
                },
                ApiResponseError: {
                    type: "object",
                    required: ["code", "message"],
                    properties: {
                        code: { type: "string" },
                        message: { type: "string" },
                        fieldErrors: {
                            type: "array",
                            items: { $ref: "#/components/schemas/ApiFieldError" },
                        },
                    },
                },
                ApiErrorResponse: {
                    type: "object",
                    required: ["statusCode", "message", "data", "errors"],
                    properties: {
                        statusCode: { type: "integer" },
                        message: { type: "string" },
                        data: { type: "object", nullable: true },
                        errors: {
                            type: "array",
                            minItems: 1,
                            items: { $ref: "#/components/schemas/ApiResponseError" },
                        },
                    },
                },
                MeetingResponse: {
                    type: "object",
                    required: ["statusCode", "message", "data", "errors"],
                    properties: {
                        statusCode: { type: "integer" },
                        message: { type: "string" },
                        data: {
                            allOf: [
                                { $ref: "#/components/schemas/SacramentMeeting" },
                            ],
                        },
                        errors: {
                            type: "array",
                            nullable: true,
                            items: { $ref: "#/components/schemas/ApiResponseError" },
                        },
                    },
                },
                PaginatedMeetings: {
                    type: "object",
                    required: ["statusCode", "message", "data", "errors"],
                    properties: {
                        statusCode: { type: "integer" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            required: ["meetings", "query", "sort", "pagination"],
                            properties: {
                                meetings: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/SacramentMeeting" },
                                },
                                query: {
                                    type: "object",
                                    description: "Search filter applied to the meeting list, or an empty object when no search was provided.",
                                    properties: { query: { type: "string" } },
                                },
                                sort: {
                                    type: "object",
                                    description: "Meetings are ordered by date, newest first.",
                                    required: ["field", "order"],
                                    properties: {
                                        field: { type: "string", enum: ["date"] },
                                        order: { type: "string", enum: ["desc"] },
                                    },
                                },
                                pagination: {
                                    type: "object",
                                    required: ["page", "limit", "totalItems", "startItem", "endItem", "totalPages", "hasNextPage", "hasPreviousPage", "totalMeetings"],
                                    properties: {
                                        page: { type: "integer", minimum: 1 },
                                        limit: { type: "integer", minimum: 1, maximum: 50 },
                                        totalItems: { type: "integer", minimum: 0, description: "Number of meetings matching the search." },
                                        startItem: { type: "integer", minimum: 0, example: 1, description: "Position of the first meeting on this page, or 0 if the page is empty." },
                                        endItem: { type: "integer", minimum: 0, example: 6, description: "Position of the last meeting on this page, or 0 if the page is empty." },
                                        totalPages: { type: "integer", minimum: 0 },
                                        hasNextPage: { type: "boolean" },
                                        hasPreviousPage: { type: "boolean" },
                                        totalMeetings: { type: "integer", minimum: 0, description: "Total number of meetings, before search filtering." },
                                    },
                                },
                            },
                        },
                        errors: {
                            type: "array",
                            nullable: true,
                            items: { $ref: "#/components/schemas/ApiResponseError" },
                        },
                    },
                },
                MeetingByDate: {
                    type: "object",
                    required: ["statusCode", "message", "data", "errors"],
                    properties: {
                        statusCode: { type: "integer" },
                        message: { type: "string" },
                        data: {
                            allOf: [
                                { $ref: "#/components/schemas/SacramentMeeting" },
                            ],
                        },
                        errors: {
                            type: "array",
                            nullable: true,
                            items: { $ref: "#/components/schemas/ApiResponseError" },
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/app/api/**/route.ts"],
    failOnErrors: true,
};

async function generateDocumentation() {
    const { writeFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { default: swaggerJsdoc } = await import("swagger-jsdoc");

    process.chdir(__dirname);
    const spec = swaggerJsdoc(options);
    writeFileSync(join(__dirname, "public", "swagger.json"), `${JSON.stringify(spec, null, 2)}\n`);
    console.log("Swagger documentation generated at public/swagger.json.");
}

generateDocumentation().catch((error) => {
    console.error("Failed to generate Swagger documentation:", error);
    process.exitCode = 1;
});
