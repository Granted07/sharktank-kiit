import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../lib/supabase";

type ResolveZoneRequest = {
  beaconId?: string;
};

type ZoneRecord = {
  name: string | null;
};

export async function POST(request: Request) {
  let payload: ResolveZoneRequest;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const beaconId = payload?.beaconId?.trim();
  if (!beaconId) {
    return NextResponse.json(
      { error: "beaconId is required" },
    )
  }
  else {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("zones")
      .select("name")
      .eq("ble_beacon_id", beaconId)
      .maybeSingle<ZoneRecord>();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ zone: data?.name ?? null });
  }
}
