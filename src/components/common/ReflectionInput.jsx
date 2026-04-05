import { useState } from 'react';
import { THEMES } from '../../engine/themes';
import { CHAKRAS } from '../../engine/chakras';
import styles from './ReflectionInput.module.css';

/**
 * Reusable writing input with optional theme tagging.
 * The caller handles the actual save (passes onSave) and provides contextual
 * meta (chakraId, age, spiral, source, sourceMeta).
 */
export default function ReflectionInput({
  placeholder = 'Begin here. A sentence, a word.',
  buttonLabel = 'Keep this',
  onSave,
  minHeight = 120,
}) {
  const [text, setText] = useState('');
  const [themes, setThemes] = useState([]);

  const toggleTheme = (id) => {
    setThemes((current) => {
      if (current.includes(id)) return current.filter((t) => t !== id);
      if (current.length >= 2) return current;
      return [...current, id];
    });
  };

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({ text: text.trim(), themes });
    setText('');
    setThemes([]);
  };

  return (
    <div className={styles.wrap}>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows="4"
        style={{ minHeight: `${minHeight}px` }}
      />
      <div className={styles.themeSection}>
        <span className={styles.themeLabel}>Tag a theme (optional, max 2)</span>
        <div className={styles.themes}>
          {THEMES.map((theme) => {
            const chakra = CHAKRAS.find((c) => c.id === theme.chakraId);
            const isSelected = themes.includes(theme.id);
            const disabled = !isSelected && themes.length >= 2;
            return (
              <button
                key={theme.id}
                type="button"
                className={`${styles.theme} ${isSelected ? styles.themeSelected : ''} ${
                  disabled ? styles.themeDisabled : ''
                }`}
                onClick={() => !disabled && toggleTheme(theme.id)}
                style={
                  isSelected
                    ? { borderColor: chakra.hex, color: chakra.hex }
                    : undefined
                }
              >
                {theme.label}
              </button>
            );
          })}
        </div>
      </div>
      <button
        className={styles.saveBtn}
        onClick={handleSave}
        disabled={!text.trim()}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
