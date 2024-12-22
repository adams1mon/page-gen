"use client";

import { useState, useCallback } from 'react';

export function useInlineEdit<T>(initialValue: T, onSave: (value: T) => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<T>(initialValue);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
    onSave(value);
  }, [value, onSave]);

  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  return {
    isEditing,
    value,
    startEditing,
    stopEditing,
    handleChange
  };
}