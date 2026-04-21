import React from "react";
import { Link } from "react-router-dom";
import { AiFillFacebook, AiFillInstagram, AiFillYoutube, AiOutlineTwitter } from "react-icons/ai";

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: <AiFillFacebook size={20} /> },
  { name: "Twitter", href: "https://twitter.com", icon: <AiOutlineTwitter size={20} /> },
  { name: "Instagram", href: "https://instagram.com", icon: <AiFillInstagram size={20} /> },
  { name: "YouTube", href: "https://youtube.com", icon: <AiFillYoutube size={20} /> },
];

const linkGroups = [
  {
    title: "Shop",
    links: [
      { label: "Products", to: "/products" },
      { label: "Best Selling", to: "/best-selling" },
      { label: "Offers", to: "/events" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", to: "/login" },
      { label: "Create Account", to: "/sign-up" },
      { label: "Profile", to: "/profile" },
      { label: "Track Orders", to: "/profile" },
    ],
  },
  {
    title: "For Sellers",
    links: [
      { label: "Start Selling", to: "/shop-create" },
      { label: "Seller Login", to: "/shop-login" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Messages", to: "/dashboard-messages" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-[#e6ddd2] bg-[#eee4d9]">
      <div className="section-shell py-12">
        <div className="section-frame !bg-[#f9f4ed]">
          <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
            <div>
              <span className="eyebrow !bg-white">GlamCart</span>
              <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight text-[#1f2937] md:text-4xl">
                A wider, calmer storefront for beauty, skincare and everyday essentials.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#6b7280] md:text-[15px]">
                The theme stays clean, but the layout now uses the screen better with larger sections, softer cards and a more premium rhythm across the storefront.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="floating-card px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Layout</p>
                  <p className="mt-1 text-sm font-semibold text-[#1f2937]">Full-width sections</p>
                </div>
                <div className="floating-card px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Theme</p>
                  <p className="mt-1 text-sm font-semibold text-[#1f2937]">Plain warm neutrals</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6ddd2] bg-white text-[#1f2937] transition hover:bg-[#f6f2eb]"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {linkGroups.map((group) => (
              <div key={group.title} className="surface-card-sm p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b7280]">{group.title}</h3>
                <div className="mt-4 flex flex-col gap-3 text-sm text-[#1f2937]">
                  {group.links.map((item) => (
                    <Link key={item.label} to={item.to} className="transition hover:text-[#9b6b53]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="app-divider mt-10" />

          <div className="flex flex-col gap-2 pt-6 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright {new Date().getFullYear()} GlamCart. All rights reserved.</p>
            <p>Beauty, skincare and self-care in a cleaner full-width theme.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
