import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    // console.log("token : ", token)
    const url = request.nextUrl
    if (token &&
        (
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/verify')  
            // url.pathname.startsWith('/') //DANGER: never include '/' route. causes infinite re-renders.because this condition includes '/' which also includes '/dashboard'.

        )
    ) {

        return NextResponse.redirect(new URL('/profile', request.url))
    }
    if (!token && 
        (
            url.pathname.startsWith('/profile') || 
            url.pathname.startsWith('/messages') ||
            url.pathname.startsWith('/feed')
        )) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // return NextResponse.redirect(new URL('/home', request.url))
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/profile',
        '/verify/:path*',
        '/messages',
        '/feed'
    ]
}