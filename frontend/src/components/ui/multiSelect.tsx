import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/components/utils/utils';
import { Button } from '@/components/ui/button';
import { FilterStats } from '@/components/utils/types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ALL_ITEMS_VALUE = '__ALL__';

interface MultiSelectFilterProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  className?: string;
  optionStats?: Record<string, FilterStats>;
}

export function MultiSelectFilter({
  title,
  options,
  selectedValues,
  onSelectionChange,
  className,
  optionStats,
}: MultiSelectFilterProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (value === ALL_ITEMS_VALUE) {
      onSelectionChange([]);
      setOpen(false);
      return;
    }
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelectedValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-auto min-h-[40px]',
            className
          )}
        >
          <div className="flex flex-wrap gap-1 items-center">
            <span className="font-medium">{title}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full md:w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key={ALL_ITEMS_VALUE}
                onSelect={() => handleSelect(ALL_ITEMS_VALUE)}
                className="text-muted-foreground cursor-pointer"
              >
                All {title}
              </CommandItem>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option);
                const stats = optionStats?.[option];
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => handleSelect(option)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 flex-shrink-0',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="truncate">{option}</span>
                    </div>
                    {stats && (
                      <span className="ml-2 text-xs text-muted-foreground flex-shrink-0">
                        {stats.completed}/{stats.total} ({stats.percentage}%)
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
