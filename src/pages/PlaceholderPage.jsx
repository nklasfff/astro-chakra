import styles from './HomePage.module.css';

export default function PlaceholderPage({ title, body }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.greeting}>Coming soon</p>
        <h1 className={styles.title} style={{ fontSize: '2.4rem' }}>{title}</h1>
        <p className={styles.subtitle}>{body}</p>
      </header>
    </div>
  );
}
