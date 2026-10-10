import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Dictionary } from "@/lib/i18n";

type TestimonialId = keyof Dictionary["testimonialQuotes"];

type Author = {
  /** Also the key of the quote's translations in the dictionary. */
  id: TestimonialId;
  name: string;
  role: string;
  /** Their X avatar, downloaded once and self-hosted so this does not depend
      on a third-party avatar proxy at request time. */
  avatar: string;
  post: string;
};

const AUTHORS: Author[] = [
  {
    id: "samuelrizzon",
    name: "Samuel Rizzon",
    role: "Software Engineer, Delphi",
    avatar: "/testimonials/samuelrizzondev.png",
    post: "https://x.com/samuelrizzondev/status/2085778700960727451",
  },
  {
    id: "devcelio",
    name: "Celio Júnior",
    role: "Software Engineer, Nubank",
    avatar: "/testimonials/devcelio.jpg",
    post: "https://x.com/devcelio/status/2100035541118881842",
  },
];

/** An X handle: `@` plus up to 15 letters, digits or underscores. */
const MENTION = /(@\w{1,15})/;

/**
 * Turns every `@handle` in a quote into a link to that profile, the way X
 * itself does, so the copy in the dictionary stays plain text.
 */
function renderMentions(quote: string) {
  return quote.split(MENTION).map((part, index) =>
    // `split` with a capture group puts the matches at the odd indexes.
    index % 2 === 1 ? (
      <a
        key={index}
        href={`https://x.com/${part.slice(1)}`}
        target="_blank"
        rel="noopener noreferrer"
        // Raised above the stretched tweet link so it gets its own clicks.
        className="relative z-10 rounded transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

function Quote({ author, quote }: { author: Author; quote: string }) {
  return (
    /* The tweet link is the author's name, stretched over the whole figure by
       its `::after`. Wrapping the figure in it instead would nest the mention
       links inside another link, which HTML does not allow. */
    <figure className="group relative">
      {/* Same size, leading and colour as the About paragraphs. */}
      <blockquote className="text-center text-lg leading-[1.65] text-balance text-foreground/90 transition-colors group-hover:text-foreground">
        &ldquo;{renderMentions(quote)}&rdquo;
      </blockquote>

      <figcaption className="mt-6 flex items-center justify-center gap-3">
        {/* Decorative: the name sits right next to it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar}
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-full"
        />
        <div className="text-left text-base text-foreground">
          {/* Both lines are white, so the weight carries the hierarchy. */}
          <a
            href={author.post}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-medium outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {author.name}
          </a>
          <div>{author.role}</div>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Not cards — no fill, no rounded boxes. They read as pull quotes, side by
 * side on wide screens and stacked on narrow ones, bracketed by a rule above
 * and below.
 */
export function Testimonial({ t }: { t: Dictionary }) {
  return (
    /* Vertical rhythm lives on the wrapper in `app/page.tsx` so all three
       sections share one gap. */
    <section className="px-6">
      <ScrollReveal className="mx-auto w-full max-w-4xl">
        {/* The rules bracket the section, so they stay outside the quotes. */}
        <hr className="border-t border-border" />

        {/* `auto-fit` gives each quote an equal column whatever their count. */}
        <div className="mt-10 grid gap-12 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:gap-10">
          {AUTHORS.map((author) => (
            <Quote
              key={author.id}
              author={author}
              quote={t.testimonialQuotes[author.id]}
            />
          ))}
        </div>

        <hr className="mt-10 border-t border-border" />
      </ScrollReveal>
    </section>
  );
}
