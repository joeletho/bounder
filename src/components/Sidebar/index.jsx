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

const Sidebar = ({ children }) => {
  const { reactFlowInstance } = useReactFlow();
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState('left');

  const imageUrl = showSidebar
    ? sidebarPosition === 'right'
      ? IconRightArrow
      : IconLeftArrow
    : sidebarPosition === 'right'
      ? IconLeftArrow
      : IconRightArrow;

  function renderSelectorColumn() {
    return (
      <div className={`selector-column ${sidebarPosition}`}>
        <div></div>
        <div className={'canvasview-controls bounder__mode-selector'}>
          <Controls ref={reactFlowInstance} className={'pane-controls'} style={{ left: '-15px' }} />
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
            <div></div>
          </>
        ) : (
          <>
            <div></div>
            {renderSelectorColumn()}
          </>
        )}
      </div>
      {children}
    </div>
  );
};

export default memo(Sidebar);
