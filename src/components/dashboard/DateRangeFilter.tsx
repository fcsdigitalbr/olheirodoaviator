import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets = [
  { label: "Hoje", days: 0 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
];

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handlePreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    if (days > 0) {
      from.setDate(from.getDate() - days);
    }
    from.setHours(0, 0, 0, 0);
    onChange({ from, to });
    setOpen(false);
  };

  const handleClear = () => {
    onChange({ from: undefined, to: undefined });
  };

  const displayText = value.from
    ? value.to
      ? `${format(value.from, "dd/MM/yy", { locale: ptBR })} – ${format(value.to, "dd/MM/yy", { locale: ptBR })}`
      : format(value.from, "dd/MM/yyyy", { locale: ptBR })
    : "Período";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Quick presets - show on mobile as horizontal scroll */}
      <div className="flex sm:hidden items-center gap-1 overflow-x-auto pb-1">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset.days)}
            className="flex-shrink-0 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Desktop presets */}
      <div className="hidden sm:flex items-center gap-1">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset.days)}
            className="px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* Calendar picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 px-3 text-xs font-normal gap-2 border-border bg-card hover:bg-accent flex-1 sm:flex-none",
                !value.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span className="truncate">{displayText}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border-border" align="end">
            <Calendar
              mode="range"
              selected={value.from ? { from: value.from, to: value.to } : undefined}
              onSelect={(range) => {
                onChange({ from: range?.from, to: range?.to });
              }}
              numberOfMonths={isMobile ? 1 : 2}
              locale={ptBR}
              disabled={(date) => date > new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Clear button */}
        {value.from && (
          <button
            onClick={handleClear}
            className="h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
