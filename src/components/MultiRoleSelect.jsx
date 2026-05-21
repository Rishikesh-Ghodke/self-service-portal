import { useState, useRef, useId, useCallback, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

export default function MultiRoleSelect({
  options = [],
  value = [],
  onChange,
  label,
  error,
  disabled = false,
  placeholder = 'Select roles...',
  getOptionLabel = (o) => o.name,
  getOptionValue = (o) => o.id,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const selectedOptions = options.filter((o) => value.includes(getOptionValue(o)));

  const filterOptions = (search) =>
    options.filter(
      (o) =>
        !value.includes(getOptionValue(o)) &&
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

  const addRole = (option) => {
    const id = getOptionValue(option);
    if (!value.includes(id)) {
      onChange([...value, id]);
    }
    setHighlightIndex(0);
    inputRef.current?.focus();
  };

  const removeRole = (id) => {
    onChange(value.filter((v) => v !== id));
  };

  const removeLastRole = () => {
    if (value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    const matches = filterOptions(query);
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
          addRole(filtered[highlightIndex]);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        close();
        break;
      }
      case 'Backspace': {
        if (query === '' && value.length > 0) {
          e.preventDefault();
          removeLastRole();
        }
        break;
      }
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  };

  const fieldClass = `relative w-full rounded border bg-white transition-colors ${
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
        <div
          className="flex min-h-[42px] flex-wrap items-center gap-1.5 px-2 py-1.5"
          onClick={() => !disabled && inputRef.current?.focus()}
        >
          {selectedOptions.map((opt) => (
            <span
              key={getOptionValue(opt)}
              className="inline-flex max-w-full items-center gap-1 rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary"
            >
              <span className="truncate">{getOptionLabel(opt)}</span>
              {!disabled && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRole(getOptionValue(opt));
                  }}
                  className="shrink-0 rounded hover:bg-primary/15"
                  aria-label={`Remove ${getOptionLabel(opt)}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
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
            value={query}
            onChange={handleInputChange}
            onFocus={openList}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={selectedOptions.length === 0 ? placeholder : 'Type to search roles...'}
            autoComplete="off"
            className="min-w-[8ch] flex-1 border-0 bg-transparent py-1 text-sm text-text outline-none placeholder:text-text-muted/60 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (open) {
                close();
              } else {
                inputRef.current?.focus();
              }
            }}
            className="shrink-0 p-1 text-text-muted transition-colors hover:text-primary disabled:opacity-50"
            aria-label={open ? 'Close role list' : 'Open role list'}
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
            aria-multiselectable="true"
            className="absolute left-0 right-0 z-30 max-h-44 overflow-y-auto border-t border-border bg-white py-1 shadow-lg"
            style={{ top: '100%' }}
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-text-muted" role="presentation">
                {query.trim()
                  ? 'No matching roles'
                  : value.length === options.length
                    ? 'All roles selected'
                    : 'No roles available'}
              </li>
            ) : (
              filtered.map((option, index) => {
                const isHighlighted = index === highlightIndex;
                return (
                  <li
                    key={getOptionValue(option)}
                    id={`${listId}-option-${index}`}
                    role="option"
                    aria-selected={false}
                  >
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addRole(option)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                        isHighlighted
                          ? 'bg-primary-light text-primary'
                          : 'text-text hover:bg-primary-light'
                      }`}
                    >
                      {getOptionLabel(option)}
                      <Check
                        className={`h-4 w-4 shrink-0 ${isHighlighted ? 'text-primary opacity-100' : 'opacity-0'}`}
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
