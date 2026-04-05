import { NavLink } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getChakraPhase } from '../../engine/chakraPhase';
import { calculateAge } from '../../utils/dateUtils';
import styles from './BottomNav.module.css';

const tabs = [
  { path: '/home', label: 'Home', icon: HomeIcon },
  { path: '/explore', label: 'Explore', icon: ExploreIcon },
  { path: '/journey', label: 'Journey', icon: JourneyIcon },
  { path: '/movement', label: 'Movement', icon: MovementIcon },
  { path: '/profile', label: 'Profile', icon: ProfileIcon },
];

export default function BottomNav() {
  const { profile } = useUser();
  let accentColor = 'var(--text-secondary)';
  if (profile?.birthDate) {
    const age = calculateAge(profile.birthDate.year, profile.birthDate.month, profile.birthDate.day);
    const { chakra } = getChakraPhase(age);
    accentColor = chakra.hex;
  }

  return (
    <nav className={styles.nav} style={{ '--accent': accentColor }}>
      {tabs.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          <Icon />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="3" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function ExploreIcon() {
  /* Seven dots stacked — chakra column */
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="4" r="1.2" />
      <circle cx="12" cy="7.5" r="1.2" />
      <circle cx="12" cy="11" r="1.2" />
      <circle cx="12" cy="14.5" r="1.2" />
      <circle cx="12" cy="18" r="1.2" />
      <line x1="12" y1="5.2" x2="12" y2="6.3" strokeDasharray="1 1" opacity="0.5" />
    </svg>
  );
}

function JourneyIcon() {
  /* Spiral — the journey through the centres */
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 12 m 0 -8 a 8 8 0 1 1 -0.1 0 a 6 6 0 1 0 0.1 0 a 4 4 0 1 1 -0.1 0 a 2 2 0 1 0 0.1 0" />
    </svg>
  );
}

function MovementIcon() {
  /* Orbit — sky in motion */
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="3" r="1.3" fill="currentColor" />
      <circle cx="18" cy="17" r="1.3" fill="currentColor" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
