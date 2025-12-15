// app/page.tsx
"use client";

import Link from "next/link";
import { ShoppingCart, Home } from "lucide-react";

export default function HomePage() {
  return (
    <main className="p-8 font-body" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold mb-4">Bienvenido a Payday Cards</h1>
        <p className="text-lg text-[var(--accent-yellow)]">
          Explora nuestra tienda
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <img src="/banner1.png" alt="Banner 1" className="rounded shadow-lg" />
        <img src="/banner2.png" alt="Banner 2" className="rounded shadow-lg" />
        <img src="/banner3.png" alt="Banner 3" className="rounded shadow-lg" />
      </section>

      <div className="text-center">
        <Link href="/products" className="inline-block bg-[var(--accent-green)] text-[var(--background)] px-6 py-3 rounded-lg font-bold hover:bg-[var(--accent-yellow)] transition">
          Ver productos
        </Link>
      </div>
    </main>
  );
}
