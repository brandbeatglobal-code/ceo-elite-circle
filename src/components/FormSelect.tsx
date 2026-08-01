"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { FieldSpec } from "@/lib/formSpec";

/**
 * A dropdown that looks like the rest of the form once it is open.
 *
 * A plain `<select>` is styled correctly while closed and then hands its open
 * state to the browser: white panel, system font, blue highlight. No CSS
 * reaches into that, so the one moment the control is actually being used is
 * the one moment it does not belong to the page.
 *
 * The CSS fix for exactly this — `appearance: base-select` with
 * `::picker(select)` — is the right answer and is not usable yet. Chrome and
 * Edge shipped it in 135; Safari has it in the 27 beta, not in a public
 * release; Firefox is still behind a flag. It is explicitly not Baseline, so
 * today it would leave every Firefox and current-Safari visitor looking at the
 * native panel — which is the bug. Revisit when Safari 27 ships and Firefox
 * follows: this whole file becomes about fifteen lines of CSS.
 *
 * **Progressive enhancement, so nothing a native select gives is lost.** The
 * server renders a real `<select>`, and it stays a real `<select>` until this
 * component has mounted — so with JavaScript off, or before hydration, the
 * field is the native control, fully operable, submitting under the same name.
 * Whatever was picked in that window is carried across on the swap.
 *
 * Once enhanced it is the APG select-only combobox: focus never leaves the
 * trigger, `aria-activedescendant` moves through the options, and the value
 * travels in a hidden input, so `formSpec` and the server action read exactly
 * the same name and value they read from the `<select>`.
 */
export function FormSelect({
  field,
  value,
  disabled,
}: {
  field: FieldSpec;
  /** What a refused submission handed back, or "" on a fresh form. */
  value: string;
  disabled: boolean;
}) {
  const label = field.required ? `${field.label} *` : field.label;
  // The empty row first, exactly as the `<select>` carried an empty leading
  // option: it is how a visitor un-answers an optional question.
  const options = useMemo(() => ["", ...(field.options ?? [])], [field.options]);

  const [enhanced, setEnhanced] = useState(false);
  const [selected, setSelected] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  /** Which way the panel opens, and how tall it may be. See `measure()`. */
  const [place, setPlace] = useState({ up: false, max: 240 });

  const nativeRef = useRef<HTMLSelectElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const typed = useRef({ buffer: "", at: 0 });

  const id = useId();
  const listId = `${id}-list`;
  const optionId = (i: number) => `${id}-opt-${i}`;

  // Swap to the enhanced control only after mount, carrying over anything
  // chosen in the native one before hydration finished.
  useEffect(() => {
    const picked = nativeRef.current?.value;
    if (picked) setSelected(picked);
    setEnhanced(true);
  }, []);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  const commit = useCallback(
    (i: number) => {
      setSelected(options[i] ?? "");
      close();
    },
    [options, close],
  );

  // Clicking away closes without choosing, the way a native picker does.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  // Keep the highlighted row in view when the arrow keys run past the edge.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`)
      ?.scrollIntoView({ block: "nearest" });
    // optionId is derived from `id`, which is stable for the component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active, id]);

  /**
   * Open downwards if there is room, upwards if there isn't.
   *
   * The nav is fixed at the top and the draft notice is fixed at the bottom,
   * so "the viewport" is not the space available — a panel that ignored them
   * would put its last options underneath a bar. Both are measured rather than
   * assumed, so removing the notice at launch needs no change here.
   */
  const measure = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    const gap = 8;
    const topBar = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const bottomBar = document.querySelector(".draft-banner")?.getBoundingClientRect().height ?? 0;
    const below = window.innerHeight - bottomBar - r.bottom - gap;
    const above = r.top - topBar - gap;
    // Roughly a row's height; only used to decide whether it would fit.
    const wanted = options.length * 40 + 2;
    const up = below < Math.min(wanted, 240) && above > below;
    setPlace({ up, max: Math.max(120, Math.min(wanted, up ? above : below)) });
  }, [options.length]);

  function openAt(i: number) {
    setActive(i);
    measure();
    setOpen(true);
  }

  // Anything that moves the field moves the room around it.
  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, measure]);

  /** Type a letter to jump, the way a native select does. */
  function jump(key: string, from: number) {
    const now = Date.now();
    typed.current.buffer = now - typed.current.at > 700 ? key : typed.current.buffer + key;
    typed.current.at = now;
    const needle = typed.current.buffer.toLowerCase();
    // Search from just after the current row, so repeating a letter cycles.
    const order = options.map((_, i) => (from + 1 + i) % options.length);
    const hit = order.find((i) => (options[i] || label).toLowerCase().startsWith(needle));
    return hit ?? -1;
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const last = options.length - 1;
    const current = Math.max(0, options.indexOf(selected));

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAt(current);
        return;
      }
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const hit = jump(e.key, current);
        if (hit >= 0) {
          e.preventDefault();
          openAt(hit);
        }
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        return;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        return;
      case "Home":
        e.preventDefault();
        setActive(0);
        return;
      case "End":
        e.preventDefault();
        setActive(last);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(active);
        return;
      case "Escape":
        e.preventDefault();
        close();
        return;
      case "Tab":
        // Native closes and keeps the highlighted row. Focus moves on by
        // itself, so this must not call close(), which would pull it back.
        setSelected(options[active] ?? "");
        setOpen(false);
        return;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          const hit = jump(e.key, active);
          if (hit >= 0) {
            e.preventDefault();
            setActive(hit);
          }
        }
    }
  }

  if (!enhanced) {
    return (
      <select
        ref={nativeRef}
        name={field.label}
        className="field"
        aria-label={label}
        required={field.required}
        disabled={disabled}
        defaultValue={options.includes(value) ? value : ""}
      >
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o || field.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div ref={wrapRef} className="select-wrap">
      {/* What the form actually submits — same name, same value, so nothing
          downstream of here can tell the difference. */}
      <input type="hidden" name={field.label} value={selected} />

      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-label={label}
        disabled={disabled}
        className={`field select-trigger ${selected ? "" : "is-empty"}`}
        onClick={() => (open ? close(false) : openAt(Math.max(0, options.indexOf(selected))))}
        onKeyDown={onKeyDown}
      >
        <span>{selected || field.label}</span>
        <svg
          className="select-chevron"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className={`select-panel${place.up ? " is-up" : ""}`}
          style={{ maxHeight: place.max }}
        >
          {options.map((o, i) => (
            <li
              key={i}
              id={optionId(i)}
              role="option"
              aria-selected={o === selected}
              className={`select-option${i === active ? " is-active" : ""}${
                o === selected ? " is-selected" : ""
              }${o ? "" : " is-empty"}`}
              // pointerdown, not click: the trigger keeps focus, and a click
              // would land after the outside-press handler has already closed.
              onPointerDown={(e) => {
                e.preventDefault();
                commit(i);
              }}
              onPointerEnter={() => setActive(i)}
            >
              <span aria-hidden="true" className="select-mark">
                {o === selected ? "•" : ""}
              </span>
              {o || field.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
