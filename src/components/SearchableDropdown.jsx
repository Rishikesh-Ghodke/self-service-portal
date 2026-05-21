import { useState, useRef, useId, useCallback, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

export default function SearchableDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  disabled = false,
  getOptionLabel = (o) => o.name || o.label,
  getOptionValue = (o) => o.id || o.value,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const selected = options.find((o) => getOptionValue(o) === value);

  const filterOptions = (search) =>
    options.filter((o) =>
      getOptionLabel(o).toLowerCase().includes(search.toLowerCase().trim())
    );

  const filtered = filterOptions(query);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setHighlightIndex(-1);
  }, []);

  useClickOutside(containerRef, close);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex];
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  const handleSelect = (option) => {
    onChange(getOptionValue(option));
    close();
    inputRef.current?.blur();
  };

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    setQuery('');
    const matches = filterOptions('');
    setHighlightIndex(matches.length > 0 ? 0 : -1);
  };

  const handleInputChange = (e) => {
    const next = e.target.value;
    setQuery(next);
    setOpen(true);
    const matches = filterOptions(next);
    setHighlightIndex(matches.length > 0 ? 0 : -1);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!open) {
          openList();
          return;
        }
        setHighlightIndex((i) =>
          i < filtered.length - 1 ? i + 1 : i
        );
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) {
          openList();
          return;
        }
        setHighlightIndex((i) => (i > 0 ? i - 1 : 0));
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (open && highlightIndex >= 0 && filtered[highlightIndex]) {
          handleSelect(filtered[highlightIndex]);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        close();
        inputRef.current?.blur();
        break;
      }
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  };

  const inputDisplayValue = open ? query : selected ? getOptionLabel(selected) : '';

  const fieldClass = `flex w-full items-center gap-1 rounded border bg-white transition-colors ${
    error ? 'border-red-400' : 'border-border'
  } ${
    disabled
      ? 'cursor-not-allowed bg-surface opacity-60'
      : open
        ? 'border-primary ring-1 ring-primary'
        : 'hover:border-primary/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'
  }`;

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={`${listId}-input`}
          className="mb-1.5 block text-sm font-medium text-text"
        >
          {label}
          <span className="text-red-500"> *</span>
        </label>
      )}
      <div className={fieldClass}>
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={!!error}
          aria-activedescendant={
            open && highlightIndex >= 0
              ? `${listId}-option-${highlightIndex}`
              : undefined
          }
          value={inputDisplayValue}
          onChange={handleInputChange}
          onFocus={openList}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={!selected ? placeholder : 'Type to search...'}
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-text outline-none placeholder:text-text-muted/60 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (open) {
              close();
              inputRef.current?.blur();
            } else {
              inputRef.current?.focus();
            }
          }}
          className="shrink-0 px-2 py-2 text-text-muted transition-colors hover:text-primary disabled:opacity-50"
          aria-label={open ? 'Close options' : 'Open options'}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      </div>

      {open && !disabled && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-48 w-full overflow-y-auto rounded border border-border bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-text-muted" role="presentation">
              No matching projects
            </li>
          ) : (
            filtered.map((option, index) => {
              const optVal = getOptionValue(option);
              const isSelected = optVal === value;
              const isHighlighted = index === highlightIndex;
              return (
                <li
                  key={optVal}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                      isHighlighted
                        ? 'bg-primary-light text-primary'
                        : isSelected
                          ? 'bg-primary-light/50 text-primary font-medium'
                          : 'text-text hover:bg-primary-light'
                    }`}
                  >
                    {getOptionLabel(option)}
                    {isSelected && <Check className="h-4 w-4 shrink-0" aria-hidden />}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
