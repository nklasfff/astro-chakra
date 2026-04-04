import styles from './GlassCard.module.css';

export default function GlassCard({ children, className = '', onClick, glowColor, style }) {
  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={onClick}
      style={{
        ...style,
        '--card-glow': glowColor || 'transparent',
      }}
    >
      {children}
    </div>
  );
}
