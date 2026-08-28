import React from 'react';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import { formatPoints } from '../utils/superTrunfo';

const CardWrapper = styled.div<{ $ratio: '9:16' | '4:5' }>`
  width: ${props => props.$ratio === '9:16' ? '900px' : '1080px'};
  height: ${props => props.$ratio === '9:16' ? '1600px' : '1350px'};
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: -9999px; /* Hide from screen */
`;

const CardBody = styled.div<{ $ratio: '9:16' | '4:5' }>`
  width: 900px;
  height: 1600px;
  background-color: #000;
  position: relative;
  font-family: 'Inter', Arial, sans-serif;
  overflow: hidden;
  box-shadow: ${props => props.$ratio === '9:16' ? 'none' : '0 0 50px rgba(0,0,0,0.8)'};
  ${props => props.$ratio === '4:5' && `
    transform: scale(0.84375);
    transform-origin: center center;
  `}
`;

const MolduraOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/galeria/carta.png');
  background-size: 100% 100%;
  background-position: center;
  z-index: 5;
  pointer-events: none;
`;

const PhotoContainer = styled.div<{ $url?: string; $pos?: string }>`
  position: absolute;
  top: 130px;
  left: 0;
  width: 100%;
  height: 845px;
  overflow: hidden;
  z-index: 1; /* A foto vai atrás da moldura transparente */
  background-color: #111;
  ${props => props.$url && `
    background-image: url("${props.$url}");
    background-size: cover;
    background-position: ${props.$pos || '50% 65%'};
    background-repeat: no-repeat;
  `}
`;

const DynamicContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
`;

const HeaderGroup = styled.div`
  position: absolute;
  top: 34px;
  left: 260px;
  right: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
`;

const Title = styled.h1`
  color: #fff;
  font-family: 'Volkswagen-Serial', 'Volkswagen', 'Futura', sans-serif;
  font-size: 4.2rem;
  line-height: 1.05;
  margin: 0;
  text-transform: uppercase;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.85);
  white-space: nowrap;
  letter-spacing: 1.5px;
  
  span {
    color: #fff;
    margin-left: 10px;
  }
`;

const OwnerTag = styled.div`
  color: #d1d5db;
  font-family: 'Volkswagen-Serial', 'Volkswagen', 'Inter', Arial, sans-serif;
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-top: 3px;
  text-shadow: 1px 1px 5px rgba(0,0,0,0.9);
  text-transform: uppercase;
  opacity: 0.95;
`;

const PlacaPretaTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f0f0f;
  color: #f3f4f6;
  border: 1.5px solid #d4af37;
  padding: 4px 12px;
  border-radius: 4px;
  font-family: 'Volkswagen-Serial', 'Volkswagen', 'Inter', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-top: 6px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.85);
  width: fit-content;
`;

const LogoContainer = styled.div`
  width: 155px;
  height: 155px;
  position: absolute;
  top: 185px;
  right: 35px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 6px 25px rgba(0,0,0,0.9);
  border: 3px solid rgba(220, 38, 38, 0.85);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* Os valores posicionados exatamente em cada linha da moldura carta.png */
const ValueRow = styled.div`
  color: #fff;
  font-size: 3.2rem;
  font-weight: 900;
  position: absolute;
  right: 75px;
  width: 140px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-family: 'Inter', Arial, sans-serif;
  letter-spacing: -1px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
`;

const ValTotal = styled(ValueRow)`
  top: 1016px;
  color: #ffd700;
`;
const ValHP = styled(ValueRow)`
  top: 1091px;
`;
const ValMotor = styled(ValueRow)`
  top: 1163px;
`;
const ValSuspensao = styled(ValueRow)`
  top: 1231px;
`;
const ValPecas = styled(ValueRow)`
  top: 1307px;
`;
const ValRodas = styled(ValueRow)`
  top: 1381px;
`;
const ValOpcionais = styled(ValueRow)`
  top: 1453px;
`;

