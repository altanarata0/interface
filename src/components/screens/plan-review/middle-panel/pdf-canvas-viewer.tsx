import { useAppStore } from "@/providers/app-store-provider";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Hand,
  Square,
  Highlighter,
  Shapes,
  PenLine,
  MessageSquare,
  RotateCcw,
  RotateCw,
  Palette,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Using dropdown menus for color/thickness to avoid extra deps
import { cn } from "@/lib/utils";
import * as pdfjsLib from "pdfjs-dist";

interface XFDFRect {
  id: string;
  page: number; // 1-based
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  type: "rectangle" | "highlight";
}

interface XFDFPolygon {
  id: string;
  page: number; // 1-based
  vertices: Array<{ x: number; y: number }>;
  color: string;
  width?: number;
  type: "polygon";
}

interface XFDFInk {
  id: string;
  page: number; // 1-based
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
  type: "ink";
}

interface XFDFAttachNote {
  id: string;
  page: number; // 1-based
  x: number;
  y: number;
  color: string;
  contents: string;
  type: "note";
}

export const PDFCanvasViewer = () => {
  const {
    selectedFileId,
    getFileById,
    selectedProjectId,
    selectedRegulationId,
    getRegulationById,
    updateRegulationById,
  } = useAppStore((s) => s);

  // Configure pdf.js worker on the client to avoid SSR errors
  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        (pdfjsLib as any)?.GlobalWorkerOptions
      ) {
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
          "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
      }
    } catch {
      // no-op; fallback to default worker behavior
    }
  }, []);

  const file = useMemo(
    () => getFileById(selectedFileId ?? ""),
    [getFileById, selectedFileId]
  );
  const selectedRegulation = useMemo(
    () => getRegulationById(selectedRegulationId ?? ""),
    [getRegulationById, selectedRegulationId]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(0.7);
  const scaleRef = useRef(scale);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  const [currentPage, setCurrentPage] = useState(1);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const pageContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visiblePagesRef = useRef<Set<number>>(new Set());
  const [rects, setRects] = useState<XFDFRect[]>([]);
  const [polys, setPolys] = useState<XFDFPolygon[]>([]);
  const [inks, setInks] = useState<XFDFInk[]>([]);
  const [notes, setNotes] = useState<XFDFAttachNote[]>([]);
  const viewportsRef = useRef<Record<number, any>>({});

  // Annotation toolbar state (UI only for now)
  const [tool, setTool] = useState<
    "hand" | "rect" | "highlight" | "poly" | "pen" | "note"
  >("hand");
  const [strokeColor, setStrokeColor] = useState<string>("#E44234");
  const [thickness, setThickness] = useState<number>(3);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Undo/Redo history for annotations
  type AnnotationState = {
    rects: XFDFRect[];
    polys: XFDFPolygon[];
    inks: XFDFInk[];
    notes: XFDFAttachNote[];
  };
  const historyRef = useRef<AnnotationState[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const HISTORY_LIMIT = 200;

  const cloneState = (s: AnnotationState): AnnotationState => ({
    rects: s.rects.map((x) => ({ ...x })),
    polys: s.polys.map((x) => ({
      ...x,
      vertices: x.vertices.map((v) => ({ ...v })),
    })),
    inks: s.inks.map((x) => ({
      ...x,
      points: x.points.map((p) => ({ ...p })),
    })),
    notes: s.notes.map((x) => ({ ...x })),
  });

  const setFromState = (s: AnnotationState) => {
    setRects(s.rects);
    setPolys(s.polys);
    setInks(s.inks);
    setNotes(s.notes);
  };

  const updateUndoRedoFlags = () => {
    const idx = historyIndexRef.current;
    const len = historyRef.current.length;
    setCanUndo(idx > 0);
    setCanRedo(idx >= 0 && idx < len - 1);
  };

  const resetHistory = (initial: AnnotationState) => {
    historyRef.current = [cloneState(initial)];
    historyIndexRef.current = 0;
    updateUndoRedoFlags();
  };

  const pushHistory = (next: AnnotationState) => {
    // Drop forward history if any
    const idx = historyIndexRef.current;
    let arr = historyRef.current.slice(0, idx + 1);
    arr.push(cloneState(next));
    if (arr.length > HISTORY_LIMIT) arr = arr.slice(arr.length - HISTORY_LIMIT);
    historyRef.current = arr;
    historyIndexRef.current = arr.length - 1;
    updateUndoRedoFlags();
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const s = historyRef.current[historyIndexRef.current];
    if (s) setFromState(s);
    updateUndoRedoFlags();
  };

  const redo = () => {
    const len = historyRef.current.length;
    if (historyIndexRef.current >= len - 1) return;
    historyIndexRef.current += 1;
    const s = historyRef.current[historyIndexRef.current];
    if (s) setFromState(s);
    updateUndoRedoFlags();
  };

  // Hand/pan state handled at container level to avoid per-page flicker
  const [isPanning, setIsPanning] = useState(false);
  const panOriginRef = useRef<{
    startClientX: number;
    startClientY: number;
    startScrollLeft: number;
    startScrollTop: number;
  } | null>(null);

  // Pinch-to-zoom state
  const pinchRef = useRef<{
    startDist: number;
    startScale: number;
    active: boolean;
  }>({ startDist: 0, startScale: 1, active: false });
  const activeTouchCountRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pendingScaleRef = useRef<number | null>(null);

  const clampScale = (v: number) => Math.max(0.3, Math.min(3, v));
  // Tunables for zoom responsiveness
  const WHEEL_ZOOM_K = 0.008; // higher = faster for trackpad pinch
  const TOUCH_ZOOM_EXP = 2.2; // >1 speeds up pinch curve
  const commitScale = (
    next: number,
    focal?: { clientX: number; clientY: number }
  ) => {
    const base = scaleRef.current || 1;
    const clamped = clampScale(next);
    const factor = clamped / base;
    pendingScaleRef.current = clamped;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const sc = containerRef.current;
        if (pendingScaleRef.current != null) {
          setScale(pendingScaleRef.current);
        }
        // Best-effort keep focal point anchored by adjusting scroll
        if (sc && focal && Number.isFinite(factor) && factor > 0) {
          const rect = sc.getBoundingClientRect();
          const cx = focal.clientX - rect.left + sc.scrollLeft;
          const cy = focal.clientY - rect.top + sc.scrollTop;
          const targetLeft = cx * factor - (focal.clientX - rect.left);
          const targetTop = cy * factor - (focal.clientY - rect.top);
          // Clamp to non-negative; max will be naturally clamped by browser
          sc.scrollLeft = Math.max(0, targetLeft);
          sc.scrollTop = Math.max(0, targetTop);
        }
      });
    }
  };

  const onContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Avoid starting pan if multi-touch gesture is active
    if (activeTouchCountRef.current >= 2) return;
    if (tool !== "hand") return;
    const sc = containerRef.current;
    if (!sc) return;
    panOriginRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startScrollLeft: sc.scrollLeft,
      startScrollTop: sc.scrollTop,
    };
    setIsPanning(true);
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    } catch {}
    e.preventDefault();
  };

  const onContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTouchCountRef.current >= 2) return;
    if (!isPanning || !panOriginRef.current) return;
    const sc = containerRef.current;
    if (!sc) return;
    const dx = e.clientX - panOriginRef.current.startClientX;
    const dy = e.clientY - panOriginRef.current.startClientY;
    sc.scrollLeft = panOriginRef.current.startScrollLeft - dx;
    sc.scrollTop = panOriginRef.current.startScrollTop - dy;
    e.preventDefault();
  };

  const onContainerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setIsPanning(false);
    panOriginRef.current = null;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture?.(e.pointerId);
    } catch {}
    e.preventDefault();
  };

  const handleSaveXFDF = () => {
    if (!selectedRegulationId) return;
    const esc = (s: string) =>
      s
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

    const rectToAttr = (r: XFDFRect) => `${r.x1},${r.y1},${r.x2},${r.y2}`;

    const rectsXml = rects
      .map((r) => {
        const tag = r.type === "highlight" ? "highlight" : "square";
        const w = r.width ?? thickness;
        return `<${tag} page="${r.page - 1}" color="${
          r.color
        }" width="${w}" rect="${rectToAttr(r)}" />`;
      })
      .join("");

    const polysXml = polys
      .map((p) => {
        const verts = p.vertices.map((v) => `${v.x},${v.y}`).join("; ");
        const w = p.width ?? thickness;
        return `<polygon page="${p.page - 1}" color="${
          p.color
        }" width="${w}"><vertices>${verts}</vertices></polygon>`;
      })
      .join("");

    const inksXml = inks
      .map((i) => {
        const verts = i.points.map((pt) => `${pt.x},${pt.y}`).join("; ");
        return `<ink page="${i.page - 1}" color="${i.color}" width="${
          i.width
        }"><vertices>${verts}</vertices></ink>`;
      })
      .join("");

    const notesXml = notes
      .map(
        (n) =>
          `<text page="${n.page - 1}" color="${n.color}" x="${n.x}" y="${
            n.y
          }" contents="${esc(n.contents || "")}" />`
      )
      .join("");

    const xml =
      `<?xml version=\"1.0\" encoding=\"UTF-8\" ?>` +
      `<xfdf xmlns=\"http://ns.adobe.com/xfdf/\" xml:space=\"preserve\">` +
      `<fields />` +
      `<add>` +
      rectsXml +
      polysXml +
      inksXml +
      notesXml +
      `</add><modify /><delete /></xfdf>`;

    updateRegulationById(selectedRegulationId, { xfdfString: xml });
    console.debug("Saved XFDF", { xmlLength: xml.length });
  };

  const pdfUrl = useMemo(() => {
    if (!file) return null;
    return `https://rescope-demo.sfo3.digitaloceanspaces.com/${selectedProjectId}${file.url}`;
  }, [file, selectedProjectId]);

  useEffect(() => {
    const xfdf = selectedRegulation?.xfdfString;
    if (!xfdf) {
      setRects([]);
      setPolys([]);
      setInks([]);
      setNotes([]);
      resetHistory({ rects: [], polys: [], inks: [], notes: [] });
      return;
    }
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xfdf, "text/xml");
      const squares = xml.querySelectorAll("square, rect, highlight");
      const polygons = xml.querySelectorAll("polygon");
      const inksXml = xml.querySelectorAll("ink");
      const notesXml = xml.querySelectorAll("text, note");
      const arr: XFDFRect[] = [];
      const parr: XFDFPolygon[] = [];
      const iarr: XFDFInk[] = [];
      const narr: XFDFAttachNote[] = [];
      squares.forEach((el, i) => {
        const page = (parseInt(el.getAttribute("page") || "0", 10) || 0) + 1;
        const rectAttr = el.getAttribute("rect");
        const color = (el.getAttribute("color") || "#E44234").trim();
        if (!rectAttr) return;
        const [x1, y1, x2, y2] = rectAttr.split(",").map((n) => Number(n));
        if ([x1, y1, x2, y2].some((n) => Number.isNaN(n))) return;
        const type =
          el.tagName.toLowerCase() === "highlight" ? "highlight" : "rectangle";
        arr.push({ id: `xfdf-${i}`, page, x1, y1, x2, y2, color, type });
      });
      polygons.forEach((el, i) => {
        const page = (parseInt(el.getAttribute("page") || "0", 10) || 0) + 1;
        const color = (el.getAttribute("color") || "#E44234").trim();
        const width = Number(el.getAttribute("width") || "3");
        const vertsText = el.querySelector("vertices")?.textContent || "";
        const pairs = vertsText
          .split(";")
          .map((p) => p.trim())
          .filter(Boolean);
        const vertices: Array<{ x: number; y: number }> = [];
        pairs.forEach((p) => {
          const [xs, ys] = p.split(",");
          const x = Number(xs);
          const y = Number(ys);
          if (!Number.isNaN(x) && !Number.isNaN(y)) vertices.push({ x, y });
        });
        if (vertices.length >= 3) {
          parr.push({
            id: `poly-${i}`,
            page,
            vertices,
            color,
            width: Number.isFinite(width) ? width : 3,
            type: "polygon",
          });
        }
      });
      inksXml.forEach((el, i) => {
        const page = (parseInt(el.getAttribute("page") || "0", 10) || 0) + 1;
        const color = (el.getAttribute("color") || "#E44234").trim();
        const width = Number(el.getAttribute("width") || "3");
        const vertsText = el.querySelector("vertices")?.textContent || "";
        const pairs = vertsText
          .split(";")
          .map((p) => p.trim())
          .filter(Boolean);
        const points: Array<{ x: number; y: number }> = [];
        pairs.forEach((p) => {
          const [xs, ys] = p.split(",");
          const x = Number(xs);
          const y = Number(ys);
          if (!Number.isNaN(x) && !Number.isNaN(y)) points.push({ x, y });
        });
        if (points.length >= 2) {
          iarr.push({
            id: `ink-${i}`,
            page,
            points,
            color,
            width: Number.isFinite(width) ? width : 3,
            type: "ink",
          });
        }
      });
      notesXml.forEach((el, i) => {
        const page = (parseInt(el.getAttribute("page") || "0", 10) || 0) + 1;
        const color = (el.getAttribute("color") || "#3B82F6").trim();
        const contents = el.getAttribute("contents") || el.textContent || "";
        const x = Number(el.getAttribute("x") || "");
        const y = Number(el.getAttribute("y") || "");
        if (!Number.isNaN(x) && !Number.isNaN(y)) {
          narr.push({
            id: `note-${i}`,
            page,
            x,
            y,
            color,
            contents: contents || "",
            type: "note",
          });
        }
      });
      setRects(arr);
      setPolys(parr);
      setInks(iarr);
      setNotes(narr);
      resetHistory({ rects: arr, polys: parr, inks: iarr, notes: narr });
      // Debug: log what we parsed
      console.debug("PDFCanvasViewer: parsed XFDF", {
        rects: arr.length,
        polys: parr.length,
        inks: iarr.length,
        notes: narr.length,
        pagesRects: Array.from(new Set(arr.map((r) => r.page))),
        pagesPolys: Array.from(new Set(parr.map((p) => p.page))),
      });
      if (arr.length > 0) setCurrentPage(arr[0].page);
    } catch (e) {
      console.error("Failed to parse XFDF", e);
      setRects([]);
      setPolys([]);
    }
  }, [selectedRegulation?.xfdfString]);

  useEffect(() => {
    let cancelled = false;
    if (!pdfUrl) return;
    (async () => {
      try {
        // Clear any cached viewports from a previous document to avoid
        // stale dimensions/orientation during initial renders.
        viewportsRef.current = {};
        const loadingTask = (pdfjsLib as any).getDocument({
          url: pdfUrl,
          withCredentials: false,
        });
        const pdf: pdfjsLib.PDFDocumentProxy = await loadingTask.promise;
        if (cancelled) return;
        setDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (e) {
        console.error("Failed to load PDF", e);
        setDoc(null);
        setNumPages(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  const renderPage = async (pageNumber: number) => {
    if (!doc) return;
    const page = await doc.getPage(pageNumber);
    // Use the page's intrinsic rotation by default; pdf.js already applies
    // the page-level rotation internally when no explicit rotation is passed.
    const viewport = page.getViewport({ scale });
    const canvas = canvasRefs.current[pageNumber - 1];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Render at device pixel ratio for crisp output on HiDPI/retina
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    // Backing store in device pixels
    canvas.width = Math.ceil(viewport.width * dpr);
    canvas.height = Math.ceil(viewport.height * dpr);
    // CSS size in logical pixels so layout/overlay match viewport
    canvas.style.width = `${Math.ceil(viewport.width)}px`;
    canvas.style.height = `${Math.ceil(viewport.height)}px`;

    viewportsRef.current[pageNumber] = viewport;

    await page.render({
      canvasContext: ctx,
      viewport,
      // Scale drawing to the higher resolution backing buffer
      transform: [dpr, 0, 0, dpr, 0, 0],
    }).promise;
  };

  useEffect(() => {
    if (!doc) return;
    const pagesToRender = new Set<number>(visiblePagesRef.current);
    pagesToRender.add(currentPage);
    if (currentPage > 1) pagesToRender.add(currentPage - 1);
    if (currentPage < numPages) pagesToRender.add(currentPage + 1);
    // Ensure the last page is rendered as well so it lays out correctly
    // even before navigating to it. This avoids the issue where the last
    // page appears blank or mis-sized until explicitly selected.
    if (numPages > 0) pagesToRender.add(numPages);
    pagesToRender.forEach((p) => void renderPage(p));
  }, [doc, scale, currentPage, numPages]);

  // Observe pages entering the viewport to render them lazily
  // useEffect(() => {
  //   const root = containerRef.current;
  //   if (!root || !doc || numPages === 0) return;
  //   const io = new IntersectionObserver(
  //     (entries) => {
  //       for (const entry of entries) {
  //         const idxAttr = (entry.target as HTMLElement).getAttribute(
  //           "data-page-index"
  //         );
  //         const idx = idxAttr ? parseInt(idxAttr, 10) : NaN;
  //         if (!Number.isFinite(idx)) continue;
  //         const pageNumber = idx + 1; // idx is 0-based
  //         if (entry.isIntersecting) {
  //           visiblePagesRef.current.add(pageNumber);
  //           void renderPage(pageNumber);
  //         } else {
  //           visiblePagesRef.current.delete(pageNumber);
  //         }
  //       }
  //     },
  //     { root, threshold: 0.1 }
  //   );

  //   pageContainerRefs.current.forEach((el, idx) => {
  //     if (!el) return;
  //     el.setAttribute("data-page-index", String(idx));
  //     io.observe(el);
  //   });

  //   return () => {
  //     try {
  //       io.disconnect();
  //     } catch {}
  //     visiblePagesRef.current.clear();
  //   };
  // }, [doc, numPages]);

  // Scroll the selected page into view when navigating
  useEffect(() => {
    const el = pageContainerRefs.current[currentPage - 1];
    const sc = containerRef.current;
    if (el && sc) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [currentPage]);

  const zoomIn = () =>
    setScale((s) => clampScale(Number((s + 0.1).toFixed(2))));
  const zoomOut = () =>
    setScale((s) => clampScale(Number((s - 0.1).toFixed(2))));

  // Keyboard shortcuts: Undo/Redo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (!isMeta) return;
      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Trackpad pinch (Ctrl/Cmd + wheel) support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return; // Only treat as pinch-zoom when ctrlKey is true
      e.preventDefault();
      const delta = e.deltaY;
      const base = scaleRef.current;
      // Exponential scaling feels more linear across devices
      const next = base * Math.exp(-delta * WHEEL_ZOOM_K);
      commitScale(next, { clientX: e.clientX, clientY: e.clientY });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    // iOS Safari non-standard gesture events: prevent default to avoid page zoom/rotate
    const prevent = (e: Event) => e.preventDefault();
    el.addEventListener("gesturestart" as any, prevent, {
      passive: false,
    } as any);
    el.addEventListener("gesturechange" as any, prevent, {
      passive: false,
    } as any);
    el.addEventListener("gestureend" as any, prevent, {
      passive: false,
    } as any);
    return () => {
      el.removeEventListener("wheel", onWheel as any);
      el.removeEventListener("gesturestart" as any, prevent as any);
      el.removeEventListener("gesturechange" as any, prevent as any);
      el.removeEventListener("gestureend" as any, prevent as any);
    };
  }, []);

  // Touch pinch-to-zoom helpers
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    activeTouchCountRef.current = e.touches.length;
    if (e.touches.length === 2) {
      // Cancel any ongoing pointer-based panning when pinch starts
      if (isPanning) {
        setIsPanning(false);
        panOriginRef.current = null;
      }
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      pinchRef.current = {
        startDist: Math.hypot(dx, dy),
        startScale: scale,
        active: true,
      };
      e.preventDefault();
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    activeTouchCountRef.current = e.touches.length;
    if (pinchRef.current.active && e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / Math.max(1, pinchRef.current.startDist);
      // Exponential curve for faster, smoother feel
      const ratioPow = Math.pow(ratio, TOUCH_ZOOM_EXP);
      const next = pinchRef.current.startScale * ratioPow;
      const centerX = (t1.clientX + t2.clientX) / 2;
      const centerY = (t1.clientY + t2.clientY) / 2;
      commitScale(next, { clientX: centerX, clientY: centerY });
      e.preventDefault();
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    activeTouchCountRef.current = e.touches.length;
    if (pinchRef.current.active && e.touches.length < 2) {
      pinchRef.current.active = false;
    }
  };

  if (!file) return null;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-col border-b border-gray-200">
        {/* Top row: filename (left) and page navigation (right) */}
        <div className="flex items-center justify-between pl-3 pr-2 py-2 h-[49px]">
          <div className="min-w-0 mr-3 truncate text-sm text-gray-600">
            {file?.name ? (
              <span className="truncate">
                <span className="font-medium text-gray-700 truncate max-w-[40vw] inline-block align-middle">
                  {file.name}
                </span>
              </span>
            ) : null}
          </div>
          <div className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-[3px] text-gray-500">
            <button
              className={cn(
                "p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600",
                currentPage === 1 &&
                  "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-400"
              )}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="mx-2 h-5 w-px bg-gray-200" />
            <span className="mx-1 text-sm text-gray-600">Page</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="mx-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 hover:bg-gray-50"
                  aria-label="Select page"
                >
                  <span className="min-w-[1.75rem] text-center">
                    {currentPage}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-60 overflow-auto"
              >
                {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                  <DropdownMenuItem key={p} onClick={() => setCurrentPage(p)}>
                    Page {p}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="mx-1 text-sm text-gray-600">of {numPages}</span>
            <div className="mx-2 h-5 w-px bg-gray-200" />
            <button
              className={cn(
                "p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600",
                currentPage === numPages &&
                  "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-400"
              )}
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage === numPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom row: annotation toolbar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
          {/* Tool group */}
          <div className="flex items-center gap-1">
            <Button
              variant={tool === "hand" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("hand")}
              title="Pan"
              className={cn(
                "h-8",
                tool === "hand" &&
                  "bg-gray-700 hover:bg-gray-700 text-white rounded-sm"
              )}
            >
              <Hand className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === "rect" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("rect")}
              title="Rectangle (R)"
              className={cn(
                "h-8",
                tool === "rect" &&
                  "bg-gray-700 hover:bg-gray-700 text-white rounded-sm"
              )}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === "highlight" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("highlight")}
              title="Area Highlight (H)"
              className={cn(
                "h-8",
                tool === "highlight" &&
                  "bg-gray-700 hover:bg-gray-700 text-white rounded-sm"
              )}
            >
              <Highlighter className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === "poly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("poly")}
              title="Polygon (G)"
              className={cn(
                "h-8",
                tool === "poly" &&
                  "bg-gray-700 hover:bg-gray-700 text-white rounded-sm"
              )}
            >
              <Shapes className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === "pen" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("pen")}
              title="Pencil (P)"
              className={cn(
                "h-8",
                tool === "pen" &&
                  "bg-gray-700 hover:bg-gray-700 text-white rounded-sm"
              )}
            >
              <PenLine className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === "note" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("note")}
              title="Comment (C)"
              className={cn(
                "h-8",
                tool === "note" &&
                  "bg-gray-700 hover:bg-gray-700 text-white rounded-sm"
              )}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>

          {/* Style controls */}
          <div className="flex items-center gap-2">
            {/* Color picker */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  title="Color"
                >
                  <span
                    className="inline-block w-4 h-4 rounded"
                    style={{ backgroundColor: strokeColor }}
                  />
                  <Palette className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[220px] p-3">
                <div className="text-xs text-gray-600 mb-2">
                  Stroke/Highlight color
                </div>
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {[
                    "#E44234",
                    "#F59E0B",
                    "#10B981",
                    "#3B82F6",
                    "#8B5CF6",
                    "#EF4444",
                    "#111827",
                  ].map((c) => (
                    <button
                      key={c}
                      className={cn(
                        "w-6 h-6 rounded border",
                        c === strokeColor
                          ? "ring-2 ring-offset-1 ring-gray-400"
                          : ""
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => setStrokeColor(c)}
                      aria-label={`Set color ${c}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-full text-xs px-2 py-1 border rounded"
                    placeholder="#RRGGBB"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Thickness */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  title="Thickness"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-xs">{thickness}px</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[220px] p-3">
                <div className="text-xs text-gray-600 mb-2">Stroke width</div>
                <div className="px-1">
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Cmd/Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Cmd/Ctrl+Shift+Z)"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            {/* Zoom controls aligned with other buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={zoomOut}
              title="Zoom out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="px-1 text-xs tabular-nums text-gray-600 min-w-[3ch] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={zoomIn}
              title="Zoom in (+)"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto px-4 py-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onContainerPointerDown}
        onPointerMove={onContainerPointerMove}
        onPointerUp={onContainerPointerUp}
        style={{
          cursor:
            tool === "hand" ? (isPanning ? "grabbing" : "grab") : undefined,
          userSelect: isPanning ? "none" : undefined,
          touchAction: "pan-x pan-y",
          overscrollBehavior: "contain",
        }}
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map(
          (pageNumber, idx) => (
            <div
              key={pageNumber}
              ref={(el) => {
                pageContainerRefs.current[idx] = el;
              }}
              className="relative mx-auto mb-6 bg-white shadow-sm"
              style={{ width: "fit-content" }}
            >
              <canvas
                ref={(el) => {
                  canvasRefs.current[idx] = el;
                }}
                className="block"
                onLoadCapture={() => {}}
              />
              <OverlayForPage
                pageNumber={pageNumber}
                canvasRef={() => canvasRefs.current[idx]}
                rects={rects}
                polys={polys}
                inks={inks}
                notes={notes}
                scale={scale}
                getViewport={(p: number) => viewportsRef.current[p]}
                doc={doc}
                tool={tool}
                strokeColor={strokeColor}
                thickness={thickness}
                onAddRect={(r) => {
                  const newRects = [...rects, r];
                  const next = { rects: newRects, polys, inks, notes };
                  setRects(newRects);
                  pushHistory(next);
                }}
                onAddPoly={(poly) => {
                  const newPolys = [...polys, poly];
                  const next = { rects, polys: newPolys, inks, notes };
                  setPolys(newPolys);
                  pushHistory(next);
                }}
                onAddInk={(ink) => {
                  const newInks = [...inks, ink];
                  const next = { rects, polys, inks: newInks, notes };
                  setInks(newInks);
                  pushHistory(next);
                }}
                onAddNote={(note) => {
                  const newNotes = [...notes, note];
                  const next = { rects, polys, inks, notes: newNotes };
                  setNotes(newNotes);
                  pushHistory(next);
                }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

function OverlayForPage({
  pageNumber,
  canvasRef,
  rects,
  polys,
  inks,
  notes,
  scale,
  getViewport,
  doc,
  tool,
  strokeColor,
  thickness,
  onAddRect,
  onAddPoly,
  onAddInk,
  onAddNote,
}: {
  pageNumber: number;
  canvasRef: () => HTMLCanvasElement | null;
  rects: XFDFRect[];
  polys: XFDFPolygon[];
  inks: XFDFInk[];
  notes: XFDFAttachNote[];
  scale: number;
  getViewport: (p: number) => any;
  doc: pdfjsLib.PDFDocumentProxy | null;
  tool: "hand" | "rect" | "highlight" | "poly" | "pen" | "note";
  strokeColor: string;
  thickness: number;
  onAddRect: (r: XFDFRect) => void;
  onAddPoly: (p: XFDFPolygon) => void;
  onAddInk: (i: XFDFInk) => void;
  onAddNote: (n: XFDFAttachNote) => void;
}) {
  const [dims, setDims] = useState<{
    cssW: number;
    cssH: number;
    attrW: number;
    attrH: number;
  }>({ cssW: 0, cssH: 0, attrW: 0, attrH: 0 });

  useEffect(() => {
    const c = canvasRef();
    if (!c) return;

    const update = () => {
      const rect = c.getBoundingClientRect();
      setDims({
        cssW: rect.width,
        cssH: rect.height,
        attrW: c.width,
        attrH: c.height,
      });
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(c);
    return () => {
      try {
        ro.disconnect();
      } catch {}
    };
  }, [canvasRef, scale]);

  const pageRects = rects.filter((r) => r.page === pageNumber);
  const pagePolys = polys.filter((p) => p.page === pageNumber);
  const pageInks = inks.filter((i) => i.page === pageNumber);
  const pageNotes = notes.filter((n) => n.page === pageNumber);
  const viewport = getViewport?.(pageNumber);
  const canvasEl = canvasRef();

  // When rendering at devicePixelRatio, the canvas attribute size is larger
  // than the logical viewport. Use the viewport's width/height (logical px)
  // to compute CSS mapping so the overlay aligns regardless of DPR.
  const effectiveAttrW = viewport?.width ?? dims.attrW;
  const effectiveAttrH = viewport?.height ?? dims.attrH;

  // Helpers to map CSS coords -> PDF coords
  const cssToPdf = (cssX: number, cssY: number) => {
    const kx = effectiveAttrW / dims.cssW;
    const ky = effectiveAttrH / dims.cssH;
    const vx = cssX * kx;
    const vy = cssY * ky;
    if (viewport?.convertToPdfPoint) {
      const [px, py] = viewport.convertToPdfPoint(vx, vy);
      return { x: px, y: py };
    }
    // Fallback: assume viewport is identity to attr for simplicity
    return { x: vx, y: vy };
  };

  // Local draft states for drawing
  const [draftRect, setDraftRect] = useState<null | {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    type: "rectangle" | "highlight";
  }>(null);
  const [draftPoly, setDraftPoly] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [isDrawingInk, setIsDrawingInk] = useState(false);
  const [draftInkPts, setDraftInkPts] = useState<
    Array<{ x: number; y: number }>
  >([]);

  // Bail out from rendering overlay visuals if canvas sizing is not ready yet
  if (
    !canvasEl ||
    dims.cssW === 0 ||
    dims.cssH === 0 ||
    dims.attrW === 0 ||
    dims.attrH === 0
  )
    return null;

  const onPointerDown = (e: any) => {
    if (tool === "rect" || tool === "highlight") {
      const target = e.currentTarget as HTMLDivElement;
      const r = target.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setDraftRect({
        x0: x,
        y0: y,
        x1: x,
        y1: y,
        type: tool === "rect" ? "rectangle" : "highlight",
      });
    } else if (tool === "pen") {
      const target = e.currentTarget as HTMLDivElement;
      const r = target.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setIsDrawingInk(true);
      setDraftInkPts([{ x, y }]);
    } else if (tool === "poly") {
      const target = e.currentTarget as HTMLDivElement;
      const r = target.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setDraftPoly((prev) => [...prev, { x, y }]);
    } else if (tool === "note") {
      const target = e.currentTarget as HTMLDivElement;
      const r = target.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const pt = cssToPdf(x, y);
      const contents = window.prompt("Add comment:") || "";
      onAddNote({
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        page: pageNumber,
        x: pt.x,
        y: pt.y,
        color: strokeColor,
        contents,
        type: "note",
      });
    }
  };

  const onPointerMove = (e: any) => {
    if (draftRect) {
      const target = e.currentTarget as HTMLDivElement;
      const r = target.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setDraftRect({ ...draftRect, x1: x, y1: y });
    } else if (isDrawingInk) {
      const target = e.currentTarget as HTMLDivElement;
      const r = target.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setDraftInkPts((prev) => [...prev, { x, y }]);
    }
  };

  const onPointerUp = (e: any) => {
    if (draftRect) {
      const { x0, y0, x1, y1, type } = draftRect;
      setDraftRect(null);
      const p1 = cssToPdf(x0, y0);
      const p2 = cssToPdf(x1, y1);
      onAddRect({
        id: `rect-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        page: pageNumber,
        x1: Math.min(p1.x, p2.x),
        y1: Math.min(p1.y, p2.y),
        x2: Math.max(p1.x, p2.x),
        y2: Math.max(p1.y, p2.y),
        color: strokeColor,
        width: thickness,
        type: type,
      });
    } else if (isDrawingInk) {
      setIsDrawingInk(false);
      const pts = draftInkPts;
      setDraftInkPts([]);
      if (pts.length < 2) return;
      const pdfPts = pts.map((p) => {
        const { x, y } = cssToPdf(p.x, p.y);
        return { x, y };
      });
      onAddInk({
        id: `ink-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        page: pageNumber,
        points: pdfPts,
        color: strokeColor,
        width: thickness,
        type: "ink",
      });
    }
  };

  const onDoubleClick = () => {
    if (tool === "poly" && draftPoly.length >= 3) {
      const pdfVerts = draftPoly.map(({ x, y }) => cssToPdf(x, y));
      onAddPoly({
        id: `poly-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        page: pageNumber,
        vertices: pdfVerts,
        color: strokeColor,
        width: thickness,
        type: "polygon",
      });
      setDraftPoly([]);
    }
  };

  return (
    <div
      className="absolute inset-0 z-10"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      style={{
        cursor: tool === "hand" ? undefined : "crosshair",
        pointerEvents: tool === "hand" ? ("none" as const) : ("auto" as const),
      }}
    >
      <svg
        width={dims.cssW}
        height={dims.cssH}
        viewBox={`0 0 ${dims.cssW} ${dims.cssH}`}
        className="absolute top-0 left-0"
      >
        {/* Draft rectangle */}
        {draftRect && (
          <rect
            x={Math.min(draftRect.x0, draftRect.x1)}
            y={Math.min(draftRect.y0, draftRect.y1)}
            width={Math.abs(draftRect.x1 - draftRect.x0)}
            height={Math.abs(draftRect.y1 - draftRect.y0)}
            fill={`${strokeColor}33`}
            stroke={strokeColor}
            strokeDasharray="4 2"
            strokeWidth={1}
          />
        )}
        {/* Draft polygon */}
        {tool === "poly" && draftPoly.length > 0 && (
          <polyline
            points={draftPoly.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="transparent"
            stroke={strokeColor}
            strokeDasharray="4 2"
            strokeWidth={1}
          />
        )}
        {/* Draft ink */}
        {isDrawingInk && draftInkPts.length > 1 && (
          <polyline
            points={draftInkPts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={Math.max(1, thickness * (dims.cssW / effectiveAttrW))}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {pageRects.map((r) => {
          let p1: [number, number];
          let p2: [number, number];
          if (viewport?.convertToViewportPoint) {
            p1 = viewport.convertToViewportPoint(
              Math.min(r.x1, r.x2),
              Math.min(r.y1, r.y2)
            );
            p2 = viewport.convertToViewportPoint(
              Math.max(r.x1, r.x2),
              Math.max(r.y1, r.y2)
            );
          } else {
            p1 = [
              Math.min(r.x1, r.x2) * scale,
              dims.attrH - Math.max(r.y1, r.y2) * scale,
            ];
            p2 = [
              Math.max(r.x1, r.x2) * scale,
              dims.attrH - Math.min(r.y1, r.y2) * scale,
            ];
          }

          const xAttr = Math.min(p1[0], p2[0]);
          const yAttr = Math.min(p1[1], p2[1]);
          const wAttr = Math.abs(p2[0] - p1[0]);
          const hAttr = Math.abs(p2[1] - p1[1]);

          const kx = dims.cssW / effectiveAttrW;
          const ky = dims.cssH / effectiveAttrH;

          const x = xAttr * kx;
          const y = yAttr * ky;
          const w = wAttr * kx;
          const h = hAttr * ky;
          const fill = `${r.color}33`;
          return (
            <rect
              key={r.id}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={fill}
              stroke={r.color}
              strokeWidth={Math.max(
                1,
                (r.width ?? 3) * (dims.cssW / effectiveAttrW)
              )}
            />
          );
        })}
        {pagePolys.map((p) => {
          const kx = dims.cssW / effectiveAttrW;
          const ky = dims.cssH / effectiveAttrH;
          const points = p.vertices
            .map((v) => {
              let vxAttr: number;
              let vyAttr: number;
              if (viewport?.convertToViewportPoint) {
                const vv = viewport.convertToViewportPoint(v.x, v.y);
                vxAttr = vv[0];
                vyAttr = vv[1];
              } else {
                vxAttr = v.x * scale;
                vyAttr = dims.attrH - v.y * scale;
              }
              const xAttr = vxAttr;
              const yAttr = vyAttr;
              const x = xAttr * kx;
              const y = yAttr * ky;
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polyline
              key={p.id}
              points={points}
              fill={`${p.color}33`}
              stroke={p.color}
              strokeWidth={Math.max(
                1,
                (p.width ?? 3) * (dims.cssW / effectiveAttrW)
              )}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
        {pageInks.map((i) => {
          const kx = dims.cssW / effectiveAttrW;
          const ky = dims.cssH / effectiveAttrH;
          const points = i.points
            .map((v) => {
              let vxAttr: number;
              let vyAttr: number;
              if (viewport?.convertToViewportPoint) {
                const vv = viewport.convertToViewportPoint(v.x, v.y);
                vxAttr = vv[0];
                vyAttr = vv[1];
              } else {
                vxAttr = v.x * scale;
                vyAttr = dims.attrH - v.y * scale;
              }
              const xAttr = vxAttr;
              const yAttr = vyAttr;
              const x = xAttr * kx;
              const y = yAttr * ky;
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polyline
              key={i.id}
              points={points}
              fill="transparent"
              stroke={i.color}
              strokeWidth={Math.max(
                1,
                (i.width ?? 3) * (dims.cssW / effectiveAttrW)
              )}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
        {pageNotes.map((n) => {
          const kx = dims.cssW / effectiveAttrW;
          const ky = dims.cssH / effectiveAttrH;
          let vxAttr: number;
          let vyAttr: number;
          if (viewport?.convertToViewportPoint) {
            const vv = viewport.convertToViewportPoint(n.x, n.y);
            vxAttr = vv[0];
            vyAttr = vv[1];
          } else {
            vxAttr = n.x * scale;
            vyAttr = dims.attrH - n.y * scale;
          }
          const x = vxAttr * kx;
          const y = vyAttr * ky;
          return (
            <g key={n.id}>
              <circle cx={x} cy={y} r={6} fill={n.color} />
              <text x={x + 10} y={y + 4} fontSize={12} fill="#374151">
                {n.contents?.slice(0, 24) || "Comment"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
