import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Guard against the placeholder being passed into the DB query
  if (!id || id.startsWith("%")) {
    return NextResponse.json({ title: "Loading..." }, { status: 202 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("description")
    .eq("id", id)
    .single();

  if (error || !data) {
    // Return "Details" so the breadcrumb isn't empty, but use a 404 status
    return NextResponse.json({ title: "Details" }, { status: 404 });
  }

  return NextResponse.json(
    { title: data.description },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
