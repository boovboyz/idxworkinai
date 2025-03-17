import { NextResponse } from "next/server"
import { supabase, type Resource } from "@/lib/supabase"
import { v4 as uuidv4 } from 'uuid'

// This would be a real database in a production app
const resources = new Map()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId") || "anonymous"
    const courseId = searchParams.get("courseId")

    if (id) {
      // Get a specific resource
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error("Error fetching resource:", error)
        return NextResponse.json({ error: "Resource not found" }, { status: 404 })
      }

      return NextResponse.json(data)
    } else {
      // Get all resources for a user, optionally filtered by course
      let query = supabase
        .from('resources')
        .select('*')
        .eq('user_id', userId)

      if (courseId) {
        // Filter by course ID (this assumes course_ids is an array)
        query = query.contains('course_ids', [courseId])
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching resources:", error)
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Error in resource retrieval:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, type, content, size, userId = "anonymous", courseIds = [] } = await req.json()

    if (!name || !type || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newResource: Partial<Resource> = {
      id: uuidv4(),
      name,
      type,
      content,
      size,
      user_id: userId,
      course_ids: courseIds,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('resources')
      .insert(newResource)
      .select()
      .single()

    if (error) {
      console.error("Error creating resource:", error)
      return NextResponse.json({ error: "Failed to create resource" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in resource creation:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, courseIds } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 })
    }

    const updates: Partial<Resource> = {}
    if (name) updates.name = name
    if (courseIds) updates.course_ids = courseIds

    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error("Error updating resource:", error)
      return NextResponse.json({ error: "Failed to update resource" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in resource update:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Error deleting resource:", error)
      return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in resource deletion:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

