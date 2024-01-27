import { NodeProps } from '@xyflow/react';
import { memo, useEffect, useState } from 'react';
import TestImage from '../../../resources/images/test_image1.png';

function ImageNode(props: NodeProps) {
  const {
    id, data, selected, xPos, yPos, type,
  } = props;

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (data?.image) {
      setImage(data.image);
    }
  }, [data?.image]);

  if (!data?.image) {
    return;
  }

  return (<div id={id}>
      <img src={image} alt={`image_${id}`} />
    </div>);
}

ImageNode.displaName = 'ImageNode';

export default memo(ImageNode);