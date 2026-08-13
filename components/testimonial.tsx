import type { Dictionary } from "@/lib/i18n";

const AUTHOR = {
  name: "Samuel Rizzon",
  role: "Software Engineer, Delphi",
  /* Their X avatar, downloaded once and self-hosted so this does not depend on
     a third-party avatar proxy at request time. */
  avatar: "/testimonials/samuel-rizzon.jpg",
  post: "https://x.com/samuelrizzondev/status/2085778700960727451",
};

/**
 * Not a card — no fill, no rounded box. It reads as a pull quote, bracketed by
 * a rule above and below.
 */
export function Testimonial({ t }: { t: Dictionary }) {
  return (
    /* Vertical rhythm lives on the wrapper in `app/page.tsx` so all three
       sections share one gap. */
    <section className="px-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* The rules bracket the section, so they stay outside the link. */}
        <hr className="border-t border-border" />

        <a
          href={AUTHOR.post}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {/* `<a>` wraps the whole figure rather than its contents, because
              `<figcaption>` has to stay a direct child of `<figure>`. */}
          <figure>
            {/* Same size, leading and colour as the About paragraphs. */}
            <blockquote className="text-center text-lg leading-[1.65] text-balance text-foreground/90 transition-colors group-hover:text-foreground">
              &ldquo;{t.testimonialQuote}&rdquo;
            </blockquote>

            <figcaption className="mt-6 flex items-center justify-center gap-3">
              {/* Decorative: the name sits right next to it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AUTHOR.avatar}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full"
              />
              <div className="text-left text-base text-foreground">
                {/* Both lines are white, so the weight carries the hierarchy. */}
                <div className="font-medium">{AUTHOR.name}</div>
                <div>{AUTHOR.role}</div>
              </div>
            </figcaption>
          </figure>
        </a>

        <hr className="mt-10 border-t border-border" />
      </div>
    </section>
  );
}
