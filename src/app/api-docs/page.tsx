"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import swaggerSpec from "../../../public/swagger.json";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
    ssr: false,
    loading: () => <p role="status">Loading API documentation...</p>,
});

export default function ApiDocsPage() {
    return (
        <div className="rounded-xl bg-white p-4 text-slate-900 [color-scheme:light] sm:p-6">
            <SwaggerUI spec={swaggerSpec} />
        </div>
    );
}
