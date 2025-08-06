import {Popover, PopoverTrigger, PopoverContent} from '@repo/ui/popover';
import {Button} from '@repo/ui/button';
import {Command, CommandItem} from '@repo/ui/command';
import {X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
} from '@repo/ui/form';
import {ProductCategoryEntity} from '@repo/shared/types';
import {api} from "@repo/shared";

export function TagSelectorFormField({form}: { form: any }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [productCategories, setProductCategories] = useState<ProductCategoryEntity[]>([]);

  useEffect(() => {
    api.productCategories
      .findAll()
      .then((categories) => {
        setProductCategories(categories);
      })
      .catch((error) => {
        console.error('Error fetching product categories:', error);
      });
  }, []);

  return (
    <FormField
      control={form.control}
      name="productCategoryIds"
      render={({field}) => {
        const selected = field.value || [];

        const handleSelect = (value: string) => {
          if (selected.includes(value)) return;
          if (selected.length >= 3) return;
          field.onChange([...selected, value]);
          setOpen(false);
        };

        const handleRemove = (value: string) => {
          field.onChange(selected.filter((tag: string) => tag !== value));
        };

        return (
          <div>
            <FormLabel className="mb-2 text-md">Product Categories</FormLabel>
            <FormControl>
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      ref={buttonRef}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      {selected.length > 0
                        ? `${selected.length} selected`
                        : 'Select up to 3 tags'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    style={{width: buttonRef.current?.offsetWidth}}
                    className="p-0 max-h-[300px] overflow-y-auto"
                  >
                    <Command>
                      {productCategories.map((item, index) => (
                        <CommandItem
                          className='text-md'
                          key={item.id}
                          value={item.id}
                          onSelect={() => {
                            handleSelect(item.id || '');
                          }}
                          disabled={selected.includes(item.id)}
                        >
                          {item.name}
                        </CommandItem>
                      ))}
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.map((tagKey: string) => (
                    <div
                      key={tagKey}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      <span>{productCategories.find((item) => item.id === tagKey)?.name || tagKey}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(tagKey)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormMessage/>
          </div>
        );
      }}
    />
  );
}
