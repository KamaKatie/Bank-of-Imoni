import { createClient } from "@/lib/supabase/server"; 
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params; 
  
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("description")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ title: "Details" });
  }
 
  return NextResponse.json({ title: data.description });
}