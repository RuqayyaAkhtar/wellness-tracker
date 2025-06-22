import React, { useState, useEffect, useRef } from 'react';

const moodOptions = ['😢', '😟', '😐', '😊', '😁'];

export default function EditLogPopup({ field, currentValue, onSave, onClose }) {
  const [value, setValue] = useState(currentValue);
  const [fadeOut, setFadeOut] = useState(false);
  const popupRef = useRef(null);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeWithFade();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        closeWithFade();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trap focus inside popup
  useEffect(() => {
    const focusableElements = popupRef.current?.querySelectorAll('button, input');
    focusableElements?.[0]?.focus();
    const trapFocus = (e) => {
      if (!popupRef.current.contains(e.target)) {
        e.preventDefault();
        focusableElements?.[0]?.focus();
      }
    };
    document.addEventListener('focusin', trapFocus);
    return () => document.removeEventListener('focusin', trapFocus);
  }, []);

  const handleSave = () => {
    if (value === '') return alert('Please enter or select a value');
    onSave(value);
  };

  const closeWithFade = () => {
    setFadeOut(true);
    setTimeout(onClose, 200); // matches fade-out animation
  };

  return (
    <>
      <style>
        {`
          .popup-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.59);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            animation: fadeIn 0.2s forwards;
          }
          .popup-backdrop.fade-out {
            animation: fadeOut 0.2s forwards;
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            to { opacity: 0; }
          }
          .popup-content {
            background: #161445;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            width: 320px;
            text-align: center;
            transform: scale(0.95);
            animation: scaleIn 0.2s forwards;
          }
          @keyframes scaleIn {
            to { transform: scale(1); }
          }
          .popup-buttons button {
            margin: 0 4px;
          }
          .cancel-btn {
            padding: 6px 10px;
          }
        `}
      </style>

      <div
        className={`popup-backdrop ${fadeOut ? 'fade-out' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        <div className="popup-content" ref={popupRef}>
          <h2
            id="popup-title"
            style={{
              fontSize: '18px',
              fontWeight: '500',
              marginBottom: '16px',
              textTransform: 'capitalize',
              color: '#2696FD'
            }}
          >
            Edit {field}
          </h2>

          {field === 'mood' ? (
            <div className="popup-buttons" style={{ marginBottom: '16px' }}>
              {moodOptions.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setValue(m)}
                  style={{
                    fontSize: '24px',
                    padding: '10px',
                    borderRadius: '999px',
                    backgroundColor: value === m ? '#ddd' : 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  aria-label={`Set mood to ${m}`}
                >
                  {m}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${field}`}
              style={{
                padding: '8px',
                width: '100%',
                marginBottom: '16px',
                borderRadius: '6px',
                border: '1px solid  rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0C0A36',
                color: 'white',
                outline: 'none',
              }}
              aria-label={`Enter ${field}`}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={closeWithFade}
              className="cancel-btn"
              style={{
                color: '#2696FD',
                fontSize: '14px',
                backgroundColor: 'transparent',
                border: '1px solid #2696FD',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: '#2696FD',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                border: '1px solid black',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
