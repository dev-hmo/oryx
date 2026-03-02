import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt, getSessionCookieName } from "@/lib/auth";

const COOKIE_NAME = getSessionCookieName();

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only guard /admin routes (not /admin/login itself)
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        const token = request.cookies.get(COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Verify JWT integrity (military-grade: any tampering = reject)
        const payload = await verifyJwt(token);
        if (!payload) {
            const response = NextResponse.redirect(new URL("/admin/login", request.url));
            // Clear the invalid/expired cookie
            response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
            return response;
        }

        // Inject user context into headers for server components
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload.sub);
        requestHeaders.set("x-user-role", payload.role);
        requestHeaders.set("x-username", payload.username);
        requestHeaders.set("x-display-name", payload.displayName);

        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
