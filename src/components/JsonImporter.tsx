import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, X } from 'lucide-react';
import { validateRouteJson } from '../utils/routeUtils';
import type { RawRouteData } from '../types/route';
import { SAMPLE_ROUTE_DATA } from '../data/sampleRoute';

interface JsonImporterProps {
  onLoadRoute: (data: RawRouteData) => void;
  isOpen?: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

export const JsonImporter: React.FC<JsonImporterProps> = ({
  onLoadRoute,
  isOpen = true,
  onClose,
  canClose = false,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessRawText = (text: string) => {
    setErrorMessage(null);
    if (!text.trim()) {
      setErrorMessage('Please paste or upload JSON route data.');
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const validation = validateRouteJson(parsed);

      if (!validation.valid) {
        setErrorMessage(validation.error);
        return;
      }

      onLoadRoute(validation.data);
      if (onClose) onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format.';
      setErrorMessage(`JSON Syntax Error: ${msg}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      handleProcessRawText(content);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setJsonText(content);
        handleProcessRawText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSample = () => {
    setErrorMessage(null);
    onLoadRoute(SAMPLE_ROUTE_DATA);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative">
        {canClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Load Delivery Route
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload your route JSON file or paste the route data below.
          </p>
        </div>

        {/* Quick Sample Route Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleLoadSample}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Sample Tour 1510 (51 Deliveries)</span>
          </button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">
                Or upload your own JSON
              </span>
            </div>
          </div>
        </div>

        {/* Drag and Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Click to select or drag & drop a .json file
          </p>
          <p className="text-xs text-slate-400 mt-1">Supports standard delivery route format</p>
        </div>

        {/* Textarea Paste */}
        <div className="mt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Or Paste JSON Directly
          </label>
          <textarea
            rows={4}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{ "route": { "Tour": "1510" }, "entries": [...] }'
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs sm:text-sm animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Validation Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex items-center justify-end gap-3">
          {canClose && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => handleProcessRawText(jsonText)}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md active:scale-95 transition-all"
          >
            Start Route
          </button>
        </div>
      </div>
    </div>
  );
};
