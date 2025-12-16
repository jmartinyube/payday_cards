"use client";

import "./globals.css";
import { CartProvider, useCart } from "./context/CartContext";
import Link from "next/link";
import {
  ShoppingCart,
  Home,
  Package,
  Menu,
  X,
  Tags,
} from "lucide-react";
import { CgPokemon } from "react-icons/cg";
import { GiPirateSkull, GiMagicGate } from "react-icons/gi";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation"; 


/* ================= ROOT LAYOUT ================= */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = [
    "Envio gratis en compras mayores a 50€",
    "Nuevas cartas disponibles cada semana",
    "¡Suscribete y obten un 10% de descuento!",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const i = setInterval(
      () => setCurrentMessage((p) => (p + 1) % messages.length),
      5000
    );
    return () => clearInterval(i);
  }, []);

  return (
    <html lang="es">
      <body
        className="font-body"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <CartProvider>
          {/* ===== TOP HEADER ===== */}
          <div
            className="w-full px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm md:pl-16"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://www.instagram.com" target="_blank">
                <SiInstagram size={16} />
              </a>
              <a href="https://www.tiktok.com" target="_blank">
                <SiTiktok size={16} />
              </a>
              <a href="https://www.x.com" target="_blank">
                <SiX size={16} />
              </a>
            </div>

            <div className="text-center font-medium">
              {messages[currentMessage]}
            </div>

            <div className="hidden md:block w-20" />
          </div>

          {/* ===== HEADER ===== */}
          <header
            className="flex items-center justify-between px-4 md:px-8 py-4 md:pl-16"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            <div className="flex items-center gap-2">
              <button
                className="md:hidden"
                onClick={() => document.dispatchEvent(new Event("toggle-menu"))}
              >
                <Menu size={28} />
              </button>

              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/logo_payday.png"
                  className="w-10 h-10 md:w-16 md:h-16"
                />
                <span className="hidden md:block text-2xl font-bold">
                  Payday Cards
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="hidden md:block">
                <Home size={24} />
              </Link>
              <Link href="/products" className="hidden md:block">
                <Package size={24} />
              </Link>
              <CartIcon />
            </div>
          </header>

          <SideBar />

          <main className="md:pl-16">{children}</main>

          <footer
            className="text-center p-4 mt-10 text-sm md:pl-16"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            ©2025 Payday Cards
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}

/* ================= CART ICON ================= */

