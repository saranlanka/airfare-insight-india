import { useState } from "react";
import { Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function ExplainSimply({ text }: { text: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="gap-2"
      >
        <Lightbulb aria-hidden className="size-4 text-saffron" />
        {open ? t("common.simpleOn") : t("common.simple")}
      </Button>
      {open ? (
        <p className="mt-3 rounded-lg border border-dashed border-saffron/50 bg-saffron/5 p-4 text-sm leading-relaxed text-foreground">
          {text}
        </p>
      ) : null}
    </div>
  );
}
