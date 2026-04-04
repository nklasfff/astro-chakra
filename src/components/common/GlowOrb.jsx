export default function GlowOrb({ color = 'var(--glow-warm)', size = 300, top, left, right, bottom, delay = 0 }) {
  return (
    <div
      style={{
        position: 'fixed',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: 0.25,
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0,
        top, left, right, bottom,
        animation: `drift 20s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}