function CartIcon() {
  const { totalQuantity } = useCart();

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart size={24} />
      {totalQuantity > 0 && (
        <span
          className="absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center rounded-full"
          style={{
            background: "var(--accent-red)",
            color: "var(--background)",
          }}
        >
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}




/* ================= SIDEBAR ================= */

function SideBar() {
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const activeCollection =
    segments[0] === "collections" ? segments[1] : null;

  const activeSubcategory =
    segments[0] === "collections" && segments.length >= 3
      ? segments[2]
      : null;


  useEffect(() => {
    const toggle = () => setMobileOpen((p) => !p);
    document.addEventListener("toggle-menu", toggle);
    return () => document.removeEventListener("toggle-menu", toggle);
  }, []);

  const categories = [
    {
      name: "Pokemon",
      icon: CgPokemon,
      handle: "pokemon",
      subs: [
        { label: "Sellado", tag: "sellado" },
        { label: "Cartas sueltas", tag: "singles" },
      ],
    },
    {
      name: "One Piece",
      icon: GiPirateSkull,
      handle: "one-piece",
      subs: [
        { label: "Boosters", tag: "boosters" },
        { label: "Decks", tag: "decks" },
      ],
    },
    {
      name: "Magic: The Gathering",
      icon: GiMagicGate,
      handle: "magic-the-gathering",
      subs: [
        { label: "Draft", tag: "draft" },
        { label: "Commander", tag: "commander" },
      ],
    },
    {
      name: "Ofertas",
      icon: Tags,
      handle: "ofertas",
      subs: [{ label: "Descuentos", tag: "descuento" }],
    },
  ];

  return (
    <>
      {/* Overlay */}
      {hovered && (
        <div
          className="hidden md:block fixed inset-0 z-30"
          style={{ background: "rgba(0,0,0,0.25)" }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="hidden md:flex fixed top-0 left-0 h-full z-40 flex-col transition-all duration-300"
        style={{
          width: hovered ? "300px" : "64px",
          background: hovered
            ? "rgba(75,52,18,0.95)"
            : "var(--foreground)",
          color: "var(--background)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setOpenCategory(null);
        }}
      >
        {/* Todos */}
        <Link
          href="/products"
          className={`flex items-center h-16 ${
            pathname === "/products"
              ? "bg-[rgba(246,201,76,0.25)]"
              : "hover:bg-[rgba(246,201,76,0.12)]"
          }`}
        >
          <div className="w-16 h-16 flex items-center justify-center shrink-0">
            <Menu size={22} />
          </div>
          <span
            className={`font-semibold text-sm ${
              hovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Todas las categorias
          </span>
        </Link>

        {categories.map(({ name, icon: Icon, handle, subs }) => {
          const isActiveCollection = 
            activeCollection === handle;

          return (
            <div
              key={handle}
              className="relative"
              onMouseEnter={() => {
                if (closeTimeoutRef.current) {
                  clearTimeout(closeTimeoutRef.current);
                }
                setOpenCategory(name);
              }}
              onMouseLeave={() => {
                closeTimeoutRef.current = setTimeout(() => {
                  setOpenCategory(null);
                }, 150);
              }}
            >
              {/* Categorías */}
              <Link
                href={`/collections/${handle}`}
                className={`flex items-center h-16 transition-colors ${
                  isActiveCollection
                    ? "bg-[rgba(246,201,76,0.3)]"
                    : "hover:bg-[rgba(246,201,76,0.12)]"
                }`}
              >
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                  <Icon size={24} />
                </div>

                <span
                  className={`${
                    hovered ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  {name}
                </span>
              </Link>

              {/* Subcategorías */}
              {hovered && openCategory === name && (
                <div
                  className="
                    absolute
                    left-16
                    top-16
                    min-w-[220px]
                    bg-black/20
                    backdrop-blur-sm
                    rounded-md
                    shadow-lg
                    py-2
                    z-50
                  "
                >
                  {subs.map((sub) => {
                  const isActiveSub =
                    activeCollection === handle &&
                    activeSubcategory === sub.tag;

                    return (
                      <Link
                        key={sub.tag}
                        href={`/collections/${handle}/${sub.tag}`}
                        className={`
                          block px-4 py-2 text-sm transition-colors
                          ${
                            isActiveSub
                              ? "text-[var(--accent-green)] font-semibold"
                              : "hover:text-[var(--accent-green)]"
                          }
                        `}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </aside>

      {/* Móvil */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={() => setMobileOpen(false)}
          />

          <aside
            className="fixed top-0 left-0 h-full w-72 z-50 p-4"
            style={{
              background: "rgba(75,52,18,0.97)",
              color: "var(--background)",
            }}
          >
            <div className="flex justify-between mb-6">
              <Menu onClick={() => setMobileOpen(false)} />
              <X onClick={() => setMobileOpen(false)} />
            </div>

            {categories.map(({ name, icon: Icon, handle, subs }) => (
              <div key={handle}>
                <Link
                  href={`/collections/${handle}`}
                  className="flex items-center gap-4 py-3 hover:bg-black/10"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </Link>

                {subs.map((sub) => (
                  <Link
                    key={sub.tag}
                    href={`/collections/${handle}?type=${sub.tag}`}
                    className="block ml-8 py-1 text-sm hover:text-[var(--accent-green)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
          </aside>
        </>
      )}
    </>
  );
}