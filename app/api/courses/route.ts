import { NextResponse } from "next/server";
import { supabase, type Course } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

// Handle course creation
export async function POST(req: Request) {
  try {
    const { name, description, color, userId = "anonymous" } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Course name is required" }, { status: 400 });
    }

    const newCourse: Partial<Course> = {
      id: uuidv4(),
      name,
      description: description || "",
      color: color || "#3b82f6", // Default blue color
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('courses')
      .insert(newCourse)
      .select()
      .single();

    if (error) {
      console.error("Error creating course:", error);
      return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in course creation:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// Handle course retrieval
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId") || "anonymous";

    if (id) {
      // Get a specific course
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching course:", error);
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      return NextResponse.json(data);
    } else {
      // Get all courses for a user
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error in course retrieval:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// Handle course updates
export async function PUT(req: Request) {
  try {
    const { id, name, description, color } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const updates: Partial<Course> = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (color) updates.color = color;

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating course:", error);
      return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in course update:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// Handle course deletion
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // First, update resources to remove this course from course_ids
    const { data: resources } = await supabase
      .from('resources')
      .select('id, course_ids')
      .contains('course_ids', [id]);

    if (resources && resources.length > 0) {
      // For each resource that contains this course, update its course_ids
      for (const resource of resources) {
        const updatedCourseIds = resource.course_ids.filter((courseId: string) => courseId !== id);
        
        await supabase
          .from('resources')
          .update({ course_ids: updatedCourseIds })
          .eq('id', resource.id);
      }
    }

    // Now delete the course
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting course:", error);
      return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in course deletion:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
} 