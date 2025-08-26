import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
    // read header
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({error: 'Missing Authorization header'}, {status: 401})
    }
    
    // Extract token
    const token = authHeader.slice('Bearer '.length).trim()
    if (!token) {
        return NextResponse.json({error: 'Invalid token'}, {status: 401})
    }

    // Create user-scoped Supabase client
    const supabase = supabaseServer(token)

    // Validate user (reads JWT; if bad/expired ⇒ null)
    const {data, error} = await supabase.auth.getUser()
    if (error || !data.user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // 5) Return user id and email
    return NextResponse.json({userId: data.user.id, email: data.user.email})
}