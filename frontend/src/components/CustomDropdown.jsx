import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef} style={{ position: 'relative', zIndex: isOpen ? 2000 : 100 }}>
      <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'var(--color-ink)' }}>
          {value.name}
        </span>
        <ChevronDown size={12} className={`arrow ${isOpen ? 'open' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="dropdown-menu"
          >
            {options.map((option) => (
              <li
                key={option.id}
                className={`dropdown-item ${option.id === value.id ? 'active' : ''}`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px' }}>{option.name}</span>
                {option.id === value.id && <Check size={12} color="var(--color-primary)" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
