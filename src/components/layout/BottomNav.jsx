import { NavLink } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getChakraPhase } from '../../engine/chakraPhase';
import { calculateAge } from '../../utils/dateUtils';
import styles from './BottomNav.module.css';

const tabs = [
  { path: '/home', label: 'Home', icon: HomeIcon },
  { path: '/explore', label: 'Explore', icon: ExploreIcon },
  { path: '/relations', label: 'Relations', icon: RelationsIcon },
  { path: '/time', label: 'Time', icon: TimeIcon },
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

function RelationsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="12" r="4" />
      <circle cx="16" cy="12" r="4" />
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,7 12,12 16,14" />
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
