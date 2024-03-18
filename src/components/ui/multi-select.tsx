import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  options: [{ _id: string; name: string }];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  className?: string;
}

const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      selected,
      onChange,
      placeholder,
      className,
      ...props
    }: MultiSelectProps,
    forwardedRef
  ) => {
    const [open, setOpen] = useState(false);

    const handleUnselect = (item: string) => {
      onChange(selected.filter((i) => i !== item));
    };

    return (
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            ref={forwardedRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between background-light800_dark300 ${
              selected.length > 1 ? "h-full p-2" : "h-9 p-4"
            }`}
            onClick={() => setOpen(!open)}
          >
            <div className="flex gap-1 flex-wrap ">
              {selected.length > 0
                ? selected.map((item) => (
                    <Badge
                      variant="secondary"
                      key={item}
                      className="mr-1 mb-1 background-light800_dark300"
                      onClick={() => handleUnselect(item)}
                    >
                      {options.find((option) => item === option._id)?.name}
                      <a
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(item);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => handleUnselect(item)}
                      >
                        <Cross2Icon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </a>
                    </Badge>
                  ))
                : placeholder}
            </div>
            <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
          <Command className={className}>
            <CommandInput placeholder="Pesquisar ..." />
            <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  className="hover:background-light700_dark300"
                  key={option._id}
                  onSelect={() => {
                    onChange(
                      selected.includes(option._id)
                        ? selected.filter((item) => item !== option._id)
                        : [...selected, option._id]
                    );
                    setOpen(true);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option._id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
