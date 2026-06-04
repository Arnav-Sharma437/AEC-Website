import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { BRAND_TAGLINE, CATEGORIES } from "@/data/categories";
import { ctaLinks } from "@/data/branches";
import AecLogo from "@/components/ui/AecLogo";

export default function Footer() {
  const topCategories = CATEGORIES;

  return (
    <footer className="bg-primary text-white dark:bg-[#0a1018]">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <AecLogo size="md" className="mb-4" />
            <p className="mb-2 text-sm leading-relaxed text-white/80">
              {BRAND_TAGLINE}
            </p>
            <p className="mb-4 font-display text-lg font-semibold">
              Alamdaar Engineering Concern
            </p>
            <div className="flex gap-3">
              <a
                href={ctaLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition hover:bg-accent hover:text-primary"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              {ctaLinks.instagram.map((ig) => (
                <a
                  key={ig.handle}
                  href={ig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2 transition hover:bg-accent hover:text-primary"
                  aria-label={ig.label}
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
              ))}
              <a
                href={`https://wa.me/${ctaLinks.whatsapp[0].number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition hover:bg-accent hover:text-primary"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-accent">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-accent">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {topCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="hover:text-accent"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-accent">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>4, I.R. Belilious Lane, Howrah 711101, WB</li>
              <li>
                <a
                  href="mailto:alamdaar.ropeclamps@gmail.com"
                  className="hover:text-accent"
                >
                  alamdaar.ropeclamps@gmail.com
                </a>
              </li>
              <li>+91 9831046296</li>
              <li>GSTIN: 19AFRPA7937G1Z1</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/60">
          © {new Date().getFullYear()} Alamdaar Engineering Concern. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}
