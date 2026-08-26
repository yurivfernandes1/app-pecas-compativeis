import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Cropper from 'react-easy-crop';
import { colors } from '../styles/GlobalStyles';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #111;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: white;
    font-size: 1.1rem;
  }

  p {
    margin: 0.2rem 0 0 0;
    font-size: 0.8rem;
    color: #888;
  }
`;

const CropperContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: #000;
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #333;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;

    &.cancel {
      background: transparent;
      color: #ccc;
      border: 1px solid #444;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }

    &.confirm {
      background: ${colors.primary};
      color: white;

      &:hover {
        background: #b91c1c;
      }
    }
  }
`;

interface ImagePositionModalProps {
  imageUrl: string;
  onConfirm: (position: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export default function ImagePositionModal({ imageUrl, onConfirm, onCancel, aspectRatio = 16 / 9 }: ImagePositionModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPercentages, setCroppedAreaPercentages] = useState<any>(null);

  const onCropComplete = useCallback((percentages: any, pixels: any) => {
    setCroppedAreaPercentages(percentages);
  }, []);

  const handleConfirm = () => {
    if (!croppedAreaPercentages) {
      onConfirm('50,50');
      return;
    }

    const w = croppedAreaPercentages.width;
    const h = croppedAreaPercentages.height;
    const x = croppedAreaPercentages.x;
    const y = croppedAreaPercentages.y;

    const rawPosX = w >= 100 ? 50 : Math.round((x / (100 - w)) * 100);
    const rawPosY = h >= 100 ? 50 : Math.round((y / (100 - h)) * 100);

    const posX = Math.min(100, Math.max(0, rawPosX));
    const posY = Math.min(100, Math.max(0, rawPosY));

    onConfirm(`${posX},${posY}`);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <div>
            <h3>Ajustar Enquadramento</h3>
            <p>Arraste a foto para escolher como ela aparecerá no Feed.</p>
          </div>
        </ModalHeader>
        
        <CropperContainer>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
        </CropperContainer>

        <ModalFooter>
          <button className="cancel" onClick={onCancel}>Pular</button>
          <button className="confirm" onClick={handleConfirm}>Confirmar Ajuste</button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
