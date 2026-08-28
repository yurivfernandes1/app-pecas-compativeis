import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectHeader = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  padding: 0.6rem 1rem;
  background: #1a1a1a;
  border: 1px solid ${props => props.$isOpen ? colors.primary : '#333'};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  
  &:hover {
    border-color: ${colors.primary};
  }

  i {
    transition: transform 0.3s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    color: ${colors.gray[400]};
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 100;
  box-shadow: 0 10px 25px rgba(0,0,0,0.8);
  
  /* Scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #111;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ListItem = styled.li<{ $isSelected: boolean }>`
  padding: 0.8rem 1rem;
  cursor: pointer;
  color: ${props => props.$isSelected ? colors.primary : '#ccc'};
  background: ${props => props.$isSelected ? 'rgba(220, 38, 38, 0.1)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #222;
  }
`;

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = "Selecione..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SelectContainer ref={dropdownRef}>
      <SelectHeader $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : <span style={{color: '#666'}}>{placeholder}</span>}</span>
        <i className="fas fa-chevron-down"></i>
      </SelectHeader>
      
      {isOpen && (
        <DropdownList>
          {options.map(option => (
            <ListItem 
              key={option.value} 
              $isSelected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
              {option.value === value && <i className="fas fa-check" style={{ fontSize: '0.8rem' }}></i>}
            </ListItem>
          ))}
        </DropdownList>
      )}
    </SelectContainer>
  );
};

export default CustomSelect;
