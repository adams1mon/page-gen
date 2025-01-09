"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { PropInputs } from "../../component-editor/prop-editor/PropInputs";
import { ComponentInput } from "../../component-editor/component-input/ComponentInput";
import { X, PictureInPicture } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useRef, useState } from "react";
import { useEditorPreferences } from "@/lib/store/editor-preferences";

interface FloatingEditorProps {
  component: ComponentDescriptor;
  onClose: () => void;
  onChange: (component: ComponentDescriptor) => void;
  onDock: () => void;
}

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const HEADER_HEIGHT = 48;
const MARGIN = 20;

function constrainPosition(x: number, y: number, width: number, height: number) {
  const maxX = window.innerWidth - width - MARGIN;
  const maxY = window.innerHeight - height - MARGIN;
  
  return {
    x: Math.min(Math.max(MARGIN, x), maxX),
    y: Math.min(Math.max(MARGIN, y), maxY)
  };
}

function constrainSize(width: number, height: number, x: number, y: number) {
  const maxWidth = window.innerWidth - x - MARGIN;
  const maxHeight = window.innerHeight - y - MARGIN;

  return {
    width: Math.min(Math.max(MIN_WIDTH, width), maxWidth),
    height: Math.min(Math.max(MIN_HEIGHT, height), maxHeight)
  };
}

export function FloatingEditor({ 
  component, 
  onClose, 
  onChange,
  onDock,
}: FloatingEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { position, size, setPosition, setSize } = useEditorPreferences();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Ensure initial position and size are within bounds
  useEffect(() => {
    const constrainedSize = constrainSize(size.width, size.height, position.x, position.y);
    const constrainedPosition = constrainPosition(
      position.x, 
      position.y, 
      constrainedSize.width, 
      constrainedSize.height
    );

    if (constrainedSize.width !== size.width || 
        constrainedSize.height !== size.height) {
      setSize(constrainedSize);
    }
    if (constrainedPosition.x !== position.x || 
        constrainedPosition.y !== position.y) {
      setPosition(constrainedPosition);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editorRef.current && 
          !editorRef.current.contains(event.target as Node) && 
          !isDragging && 
          !isResizing) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, isDragging, isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  // TODO: REFACTOR THIS...
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        const constrained = constrainPosition(
          newPosition.x, 
          newPosition.y, 
          size.width, 
          size.height
        );
        setPosition(constrained);
      }
      
      if (isResizing) {
        const newSize = constrainSize(
          resizeStart.width + (e.clientX - resizeStart.x),
          resizeStart.height + (e.clientY - resizeStart.y),
          position.x,
          position.y
        );
        setSize(newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, position, size, setPosition, setSize]);

  return (
    <div
      ref={editorRef}
      className="fixed z-50 bg-background border rounded-lg shadow-lg overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <div 
        className="flex items-center justify-between p-2 border-b sticky top-0 bg-background cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <span className="font-medium capitalize text-sm my-0 px-2">{component.name} Settings</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onDock} className="h-8 w-8">
            <PictureInPicture className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 overflow-auto" style={{ height: `calc(100% - ${HEADER_HEIGHT}px)` }}>
        <PropInputs
          propsDescriptor={component.propsDescriptor}
          props={component.props}
          onChange={newProps => onChange({ ...component, props: newProps })}
        />
        {component.acceptsChildren && (
          <ComponentInput
            components={component.childrenDescriptors}
            onChange={components => onChange({
              ...component,
              childrenDescriptors: components
            })}
          />
        )}
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
        style={{
          background: 'linear-gradient(135deg, transparent 50%, hsl(var(--border)) 50%)',
        }}
      />
    </div>
  );
}