interface SuperTrunfoCardProps {
  id: string;
  carName: string;
  ownerUsername?: string;
  photoUrl: string;
  ratio: '9:16' | '4:5';
  hp?: number | string;
  placaPreta?: boolean;
  points: {
    motor: number;
    suspensao: number;
    pecas: number;
    opcionais: number;
    rodas: number;
    versao?: number;
    placa_preta?: number;
    total: number;
  };
}

export const exportSuperTrunfoCard = async (elementId: string, carName: string, ownerUsername?: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Garante que a fonte oficial Volkswagen esteja carregada no canvas
  try {
    if (document.fonts) {
      await Promise.all([
        document.fonts.load("700 4.2rem 'Volkswagen-Serial'"),
        document.fonts.load("700 4.2rem 'Volkswagen'"),
        document.fonts.ready
      ]);
    }
  } catch (e) {
    console.warn('Font load error:', e);
  }

  const is916 = elementId.includes('169') || elementId.includes('16-9') || elementId.includes('stories');
  const scale = is916 ? 1.2 : 1;

  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    backgroundColor: '#000',
  });

  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return;

  const cleanCar = carName.toLowerCase().startsWith('golf') ? carName : `Golf-${carName}`;
  const carSlug = cleanCar.trim().replace(/\s+/g, '-');
  const userSlug = ownerUsername ? `-${ownerUsername.replace(/^@/, '').trim().replace(/\s+/g, '-')}` : '';

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `SuperTrunfo-${carSlug}${userSlug}.png`;
  link.href = objectUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};

export default function SuperTrunfoCard({ id, carName, ownerUsername, photoUrl, ratio, points, hp, placaPreta }: SuperTrunfoCardProps) {
  const getPosition = (url: string) => {
    if (!url) return '50% 65%';
    const match = url.match(/[?&]pos=([\d.]+),([\d.]+)/);
    if (match) {
      return `${match[1]}% ${match[2]}%`;
    }
    return '50% 65%';
  };

  const pos = getPosition(photoUrl);
  const cleanUsername = ownerUsername ? ownerUsername.replace(/^@/, '') : '';
  const displayHP = (hp !== undefined && hp !== null && String(hp).trim() !== '' && String(hp).trim() !== '0' && String(hp).trim() !== '-') 
    ? String(hp) 
    : '-';

  return (
    <CardWrapper id={id} $ratio={ratio}>
      <CardBody $ratio={ratio}>
        <PhotoContainer $url={photoUrl} $pos={pos}>
          {photoUrl && (
            <img
              src={photoUrl}
              alt="Carro"
              crossOrigin="anonymous"
              style={{ opacity: 0, position: 'absolute', pointerEvents: 'none', width: '1px', height: '1px' }}
            />
          )}
        </PhotoContainer>

        <MolduraOverlay />

        <DynamicContent>
          <HeaderGroup>
            <Title>
              GOLF <span>{carName.toUpperCase() === 'GTI' ? <strong style={{ color: '#dc2626' }}>GTI</strong> : carName}</span>
            </Title>
            {cleanUsername && (
              <OwnerTag>@{cleanUsername}</OwnerTag>
            )}
            {placaPreta && (
              <PlacaPretaTag>⬛ PLACA PRETA</PlacaPretaTag>
            )}
          </HeaderGroup>

          <LogoContainer>
            <img src="https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png" alt="Falando de GTI" crossOrigin="anonymous" />
          </LogoContainer>

          <ValTotal>{formatPoints(points.total)}</ValTotal>
          <ValHP>{displayHP}</ValHP>
          <ValMotor>{formatPoints(points.motor)}</ValMotor>
          <ValSuspensao>{formatPoints(points.suspensao)}</ValSuspensao>
          <ValPecas>{formatPoints(points.pecas)}</ValPecas>
          <ValRodas>{formatPoints(points.rodas)}</ValRodas>
          <ValOpcionais>{formatPoints(points.opcionais)}</ValOpcionais>
        </DynamicContent>
      </CardBody>
    </CardWrapper>
  );
}
