'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, UserPlus, X, User } from 'lucide-react';
import { Database } from '@/lib/database.types';

type ClientRow = Database['public']['Tables']['clients']['Row'];

interface ClientComboboxProps {
  clients: ClientRow[];
  selectedClientId: string;
  customClientName: string;
  onChange: (clientId: string, customName: string) => void;
  placeholder?: string;
  className?: string;
}

export function ClientCombobox({
  clients,
  selectedClientId,
  customClientName,
  onChange,
  placeholder = "Sélectionner ou saisir un client...",
  className
}: ClientComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial or prop-changed client value to input text
  useEffect(() => {
    if (selectedClientId) {
      const selected = clients.find(c => c.id === selectedClientId);
      if (selected) {
        setInputValue(selected.name);
        return;
      }
    }
    setInputValue(customClientName || '');
  }, [selectedClientId, customClientName, clients]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(inputValue.toLowerCase()))
  );

  const hasExactMatch = clients.some(
    c => c.name.toLowerCase().trim() === inputValue.toLowerCase().trim()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);

    // Check if the typed value matches an existing client's name exactly
    const exactClient = clients.find(
      c => c.name.toLowerCase().trim() === val.toLowerCase().trim()
    );

    if (exactClient) {
      onChange(exactClient.id, exactClient.name);
    } else {
      onChange('', val);
    }
  };

  const handleSelectClient = (client: ClientRow) => {
    setInputValue(client.name);
    onChange(client.id, client.name);
    setIsOpen(false);
  };

  const handleSelectCustom = () => {
    onChange('', inputValue);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange('', '');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-16 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Effacer"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:text-slate-600 transition-colors"
          >
            <ChevronDown size={16} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in-50 zoom-in-95 duration-150">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => {
              const isSelected = client.id === selectedClientId;
              return (
                <div
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
                    isSelected ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium">{client.name}</span>
                    {client.email && (
                      <span className="truncate text-xs text-slate-400">{client.email}</span>
                    )}
                  </div>
                  {isSelected && <Check size={16} className="text-blue-600 shrink-0 ml-2" />}
                </div>
              );
            })
          ) : (
            <div className="p-2 text-xs text-slate-400 text-center">
              Aucun client existant ne correspond.
            </div>
          )}

          {inputValue.trim() !== '' && !hasExactMatch && (
            <div
              onClick={handleSelectCustom}
              className="flex items-center gap-2 border-t border-slate-100 mt-1 pt-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
            >
              <UserPlus size={16} className="shrink-0" />
              <span className="truncate">Utiliser &quot;{inputValue.trim()}&quot; (Nouveau client)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
