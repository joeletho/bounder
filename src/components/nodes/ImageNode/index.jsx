import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import TestImage from '../../../resources/images/test_image1.png';

function ImageNode(props: NodeProps) {
  const {
    id,
    data,
    selected,
    xPos,
    yPos,
    type,
  } = props;


  return (
    <div>
      <img src={TestImage} alt={`image_${id}`} />
    </div>
  );
}

ImageNode.displaName = 'ImageNode';

export default memo(ImageNode);