import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiCheckCircle, FiImage, FiRefreshCw, FiUploadCloud } from "react-icons/fi";
import { server } from "../../server";
import Loader from "../Layout/Loader";

const BannerManager = () => {
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBanner = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const { data } = await axios.get(`${server}/banner/admin-banner`, {
        withCredentials: true,
      });
      setBanner(data?.banner || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load homepage banner");
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result);
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please choose a banner image first");
      return;
    }

    try {
      setIsSaving(true);
      const { data } = await axios.put(
        `${server}/banner/upsert-banner`,
        { image },
        { withCredentials: true }
      );

      setBanner(data?.banner || null);
      setPreview("");
      setImage("");
      toast.success(data?.message || "Homepage banner updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update homepage banner");
    } finally {
      setIsSaving(false);
    }
  };

  const displayImage = preview || banner?.image?.url || "";

  const bannerUpdatedAt = useMemo(() => {
    if (!banner?.updatedAt) {
      return "No banner uploaded yet";
    }

    return new Date(banner.updatedAt).toLocaleString();
  }, [banner]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className="surface-card mb-5">
        <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
          <div>
            <h2 className="text-[22px] font-semibold text-[var(--color-text)] md:text-[26px]">
              Homepage Banner
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Upload the hero banner image shown on the storefront home page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
              style={{
                background: "var(--color-accent-soft)",
                color: "var(--color-accent-strong)",
              }}
            >
              <FiCheckCircle size={14} />
              {banner ? "Banner live" : "Awaiting upload"}
            </span>

            <button type="button" className="btn-secondary" onClick={() => fetchBanner(false)}>
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="surface-card p-5 md:p-6">
          <div className="mb-5">
            <span className="workspace-card-kicker">Banner settings</span>
            <h3 className="mt-3 text-xl font-semibold text-[var(--color-text)]">Upload a new hero image</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Recommended: a wide promotional image with strong focal product visibility.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div
              className="rounded-[28px] border border-dashed p-5"
              style={{
                borderColor: "var(--color-border-strong)",
                background: "var(--color-panel)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: "var(--color-accent-soft)",
                    color: "var(--color-accent-strong)",
                  }}
                >
                  <FiImage size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Storefront hero banner</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    This image replaces the old static homepage hero artwork for all users.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <label htmlFor="banner-upload" className="btn-primary cursor-pointer">
                  <FiUploadCloud size={16} />
                  Choose banner image
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <div className="inline-flex items-center rounded-full border px-3 py-2 text-xs font-medium text-[var(--color-muted)]">
                  Suggested ratio: 16:10 or wider
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border p-4" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
                Current status
              </p>
              <p className="mt-3 text-sm text-[var(--color-text)]">
                Last updated: <span className="font-semibold">{bannerUpdatedAt}</span>
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Uploading a new image will automatically replace the current live banner.
              </p>
            </div>

            <button type="submit" className="btn-primary !w-full" disabled={isSaving}>
              {isSaving ? "Saving banner..." : "Save homepage banner"}
            </button>
          </form>
        </div>

        <div className="surface-card p-5 md:p-6">
          <div className="mb-5">
            <span className="workspace-card-kicker">Live preview</span>
            <h3 className="mt-3 text-xl font-semibold text-[var(--color-text)]">Homepage hero image</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              This preview shows what the hero image area will render on the home page.
            </p>
          </div>

          <div
            className="overflow-hidden rounded-[30px] border bg-white"
            style={{ borderColor: "var(--color-border-strong)" }}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt="Homepage banner preview"
                className="h-[260px] w-full object-cover md:h-[360px] xl:h-[420px]"
              />
            ) : (
              <div
                className="flex h-[260px] flex-col items-center justify-center px-6 text-center md:h-[360px] xl:h-[420px]"
                style={{ background: "var(--color-panel)" }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background: "var(--color-accent-soft)",
                    color: "var(--color-accent-strong)",
                  }}
                >
                  <FiImage size={24} />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-[var(--color-text)]">No banner uploaded</h4>
                <p className="mt-2 max-w-md text-sm text-[var(--color-muted)]">
                  Add a banner image from this admin page and it will appear in the home page hero section.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerManager;
