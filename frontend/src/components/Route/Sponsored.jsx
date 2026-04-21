import React from "react";

const brands = [
  "Sephora",
  "MAC Cosmetics",
  "Maybelline",
  "L'Oreal",
  "CeraVe",
  "The Ordinary",
  "La Roche-Posay",
  "Cetaphil",
];

const Sponsored = () => {
  return (
    <section className="section-shell py-14">
      <div className="section-frame">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="eyebrow">Brands</span>
            <h2 className="section-heading mt-4">Trusted beauty brands</h2>
            <p className="section-copy mt-3 max-w-2xl">
              A cleaner brand section with simple cards, balanced spacing and no external logo loading.
            </p>
          </div>

          <div className="floating-card px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Partners</p>
            <p className="mt-1 text-sm font-semibold text-[#17212b]">{brands.length} featured names</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {brands.map((brand, index) => (
            <div key={brand} className="surface-card-sm flex min-h-[120px] items-end justify-between gap-4 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a67861]">
                  Brand {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-xl font-semibold text-[#1f2937]">{brand}</p>
              </div>
              <span className="muted-chip !bg-[#f6efe7] !text-[#885e4a]">Trusted</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsored;
