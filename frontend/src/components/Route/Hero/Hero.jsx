import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { server } from "../../../server";

const heroStats = [
  { label: "Curated categories", value: "10+" },
  { label: "Popular products", value: "500+" },
  { label: "Simple checkout", value: "3 steps" },
];

const Hero = () => {
  const [bannerUrl, setBannerUrl] = useState("");
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getBanner = async () => {
      try {
        const { data } = await axios.get(`${server}/banner/get-banner`);

        if (isMounted) {
          setBannerUrl(data?.banner?.image?.url || "");
        }
      } catch (error) {
        if (isMounted) {
          setBannerUrl("");
        }
      } finally {
        if (isMounted) {
          setIsLoadingBanner(false);
        }
      }
    };

    getBanner();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section-shell pt-6 md:pt-8">
      <div className="hero-shell">
        <div className="grid min-h-full gap-10 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-12 xl:p-14">
          <div className="relative z-10 flex flex-col justify-center">
            <span className="eyebrow">Clean layout, fuller screen, better shopping flow</span>
            <h1 className="section-heading mt-6 max-w-3xl">
              Explore beauty essentials in a layout that feels premium, open and easier to use.
            </h1>
            <p className="section-copy mt-6 max-w-2xl text-[15px] md:text-[17px]">
              GlamCart now uses the screen better with wider sections, stronger hierarchy and a softer modern theme that still stays clean.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop now
              </Link>
              <Link to="/offers" className="btn-secondary">
                Browse offers
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="floating-card p-4">
                  <p className="text-2xl font-extrabold text-[#17212b]">{item.value}</p>
                  <p className="mt-1 text-sm text-[#687280]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="accent-panel absolute bottom-[12%] left-[4%] right-[18%] top-[12%] rounded-[32px]" />

            <div className="relative z-10 w-full max-w-[920px]">
              <div className="overflow-hidden rounded-[32px] border border-[#dfd2c4] bg-white shadow-[0_24px_60px_rgba(23,33,43,0.14)]">
                {isLoadingBanner ? (
                  <div className="h-[420px] w-full animate-pulse bg-[var(--color-panel)] md:h-[560px] xl:h-[660px]" />
                ) : bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt="GlamCart homepage banner"
                    className="h-[420px] w-full object-cover md:h-[560px] xl:h-[660px]"
                  />
                ) : (
                  <div className="flex h-[420px] w-full flex-col items-center justify-center bg-[var(--color-panel)] px-6 text-center md:h-[560px] xl:h-[660px]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
                      Admin-managed banner
                    </p>
                    <h3 className="mt-4 text-2xl font-bold text-[var(--color-text)] md:text-3xl">
                      The homepage banner will appear here after admin upload.
                    </h3>
                    <p className="mt-3 max-w-lg text-sm text-[var(--color-muted)] md:text-base">
                      The old hardcoded hero image has been removed. Upload a banner from the admin panel to make this section live.
                    </p>
                  </div>
                )}
              </div>

              {bannerUrl && (
                <>
                  <div className="floating-card absolute bottom-5 left-5 max-w-[240px] p-4 md:bottom-8 md:left-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#885e4a]">Featured pick</p>
                    <p className="mt-2 text-lg font-bold text-[#17212b]">Simple beauty shopping with stronger visuals</p>
                  </div>

                  <div className="floating-card absolute right-4 top-4 p-4 md:right-8 md:top-8">
                    <p className="text-sm text-[#687280]">Used screen space</p>
                    <p className="mt-1 text-2xl font-extrabold text-[#17212b]">Full width</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
