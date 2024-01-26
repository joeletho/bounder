import { Background, BackgroundVariant, ReactFlow, ReactFlowProvider, useNodesState } from '@xyflow/react';
import { memo, useEffect } from 'react';
import useViewport from '../../hooks/useViewport';
import { nodeTypes } from '../component-types';
import Sidebar from '../Sidebar';
import '../../styles/bounder.css';
import '../../resources/images/test_image1.png';

const initialNode = {
  id: 'test1',
  type: 'imageNode',
  position: {
    x: 0,
    y: 0,
  },
};

function Canvas({ children }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([initialNode]);
  const { minZoom, setMinZoom, maxZoom, setMaxZoom, fitView } = useViewport();

  // TODO: Must have access to ImageNode dimensions to calculate the extent and zoom
  const width = 3523;
  const height = 2028;

  const padding = {
    x: ((maxZoom / 6) * (width * (1 / 2))) / 2,
    y: ((maxZoom / 6) * (height * (1 / 2))) / 2,
  };

  const extentUpperLeft = [-padding.x, -padding.y];
  const extentLowerRight = [width + padding.x, height + padding.y];

  useEffect(() => {
    //TODO: This should be moved to a function that gets called on only two occasions:
    //  1. A new image is added to the nodes (meaning the old image is replaced)
    //  2. The user selects an option to center the image in the viewport.
    fitView(nodes, { duration: 0 });
  }, [nodes]);

  function onInit() {
    // The zoom is set such that it allows a full view of the image plus some extra.
    // Removes the unnecessary ability to zoom too far out.
    const zoom = Math.abs(1.05 - (width + height) / Math.sqrt(width * width + height * height));
    setMinZoom(zoom);
    setMaxZoom(20);
  }

  return (
    <div id={'bounder__canvas'} className={'bounder'}>
      <Sidebar />
      <ReactFlow
        // className={'dark'}
        onInit={onInit}
        fitView={true}
        nodes={nodes}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        onNodesChange={onNodesChange}
        maxZoom={maxZoom}
        minZoom={minZoom}
        translateExtent={[extentUpperLeft, extentLowerRight]}
      >
        <Background variant={BackgroundVariant.Lines} lineWidth={'0.5'} gap={50} color={'#303030'} />
      </ReactFlow>

      {children}
    </div>
  );
}

function CanvasView({ children }) {
  return (
    <ReactFlowProvider>
      <Canvas>{children}</Canvas>
    </ReactFlowProvider>
  );
}

CanvasView.displayName = 'CanvasView';

export default memo(CanvasView);
