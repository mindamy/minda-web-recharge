import Link from "next/link";

import { NAV_ITEMS } from "@/lib/nav";

import { Logo } from "./Logo";

/**
 * Site footer.
 *
 * NOT IN THE DESIGN DECK. All eight deck pages end at their own content, with
 * no footer anywhere. It is added here because the product carries a
 * "not diagnosis, treatment or cure" disclaimer, and shipping a
 * health-adjacent site with nowhere for that statement — or for privacy and
 * terms — to live would be a real gap rather than a faithful omission.
 *
 * Deliberately restrained, and every string is either lifted from the deck or
 * unavoidable boilerplate. Nothing here invents product copy: the disclaimer
 * is the trust strip's own wording, and the link labels reuse the nav.
 */
export function Footer() {
  return (
    <footer className="border-t border-hairline-faint">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14 sm:px-8 lg:max-w-[1232px] lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label="Recharge — home" className="inline-block rounded-lg">
              <Logo />
            </Link>
            <p className="text-body-sm mt-5 text-ink-500">
              Everyday wellbeing support and reflection, not diagnosis, treatment or cure.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:pt-3">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3 lg:flex lg:gap-9">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-ink-600 transition-colors duration-150 ease-soft hover:text-blue-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline-faint pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-meta text-ink-500">
            &copy; {new Date().getFullYear()} Recharge. All rights reserved.
          </p>
          <ul className="text-meta flex gap-6 text-ink-500">
            <li>
              <Link href="/privacy" className="transition-colors duration-150 hover:text-blue-ink">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors duration-150 hover:text-blue-ink">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
