import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../../../lib/supabase";

type ProductLocation = {
  name: string;
  shelf: {
    code: string;
    human_direction: string | null;
    aisle: {
      label: string;
      zone: {
        name: string;
      } | null;
    } | null;
  } | null;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `name,
       shelf:shelf_id (
         code,
         human_direction,
         aisle:aisle_id (
           label,
           zone:zone_id (
             name
           )
         )
       )`
    )
    .eq("id", id)
    .maybeSingle<ProductLocation>();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json(
      { error: error.message ?? "Failed to load product location" },
      { status: 500 },
    );
  }

  if (!data || !data.shelf || !data.shelf.aisle || !data.shelf.aisle.zone) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 },
    );
  }

  const response = {
    product: data.name,
    zone: data.shelf.aisle.zone.name,
    aisle: data.shelf.aisle.label,
    shelf: data.shelf.code,
    directions: data.shelf.human_direction,
  };

  return NextResponse.json(response);
}
