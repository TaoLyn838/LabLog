import { NextRequest, NextResponse } from "next/server";
import {z} from 'zod'
import { supabaseServer } from "@/lib/supabase-server";

function getToken(req: NextRequest) {
    // get header
    const authHeader = req.headers.get("authorization")

    if (!authHeader?.startsWith('Bearer ')) return null

    // get token
    const t = authHeader.slice('Bearer'.length).trim() 
    return t.length ? t : null
}

export async function GET(req: NextRequest) {
    const token = getToken(req)
    if (!token) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const supabase = supabaseServer(token)

    // confirm user exists
    const {data: userData, error: userErr} = await supabase.auth.getUser()
    if (userErr || !userData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: projects, error } = await supabase
        .from('projects')
        .select('id, name, created_at')
        .order('created_at', {ascending: false})

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ projects }, { status: 200 })
}

const CreateProjectSchema = z.object({
    name: z.string().min(1).max(100)
})

export async function POST(req: NextRequest) {
    const token = getToken(req)
    if (!token) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const supabase = supabaseServer(token)

    // const body = await req.json().catch(() => null)
    let body: any = null // use let to re-assign variable from null to req 
    try {
        body = await req.json()
    } catch (err) {
        body = null
    }

    const parsed = CreateProjectSchema.safeParse(body)
    if(!parsed.success) {
        return NextResponse.json({error: 'Invalid body', details: parsed.error.flatten()}, {status: 422})
    }

    // Insert project: rely on either
    //  - DEFAULT owner_id = auth.uid() in schema, or
    //  - RLS WITH CHECK (owner_id = auth.uid())

    const { data, error } = await supabase
        .from('projects')
        .insert([{name: parsed.data.name}])
        .select('id, name, created_at')
        .single()


    if (error) {
        const isConflict = (error.code === '23505') // unique_violation
        return NextResponse.json({error: error.message}, {status: isConflict ? 409 : 400})
    }
    return NextResponse.json({ project: data}, {status: 201})
}