import { NotFoundGlitch } from "@/components/motion/not-found/glitch";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/locale";

export default async function NotFound() {
  const { t } = await getDictionary();

  return (
    <main className="flex flex-1 flex-col">
      <NotFoundGlitch
        className="flex-1"
        title={t.notFoundTitle}
        description={t.notFoundDescription}
        homeHref="/"
        homeLabel={t.notFoundHome}
      />
      <SiteFooter />
    </main>
  );
}
