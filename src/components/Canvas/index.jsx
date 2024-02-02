import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
} from '@xyflow/react';
import { memo, useEffect } from 'react';
import useViewport from '../../hooks/useViewport';
import { nodeTypes } from '../component-types';
import Sidebar from '../Sidebar';
import '../../styles/bounder.css';
import '../../resources/images/test_image1.png';
import SelectorModeProvider from '../SelectorModeProvider';
import useSelectorMode from '../../hooks/useSelectorMode';
import { SelectorModes } from '../../utils/selector-modes';
import ModeSelector from '../additional-components/ModeSelector';
import Button from '../additional-components/Button';
import IconSettings from '../../resources/icons/settings.png';
import IconLiveFolder from '../../resources/icons/live-folder.png';

import '../../styles/sidebar.css';
import '../../styles/navbar.css';
import { DockPanelPosition } from '../../types/general';
import Navbar from '../Navbar';
import ImageUploadForm from '../additional-components/ImageUploadForm';

const initialNode = {
  id: 'test1',
  type: 'imageNode',
  position: {
    x: 0,
    y: 0,
  },
};

function Canvas({ children }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const { screenToFlowPosition, minZoom, setMinZoom, maxZoom, setMaxZoom, getZoom } = useViewport();
  const { selectorMode, setSelectorMode } = useSelectorMode();

  // TODO: Must have access to ImageNode dimensions to calculate the extent and zoom
  const width = 3523;
  const height = 2028;

  const padding = {
    x: maxZoom * (width * (1 / 2)),
    y: maxZoom * (height * (1 / 2)),
  };

  const extentUpperLeft = [-padding.x, -padding.y];
  const extentLowerRight = [width + padding.x, height + padding.y];

  useEffect(() => {
    //TODO: This should be moved to a function that gets called on only two occasions:
    //  1. A new image is added to the nodes (meaning the old image is replaced)
    //  2. The user selects an option to center the image in the viewport.
    // fitView(nodes, { duration: 0 });
  }, [nodes]);

  function onInit() {
    // The zoom is set such that it allows a full view of the image plus some extra.
    // Removes the unnecessary ability to zoom too far out.
    const zoom = Math.abs(1.5 - (width + height) / Math.sqrt(width * width + height * height));
    setMinZoom(zoom);
    setMaxZoom(20);
  }

  function onCanvasClickHandler(event) {
    if (selectorMode === SelectorModes.AddEllipse) {
      // Deselect any selected nodes
      const prevNodes = nodes.map((node) => {
        return {
          ...node,
          selected: false,
        };
      });

      // Make the new ellipse node
      const initialWidth = 100;
      const initialHeight = 100;
      const initialRadius = initialWidth / 2;

      const position = screenToFlowPosition(
        event.clientX - initialRadius * getZoom(),
        event.clientY - initialRadius * getZoom()
      );

      const ellipse = {
        id: `ellipse_${nodes.length}`,
        type: 'ellipseNode',
        position,
        data: {
          initialWidth,
          initialHeight,
        },
        selected: true,
        draggable: true,
      };

      setNodes([...prevNodes, ellipse]);
    }
  }

  function setImage(image) {
    // Find the previous image (if it exists)
    const index = nodes.findIndex((node) => node.type === 'imageNode');

    let node;
    if (index === -1) {
      // Create the new node if not found
      node = {
        id: 'imageNode_1',
        type: 'imageNode',
        position: { x: 0, y: 0 },
        selectable: false,
        focusable: true,
        draggable: false,
        deletable: false,
      };
    } else {
      // Remove it from the collections. When it's added back later, React Flow will be notified to update the state
      node = nodes.at(index);
      nodes.splice(index, 1, node);
    }

    const reader = new FileReader();
    // FileReader handles this asynchronously, so we define the callback to execute once its finished loading
    reader.onload = () => {
      node.data = {
        image: reader.result,
        file: image,
      };
      setNodes([...nodes, node]);
    };
    reader.readAsDataURL(image);
  }

  function renderFileLoader() {
    return (
      <>
        <ImageUploadForm
          className={'bounder__mode-selector'}
          buttonComponent={Button}
          buttonProps={{
            imageUrl: IconLiveFolder,
            imageStyle: {
              width: '40px',
              height: '40px',
            },
            label: 'Open...',
            style: {
              display: 'flex',
              flexDirection: 'column',
              border: 'solid lightgray',
              padding: '30px',
              transform: 'rotate(0deg)',
              marginLeft: '20px',
            },
          }}
          onChange={setImage}
        />
      </>
    );
  }

  return (
    <>
      <div id={'bounder__canvas'} className={'bounder'}>
        <Navbar
          id={'layers-navbar'}
          style={{ translate: 0 }}
          className={'top-navbar'}
          position={DockPanelPosition.Top}
          // drawerComponent={Sidebar}
          // drawerPosition={DockPanelPosition.Left}
        >
          {renderFileLoader()}
        </Navbar>
        <Navbar
          id={'project-navbar'}
          className={'left-navbar'}
          style={{
            borderTop: 'none',
            top: '3px',
          }}
          buttonId={'button__project'}
          buttonLabel={'Project'}
          position={DockPanelPosition.Left}
          drawerComponent={Sidebar}
          drawerPosition={DockPanelPosition.Right}
          drawerProps={{ className: 'left-sidebar' }}
        />
        <ReactFlow
          className={'viewport'} // className={'dark'}
          onInit={onInit}
          fitView={true}
          nodes={nodes}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          onNodesChange={onNodesChange}
          maxZoom={maxZoom}
          minZoom={minZoom}
          translateExtent={[extentUpperLeft, extentLowerRight]}
          onClick={onCanvasClickHandler}
        >
          <Panel position={Position.Top}>
            <ModeSelector />
          </Panel>
          <Controls
            className={'bounder__mode-selector'}
            position={Position.Bottom}
            style={{ display: 'flex', flexDirection: 'row', left: 0 }}
          />
          <Background variant={BackgroundVariant.Lines} lineWidth={'0.5'} gap={100} color={'#303030'} />
        </ReactFlow>
        <Navbar
          id={'settings-navbar'}
          className={'right-navbar'}
          style={{
            borderTop: 'none',
            right: '6px',
            top: '3px',
          }}
          buttonId={'button__settings'}
          buttonLabel={'Settings'}
          position={DockPanelPosition.Right}
          drawerComponent={Sidebar}
          drawerPosition={DockPanelPosition.Left}
          drawerProps={{ className: 'right-sidebar' }}
        />
        <Navbar
          id={'layers-navbar'}
          className={'bottom-navbar'}
          buttonId={'button__layers'}
          buttonLabel={'Layers'}
          buttonStyle={{ margin: 0 }}
          position={DockPanelPosition.Bottom}
          drawerComponent={Sidebar}
          drawerPosition={DockPanelPosition.Left}
          drawerProps={{
            className: 'bottom-sidebar',
          }}
        />
        <div className={'footer'} style={{ textAlign: 'left', padding: '2px' }}>
          <label style={{ fontSize: 'small' }}>Status: Ready</label>
        </div>
        {children}
      </div>
    </>
  );
}

function CanvasView({ children }) {
  return (
    <ReactFlowProvider>
      <SelectorModeProvider>
        <Canvas>{children}</Canvas>
      </SelectorModeProvider>
    </ReactFlowProvider>
  );
}

CanvasView.displayName = 'CanvasView';

export default memo(CanvasView);
