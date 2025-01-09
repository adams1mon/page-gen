"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorPosition {
  x: number;
  y: number;
}

interface EditorSize {
  width: number;
  height: number;
}

interface EditorPreferences {
  isFloating: boolean;
  position: EditorPosition;
  size: EditorSize;
  setIsFloating: (isFloating: boolean) => void;
  setPosition: (position: EditorPosition) => void;
  setSize: (size: EditorSize) => void;
}

const DEFAULT_POSITION: EditorPosition = {
  x: 10,
  y: 100,
};

const DEFAULT_SIZE: EditorSize = {
  width: 400,
  height: 600,
};

export const useEditorPreferences = create<EditorPreferences>()(
  persist(
    (set) => ({
      isFloating: false,
      position: DEFAULT_POSITION,
      size: DEFAULT_SIZE,
      setIsFloating: (isFloating) => set({ isFloating }),
      setPosition: (position) => set({ position }),
      setSize: (size) => set({ size }),
    }),
    {
      name: 'editor-preferences',
    }
  )
);
