import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Later: Save to S3, Supabase, or database
  return NextResponse.json({
    name: file.name,
    size: file.size,
    type: file.type,
  });
}