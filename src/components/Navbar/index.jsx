import { memo, useState } from 'react';
import DockPanel from '../../containers/DockPanel';
import Button from '../additional-components/Button';

import '../../styles/navbar.css';
import '../../styles/bounder.css';
import { Panel } from '@xyflow/react';
import { DockPanelPosition } from '../../types/general';

function Navbar({
  id,
  buttonId,
  buttonLabel,
  buttonStyle,
  className,
  position,
  style,
  drawerComponent: DockPanel,
  drawerPosition,
  drawerProps,
  children,
}) {
  const [currentButtonId, setCurrentButtonId] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  function selectButtonById(event) {
    const id = event.target.id;
    document.getElementById(currentButtonId)?.classList.toggle('select', false);

    if (currentButtonId === id) {
      setCurrentButtonId(null);
      setShowDrawer(false);
      return;
    }

    document.getElementById(id).classList.toggle('select', true);
    setCurrentButtonId(id);
    setShowDrawer(true);
  }

  if (position) {
    if (position === DockPanelPosition.Bottom || position === DockPanelPosition.Top) {
      style = {
        ...style,
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        alightItems: 'center',
      };
      buttonStyle = {
        ...buttonStyle,
        transform: 'rotate(0deg)',
      };
    }
  }

  function renderPanel() {
    return (
      <Panel id={id} position={position} className={'bounder__navbar ' + className} style={style}>
        {buttonLabel && (
          <Button
            id={buttonId}
            className={'bounder__mode-selector'}
            onClick={selectButtonById}
            label={buttonLabel}
            style={buttonStyle}
          />
        )}
        {children}
      </Panel>
    );
  }

  if (!DockPanel) {
    return <>{renderPanel()}</>;
  }

  if (drawerPosition && drawerPosition === DockPanelPosition.Left) {
    return (
      <>
        <DockPanel hidden={showDrawer} {...drawerProps} />
        {renderPanel()}
      </>
    );
  }

  return (
    <>
      {renderPanel()}
      <DockPanel hidden={showDrawer} {...drawerProps} />
    </>
  );
}

export default memo(Navbar);
