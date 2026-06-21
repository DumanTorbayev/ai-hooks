import { useCallback, useMemo, useState } from "react";

export type UploadedFileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
};

export type UseFileUploadOptions = {
  accept?: string[];
  maxFiles?: number;
  maxSizeMB?: number;
};

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [items, setItems] = useState<UploadedFileItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const nextErrors: string[] = [];
      const nextItems = Array.from(files).flatMap((file) => {
        const error = validateFile(file, options);

        if (error) {
          nextErrors.push(error);
          return [];
        }

        return {
          file,
          id: globalThis.crypto?.randomUUID?.() ?? `${file.name}-${file.size}-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
        };
      });

      setErrors(nextErrors);
      setItems((current) => [...current, ...nextItems].slice(0, options.maxFiles));
    },
    [options],
  );

  const addFromInput = useCallback(
    (input: HTMLInputElement) => {
      if (input.files) {
        addFiles(input.files);
      }
    },
    [addFiles],
  );

  const clear = useCallback(() => {
    setItems([]);
    setErrors([]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return useMemo(
    () => ({
      addFiles,
      addFromInput,
      clear,
      errors,
      items,
      remove,
    }),
    [addFiles, addFromInput, clear, errors, items, remove],
  );
}

function validateFile(file: File, options: UseFileUploadOptions) {
  if (options.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
    return `${file.name} is larger than ${options.maxSizeMB} MB.`;
  }

  if (options.accept?.length && !options.accept.some((pattern) => matchesAccept(file, pattern))) {
    return `${file.name} does not match accepted file types.`;
  }

  return null;
}

function matchesAccept(file: File, pattern: string) {
  if (pattern.endsWith("/*")) {
    return file.type.startsWith(pattern.replace("/*", "/"));
  }

  return file.type === pattern || file.name.endsWith(pattern);
}
