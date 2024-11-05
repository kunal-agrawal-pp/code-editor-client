import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const ResizableLayout = ({ 
  panels = [], 
  direction = "horizontal",
  className = "",
  defaultSizes,
  minSizes,
  maxSizes
}) => {
  // Validate panels array is not empty
  if (!panels.length) {
    return null;
  }

  // Calculate default sizes if not provided
  const calculatedDefaultSizes = defaultSizes || 
    Array(panels.length).fill(Math.floor(100 / panels.length));

  return (
    <ResizablePanelGroup
      direction={direction}
      className={`rounded-lg border ${className}`}
    >
      {panels.map((panel, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ResizableHandle />}
          <ResizablePanel 
            defaultSize={calculatedDefaultSizes[index]}
            minSize={minSizes?.[index]}
            maxSize={maxSizes?.[index]}
          >
            {typeof panel === 'function' ? panel() : panel}
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );
};

// Nested version that supports both horizontal and vertical layouts
const NestedResizableLayout = ({
  panels = [],
  className = "",
  defaultSizes,
  minSizes,
  maxSizes
}) => {
  return (
    <ResizableLayout
      direction="horizontal"
      className={className}
      panels={panels.map((panelGroup, index) => 
        Array.isArray(panelGroup) ? (
          () => (
            <ResizableLayout
              direction="vertical"
              panels={panelGroup}
              defaultSizes={defaultSizes?.[index]}
              minSizes={minSizes?.[index]}
              maxSizes={maxSizes?.[index]}
            />
          )
        ) : panelGroup
      )}
      defaultSizes={defaultSizes}
      minSizes={minSizes}
      maxSizes={maxSizes}
    />
  );
};

export { ResizableLayout, NestedResizableLayout };

// Usage example:
export default () => {
  const panels = [
    <div className="flex h-[200px] items-center justify-center p-6">
      <span className="font-semibold">Panel One</span>
    </div>,
    <div className="flex h-[200px] items-center justify-center p-6">
      <span className="font-semibold">Panel Two</span>
    </div>
  ];

  const nestedPanels = [
    <div className="flex h-[200px] items-center justify-center p-6">
      <span className="font-semibold">Horizontal Panel</span>
    </div>,
    [
      <div className="flex h-full items-center justify-center p-6">
        <span className="font-semibold">Vertical Panel 1</span>
      </div>,
      <div className="flex h-full items-center justify-center p-6">
        <span className="font-semibold">Vertical Panel 2</span>
      </div>
    ]
  ];

  return (
    <div className="space-y-4">
      {/* Simple horizontal layout */}
      <ResizableLayout 
        panels={panels}
        defaultSizes={[30, 70]}
        minSizes={[20, 30]}
        maxSizes={[40, 80]}
      />

      {/* Nested layout with both horizontal and vertical panels */}
      <NestedResizableLayout 
        panels={nestedPanels}
        defaultSizes={[30, 70]}
      />
    </div>
  );
};