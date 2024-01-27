import { createRef, useState } from 'react';

function ImageUpload({ id, className, onClick, onChange }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = createRef();

  function onChangeHandler(event) {
    const imageFile = event.target.files[0];
    setSelectedFile(imageFile);
    onChange?.(imageFile);
  }

  const onClickHandler = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <input
        type={'file'}
        accept={'.jpg, .jpeg, .png, .gif, .bmp, .svg, .webp'}
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={onChangeHandler}
      />
      <input type={'text'} value={selectedFile ? selectedFile.name : ''} readOnly />
      <button
      style={{
        width: '100px'
      }}
        onClick={onClickHandler}>Choose File</button>
    </div>
  );
}

export default ImageUpload;
