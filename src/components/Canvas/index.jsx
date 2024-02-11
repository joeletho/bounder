import {
  BackgroundVariant,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  Background,
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
import IconLiveFolder from '../../resources/icons/live-folder.png';
import IconMaps from '../../resources/icons/map.png';
import IconCleanUp from '../../resources/icons/clean-up.png';
import IconGrainSize from '../../resources/icons/polygon-grain.png';
import IconPixelData from '../../resources/icons/table-data.png';

import '../../styles/sidebar.css';
import '../../styles/navbar.css';
import { DockPanelPosition } from '../../types/general';
import Navbar from '../Navbar';
import ImageUploadForm from '../additional-components/ImageUploadForm';
import ViewportStatusBar from '../ViewportStatusBar';

function Canvas({ children }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const {
    screenToFlowPosition,
    minZoom,
    setMinZoom,
    maxZoom,
    setMaxZoom,
    mousePosition,
    zoom,
    setViewportExtent,
    getViewportExtent,
    fitView,
  } = useViewport();
  const { selectorMode, setSelectorMode } = useSelectorMode();

  // TODO: Must have access to ImageNode dimensions to calculate the extent and zoom
  const width = 3523;
  const height = 2028;

  useEffect(() => {
    const padding = {
      x: maxZoom + width * (1 / 2),
      y: maxZoom + height * (1 / 2),
    };

    const extentUpperLeft = [-padding.x, -padding.y];
    const extentLowerRight = [width + padding.x, height + padding.y];
    setViewportExtent([extentUpperLeft, extentLowerRight]);
  }, []);

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

      const position = screenToFlowPosition(event.clientX - initialRadius * zoom, event.clientY - initialRadius * zoom);

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

  const topNavbarButtonStyle = {
    style: {
      display: 'flex',
      flexDirection: 'column',
      border: 'solid lightgray',
      padding: '40px',
      transform: 'rotate(0deg)',
      marginLeft: '20px',
    },
    imageStyle: {
      width: '40px',
      height: '40px',
    },
  };

  function renderFileLoader() {
    return (
      <>
        <ImageUploadForm
          className={'bounder__mode-selector'}
          buttonComponent={Button}
          buttonProps={{
            imageUrl: IconLiveFolder,
            label: 'Open...',
            ...topNavbarButtonStyle,
          }}
          onChange={setImage}
        />
      </>
    );
  }

  console.log('asd');

  return (
    <>
      <div id={'bounder__canvas'} className={'bounder'}>
        <Navbar
          id={'navbar__top'}
          style={{ translate: 0 }}
          className={'top-navbar'}
          position={DockPanelPosition.Top}
          // drawerComponent={Sidebar}
          // drawerPosition={DockPanelPosition.Left}
        >
          {renderFileLoader()}
          <div
            className={'bounder__mode-selector'}
            style={{
              position: 'absolute',
              width: '100%',
              display: 'flex',
              flexGrow: 2,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: -1,
            }}
          >
            <Button id={'button__pixel-data'} imageUrl={IconPixelData} label={'Pixel Data'} {...topNavbarButtonStyle} />
            <Button id={'button__map'} imageUrl={IconMaps} label={'Maps'} {...topNavbarButtonStyle} />
            <Button id={'button__clean-up'} imageUrl={IconCleanUp} label={'Clean Up'} {...topNavbarButtonStyle} />
            <Button id={'button__grain-size'} imageUrl={IconGrainSize} label={'Grain Size'} {...topNavbarButtonStyle} />
          </div>
        </Navbar>
        <Navbar
          id={'navbar__left'}
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
          drawerProps={{
            id: 'sidebar__left',
            className: 'left-sidebar',
          }}
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
          translateExtent={getViewportExtent()}
          onClick={onCanvasClickHandler}
        >
          <Panel position={Position.Top}>
            <ModeSelector />
          </Panel>
          {/*<Controls*/}
          {/*  className={'bounder__mode-selector'}*/}
          {/*  position={Position.Bottom}*/}
          {/*  style={{ display: 'flex', flexDirection: 'row', left: 0 }}*/}
          {/*/>*/}
          <Background variant={BackgroundVariant.Lines} lineWidth={0.5} gap={100} color={'#303030'} />
        </ReactFlow>
        <ViewportStatusBar
          className={'bounder__mode-selector'}
          onFitView={() => fitView(nodes)}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
        />
        <Navbar
          id={'navbar__right'}
          className={'right-navbar'}
          style={{
            borderTop: 'none',
            right: '5.5px',
            top: '3px',
          }}
          buttonId={'button__settings'}
          buttonLabel={'Settings'}
          position={DockPanelPosition.Right}
          drawerComponent={Sidebar}
          drawerPosition={DockPanelPosition.Left}
          drawerProps={{
            id: 'sidebar__right',
            className: 'right-sidebar',
          }}
        />
        <Navbar
          id={'navbar__bottom'}
          className={'bottom-navbar'}
          buttonId={'button__layers'}
          buttonLabel={'Layers'}
          buttonStyle={{ margin: 0 }}
          position={DockPanelPosition.Bottom}
          drawerComponent={Sidebar}
          drawerPosition={DockPanelPosition.Left}
          drawerProps={{
            id: 'sidebar__bottom',
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
