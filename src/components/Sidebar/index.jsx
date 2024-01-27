import { Controls, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import Button from '../additional-components/Button';
import IconRightArrow from '../../resources/icons/right_arrow.png';
import IconLeftArrow from '../../resources/icons/left_arrow.png';
import IconDoubleRight from '../../resources/icons/double-right.png';
import IconDoubleLeft from '../../resources/icons/double-left.png';
import IconSettings from '../../resources/icons/settings.png';

import '../../styles/sidebar.css';
import '../../styles/mode-selector.css';
import ImageUpload from '../ImageUpload';

const Sidebar = ({ children }) => {
  const reactFlow = useReactFlow();
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState('left');

  function setImage(image) {
    // Find the previous image (if it exists)
    const nodes = reactFlow?.getNodes();
    const index = nodes.findIndex((node) => node.type === 'imageNode');

    let node;
    // Create the new node if not found
    if (index === -1) {
      node = {
        id: '1',
        type: 'imageNode',
        position: { x: 0, y: 0 },
      };
    } else {
      node = nodes.at(index);
      // Remove it and add it again to notify React Flow to update nodes
      nodes.splice(index, 1, node);
    }
    const reader = new FileReader();
    // FileReader handles this asynchronously, so we define the callback to execute once its finished loading
    reader.onload = () => {
      node.data = {
        image: reader.result,
        file: image,
      };
      reactFlow.setNodes([nodes, node]);
    };
    reader.readAsDataURL(image);
  }

  const imageUrl = showSidebar
    ? sidebarPosition === 'right'
      ? IconRightArrow
      : IconLeftArrow
    : sidebarPosition === 'right'
      ? IconLeftArrow
      : IconRightArrow;

  function renderFileLoader() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <text>Upload an Image</text>
        <ImageUpload onChange={setImage} />
      </div>
    );
  }

  function renderSelectorColumn() {
    return (
      <div className={`selector-column ${sidebarPosition}`}>
        <div></div>
        <div className={'canvasview-controls bounder__mode-selector'}>
          <Controls className={'pane-controls'} style={{ left: '-15px' }} />
          <Button
            onClick={() => setSidebarPosition((prev) => (prev === 'left' ? 'right' : 'left'))}
            imageUrl={sidebarPosition === 'right' ? IconDoubleLeft : IconDoubleRight}
            title={sidebarPosition === 'left' ? 'Dock Right' : 'Dock Left'}
          />
          <Button imageUrl={IconSettings} title={'settings'} />
        </div>
      </div>
    );
  }

  return (
    <div id={'bounder__sidebar'} className={`bounder__sidebar ${sidebarPosition}` + (showSidebar ? ' opened' : '')}>
      <Button
        id={'sidebar-activator'}
        className={'button'}
        onClick={() => setShowSidebar(!showSidebar)}
        imageUrl={imageUrl}
        title={showSidebar ? 'Hide Sidebar' : 'Close Sidebar'}
      />
      <div className={`content-container ${sidebarPosition}`}>
        {sidebarPosition === 'right' ? (
          <>
            {renderSelectorColumn()}
            {renderFileLoader()}
          </>
        ) : (
          <>
            {renderFileLoader()}
            {renderSelectorColumn()}
          </>
        )}
      </div>
      {children}
    </div>
  );
};
export default memo(Sidebar);
