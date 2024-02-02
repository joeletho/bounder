import { memo} from 'react';
import { Panel } from '@xyflow/react';

const DockPanel = ({ id, className, position, hidden, children, ...rest }) => {
  if (hidden) {
    return null;
  }

  return (
    <Panel position={position} id={id} className={className} {...rest}>
      {children}
    </Panel>
  );
};
export default memo(DockPanel);
