"use client";

import { useSyncExternalStore } from "react";

/**
 * Client-side cart.
 *
 * Deliberately a placeholder: lines live in localStorage so the UI feels real
 * before there is a database. When carts move server-side they become rows
 * keyed by the Better Auth user id (or a guest cart cookie), and this module
 * turns into a thin wrapper over Server Actions — the `useCart()` shape below
 * is the part worth keeping stable.
 *
 * Only the slug and quantity are stored. Prices are always re-read from the
 * catalog on render, so a stale cart can never quote a stale price.
 *
 * Implemented as an external store rather than state-in-an-effect: localStorage
 * *is* an external system, so useSyncExternalStore is the hook that fits. It
 * also gets hydration right for free — React renders the server snapshot while
 * hydrating, then swaps to the real one.
 */

export type CartLine = { slug: string; qty: number };

type CartState = {
  lines: CartLine[];
  /** False until localStorage has been read, so server and client agree. */
  hydrated: boolean;
};

const STORAGE_KEY = "northwind.cart.v1";
const MAX_QTY = 99;

/** Frozen and reused: getServerSnapshot must return a stable reference. */
const SERVER_STATE: CartState = { lines: [], hydrated: false };

let state: CartState = SERVER_STATE;
const listeners = new Set<() => void>();

function readStored(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as CartLine).slug === "string" &&
        typeof (line as CartLine).qty === "number",
    );
  } catch {
    // Private browsing, blocked storage, or corrupt JSON — an empty cart is a
    // fine answer in all three cases.
    return [];
  }
}

function persist(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage unavailable; the cart simply will not survive a reload.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function setLines(next: CartLine[]) {
  state = { lines: next, hydrated: true };
  persist(next);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep two tabs of the same shop in step.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    state = { lines: readStored(), hydrated: true };
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartState {
  // First client read loads from storage; after that the reference is stable
  // until a mutation replaces it, which is what useSyncExternalStore needs.
  if (!state.hydrated) state = { lines: readStored(), hydrated: true };
  return state;
}

function getServerSnapshot(): CartState {
  return SERVER_STATE;
}

export function add(slug: string, qty = 1) {
  const existing = state.lines.find((line) => line.slug === slug);
  if (!existing) {
    setLines([...state.lines, { slug, qty: Math.min(qty, MAX_QTY) }]);
    return;
  }
  setLines(
    state.lines.map((line) =>
      line.slug === slug ? { ...line, qty: Math.min(line.qty + qty, MAX_QTY) } : line,
    ),
  );
}

export function setQty(slug: string, qty: number) {
  setLines(
    qty <= 0
      ? state.lines.filter((line) => line.slug !== slug)
      : state.lines.map((line) =>
          line.slug === slug ? { ...line, qty: Math.min(qty, MAX_QTY) } : line,
        ),
  );
}

export function remove(slug: string) {
  setLines(state.lines.filter((line) => line.slug !== slug));
}

export function clear() {
  setLines([]);
}

export function useCart() {
  const { lines, hydrated } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    lines,
    hydrated,
    itemCount: lines.reduce((total, line) => total + line.qty, 0),
    add,
    setQty,
    remove,
    clear,
  };
}
