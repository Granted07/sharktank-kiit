"use client";

import { useState } from "react";

type MinimalBluetoothDevice = { id?: string | null };
type MinimalRequestDeviceOptions = {
  filters?: Array<{ services?: unknown[] }>;
  optionalServices?: unknown[];
  acceptAllDevices?: boolean;
};

type NavigatorWithBluetooth = Navigator & {
  bluetooth?: {
    requestDevice(options: MinimalRequestDeviceOptions): Promise<MinimalBluetoothDevice>;
  };
};

async function resolveZone(beaconId: string): Promise<string | null> {
  const response = await fetch("/api/resolve-zone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ beaconId }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { zone: string | null };
  return payload.zone;
}

function getWebBluetooth(): NavigatorWithBluetooth["bluetooth"] | null {
  if (typeof navigator === "undefined") {
    return null;
  }

  const nav = navigator as NavigatorWithBluetooth;
  return nav.bluetooth ?? null;
}

function isWebBluetoothSupported() {
  return getWebBluetooth() !== null;
}

type ProximityState =
  | { status: "idle"; zone: null }
  | { status: "scanning"; zone: null }
  | { status: "success"; zone: string }
  | { status: "unsupported"; zone: null }
  | { status: "error"; zone: null };

// Optional BLE helper that suggests the nearest zone when the user opts in.
export function ProximityAssistance() {
  const [state, setState] = useState<ProximityState>({ status: "idle", zone: null });

  async function handleScan() {
    if (!isWebBluetoothSupported()) {
      setState({ status: "unsupported", zone: null });
      return;
    }

    try {
      setState({ status: "scanning", zone: null });

      const bluetooth = getWebBluetooth();
      if (!bluetooth) {
        setState({ status: "unsupported", zone: null });
        return;
      }

      const device = await bluetooth.requestDevice({
        filters: [{ services: [] }],
        optionalServices: [],
        acceptAllDevices: true,
      });

      const beaconId = device.id;
      if (!beaconId) {
        setState({ status: "error", zone: null });
        return;
      }

      const zone = await resolveZone(beaconId);
      if (zone) {
        setState({ status: "success", zone });
      } else {
        setState({ status: "error", zone: null });
      }
    } catch (error) {
      console.warn("BLE scan failed", error);
      setState({ status: "error", zone: null });
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Optional proximity assist
        </p>
        <h2 className="text-lg font-semibold text-slate-100">
          Give BLE a try (demo only)
        </h2>
        <p className="text-xs text-slate-500">
          Uses Bluetooth proximity hints. Accuracy may vary. Works best on Android Chrome.
        </p>
      </header>

      <button
        type="button"
        onClick={handleScan}
        disabled={state.status === "scanning"}
        className="inline-flex items-center justify-center rounded-full border border-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 disabled:cursor-wait disabled:border-slate-700 disabled:text-slate-500"
      >
        {state.status === "scanning" ? "Scanning..." : "Enable Proximity Assistance"}
      </button>

      <div className="text-xs text-slate-400">
        {state.status === "success" && state.zone ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400 bg-emerald-500/10 px-3 py-1 text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            You appear to be near: <strong className="text-emerald-100">{state.zone}</strong>
          </span>
        ) : state.status === "unsupported" ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-slate-400">
            Browser does not support Web Bluetooth. You can still use shelf directions manually.
          </span>
        ) : state.status === "error" ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400 bg-amber-500/10 px-3 py-1 text-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            Proximity assistance unavailable. Manual guidance remains accurate.
          </span>
        ) : (
          <span>
            Proximity hints are optional. Even without them, shelf directions stay deterministic and reliable.
          </span>
        )}
      </div>
    </div>
  );
}
