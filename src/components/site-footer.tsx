import { Link } from "@tanstack/react-router";

import { PrototypeBadges } from "@/components/prototype-badges";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="tricolour-rule h-1 w-full" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-sm font-semibold">{t("app.name")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("app.tagline")}</p>
          <PrototypeBadges className="mt-3" />
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          <Link to="/methodology" className="text-muted-foreground hover:text-foreground">
            {t("nav.methodology")}
          </Link>
          <Link to="/pipeline" className="text-muted-foreground hover:text-foreground">
            {t("nav.pipeline")}
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground">
            {t("nav.about")}
          </Link>
        </nav>
        <div className="text-sm text-muted-foreground">
          <p>{t("footer.rights")}</p>
          <p className="mt-2 font-medium text-foreground">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
