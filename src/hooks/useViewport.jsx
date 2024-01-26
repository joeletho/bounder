import { useEffect, useState } from 'react';
import { Viewport, useReactFlow } from '@xyflow/react';

const DEFAULT_MAX_ZOOM = 10;
const DEFAULT_MIN_ZOOM = 1;
const DEFAULT_VIEWPORT_TRANSITION_SPEED = 300;
const DEFAULT_FITVIEW_TRANSITION_SPEED = 200;
const DEFAULT_VIEWPORT_PADDING = 2;
const DEFAULT_FITVIEW_PADDING = 0.1;

export default function useViewport() {
  const reactFlow = useReactFlow();
  const [maxZoom, setMaxZoom] = useState(DEFAULT_MAX_ZOOM);
  const [minZoom, setMinZoom] = useState(DEFAULT_MIN_ZOOM);
  const [viewportTransitionSpeed, setViewportTransitionSpeed] = useState(DEFAULT_VIEWPORT_TRANSITION_SPEED);
  const [fitViewTransitionSpeed, setFitViewTransitionSpeed] = useState(DEFAULT_FITVIEW_TRANSITION_SPEED);
  const [viewportPadding, setViewportPadding] = useState(DEFAULT_VIEWPORT_PADDING);
  const [fitViewPadding, setFitViewPadding] = useState(DEFAULT_FITVIEW_PADDING);

  function getDefaultFitViewOptions() {
    return {
      duration: fitViewTransitionSpeed, minZoom, maxZoom, padding: fitViewPadding, includeHiddenNodes: false,
    };
  }

  function getDefaultSetViewportOptions() {
    return { duration: viewportTransitionSpeed };
  }

  function zoomIn(options) {
    if (typeof options === 'undefined') {
      options = getDefaultFitViewOptions();
    }
    reactFlow?.zoomIn(options);
  }

  function zoomOut(options) {
    if (typeof options === 'undefined') {
      options = getDefaultFitViewOptions();
    }
    reactFlow?.zoomOut(options);
  }

  function getZoom() {
    return reactFlow?.getViewport().zoom;
  }

  function fitView({ nodes, options }) {
    if (typeof options === 'undefined') {
      options = getDefaultFitViewOptions();
    } else {
      if (!options.padding) {
        options.padding = fitViewPadding;
      } else if (!options.duration) {
        options.duration = fitViewTransitionSpeed;
      }
    }
    if (typeof nodes !== 'undefined') {
      options = {
        ...options, nodes,
      };
    }
    reactFlow?.fitView(options);
  }

  function setViewport(viewport: Viewport, duration) {
    if (typeof viewport === 'undefined') return;
    if (typeof duration === 'undefined') {
      duration = getDefaultSetViewportOptions().duration;
    }
    reactFlow?.setViewport(viewport, duration);
  }

  function getViewport() {
    return reactFlow.getViewport();
  }

  const centerViewport = (nodes) => {
    if (typeof nodes === 'undefined') return;

    if (!(Array.isArray(nodes))) {
      nodes = [nodes];
    }
    fitView({ nodes, padding: viewportPadding });
  };

  function screenToFlowPosition(x, y) {
    return reactFlow?.screenToFlowPosition({ x, y });
  }

  return {
    setViewport,
    getViewport,
    zoomIn,
    zoomOut,
    getZoom,
    fitView,
    maxZoom,
    minZoom,
    viewportTransitionSpeed,
    setMaxZoom,
    setMinZoom,
    setViewportTransitionSpeed,
    screenToFlowPosition,
    getDefaultFitViewOptions,
  };
}