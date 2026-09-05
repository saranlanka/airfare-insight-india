import { Link } from "@tanstack/react-router";
import { Menu, PlaneTakeoff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GlobalSearch } from "@/components/global-search";
import { PrototypeBadges } from "@/components/prototype-badges";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LANGUAGES, useI18n, type LangCode, type TKey } from "@/lib/i18n";

const NAV: { to: string; key: TKey }[] = [
  { to: "/", key: "nav.dashboard" },
  { to: "/routes", key: "nav.routes" },
  { to: "/calculator", key: "nav.calculator" },
  { to: "/pipeline", key: "nav.pipeline" },
  { to: "/ai", key: "nav.ai" },
  { to: "/methodology", key: "nav.methodology" },
  { to: "/about", key: "nav.about" },
];

function LanguageSelect() {
  const { lang, setLang, t } = useI18n();
  return (
    <Select
      value={lang}
      onValueChange={(v) => {
        setLang(v as LangCode);
        toast.success(t("toast.lang"));
      }}
    >
      <SelectTrigger className="h-9 w-[132px]" aria-label={t("lang.label")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.native}
            {l.full ? "" : " · EN"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SiteHeader() {
  const { t, isFull } = useI18n();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="tricolour-rule h-1 w-full" aria-hidden />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label={t("app.name")}>
          <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <PlaneTakeoff aria-hidden className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-base font-semibold leading-tight">
              {t("app.name")}
            </span>
            <span className="block text-[11px] text-muted-foreground">{t("app.ps")}</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <PrototypeBadges className="hidden xl:flex" />
          <GlobalSearch />
          <LanguageSelect />
          <Sheet open={openMenu} onOpenChange={setOpenMenu}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="min-h-11 min-w-11 lg:hidden"
                aria-label={t("nav.menu")}
              >
                <Menu aria-hidden className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{t("app.name")}</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4 pb-6">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpenMenu(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "bg-muted font-semibold text-primary" }}
                    className="rounded-md px-3 py-3 text-sm"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <PrototypeBadges className="mt-4" />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="mx-auto hidden max-w-7xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6 lg:flex"
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{
              className: "bg-primary/10 text-primary font-semibold",
            }}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted"
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>

      {!isFull ? (
        <p className="border-t border-border bg-muted px-4 py-1.5 text-center text-[11px] text-muted-foreground sm:px-6">
          {t("lang.partial")}
        </p>
      ) : null}
    </header>
  );
}
