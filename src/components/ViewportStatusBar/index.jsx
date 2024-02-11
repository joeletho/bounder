import { getZoomPercentage } from '../Canvas/utils';
import Button from '../additional-components/Button';
import IconFullScreen from '../../resources/icons/full-screen.png';
import { memo } from 'react';
import useViewport from '../../hooks/useViewport';

function ViewportStatusBar({ className, zoom, minZoom, maxZoom, onFitView, children }) {
  const { mousePosition } = useViewport();

  return (
    <div className={'viewport-footer ' + className}>
      <div style={{ paddingLeft: '10px' }}>|_____ 5nm _____|</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          paddingRight: '5px',
        }}
      >
        <div style={{ paddingRight: '10px' }}>
          X={mousePosition.x.toFixed(2)} Y={mousePosition.y.toFixed(2)} Zoom=
          {`${getZoomPercentage(zoom, minZoom, maxZoom)}%`}
        </div>
        <Button
          onClick={onFitView}
          style={{ marginTop: '0px', border: 'none'}}
          imageStyle={{ width: '20px', height: '20px' }}
          imageUrl={IconFullScreen}
        />
        {children}
      </div>
    </div>
  );
}

export default memo(ViewportStatusBar);
