import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { computeNatalChart } from '../engine/natal';
import { computeTransits } from '../engine/transits';
import { loadFriends, addFriend, deleteFriend } from '../utils/friendStore';
import TwoSkies from '../components/hero/TwoSkies';
import GlassCard from '../components/common/GlassCard';
import styles from './RelationsPage.module.css';

const ASPECT_GLYPHS = {
  conjunction: '☌',
  sextile: '⚹',
  square: '□',
  trine: '△',
  opposition: '☍',
};

const ASPECT_MOOD = {
  conjunction: 'fusing',
  sextile: 'supporting',
  square: 'activating',
  trine: 'flowing',
  opposition: 'balancing',
};

export default function RelationsPage() {
  const { profile } = useUser();
  const [friends, setFriends] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', year: 1990, month: 1, day: 1, hour: 12, minute: 0 });
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const loaded = loadFriends();
    setFriends(loaded);
    if (loaded.length > 0 && !selectedId) setSelectedId(loaded[0].id);
  }, []);

  const myChart = useMemo(() => (profile ? computeNatalChart(profile) : null), [profile]);

  const selectedFriend = friends.find((f) => f.id === selectedId);
  const theirChart = useMemo(() => {
    if (!selectedFriend) return null;
    return computeNatalChart({
      birthDate: selectedFriend.birthDate,
      birthTime: selectedFriend.birthTime,
    });
  }, [selectedFriend]);

  const synastry = useMemo(() => {
    if (!myChart || !theirChart) return [];
    // Treat their chart as "transit" and yours as "natal" → produces cross-chart aspects.
    const personalIds = new Set(['sun', 'moon', 'mercury', 'venus', 'mars']);
    return computeTransits(theirChart, myChart)
      .filter((a) => personalIds.has(a.transit.id) || personalIds.has(a.natal.id))
      .slice(0, 8);
  }, [myChart, theirChart]);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const next = addFriend({
      name: form.name.trim(),
      birthDate: { year: +form.year, month: +form.month, day: +form.day },
      birthTime: { hour: +form.hour, minute: +form.minute },
    });
    setFriends(next);
    setSelectedId(next[0].id);
    setForm({ name: '', year: 1990, month: 1, day: 1, hour: 12, minute: 0 });
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    const next = deleteFriend(id);
    setFriends(next);
    if (selectedId === id) {
      setSelectedId(next.length > 0 ? next[0].id : null);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Relations</p>
        <h1 className={styles.title}>Two skies meeting</h1>
        <p className={styles.subtitle}>
          How your chart and someone else's speak — where they fuse, flow, or activate.
        </p>
      </header>

      <TwoSkies
        size={260}
        colorA="var(--chakra-heart)"
        colorB={selectedFriend ? 'var(--chakra-sacral)' : 'var(--chakra-throat)'}
      />

      {friends.length === 0 && !showAdd && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            No one yet. Add someone whose sky you want to understand alongside yours.
          </p>
          <button className={styles.primaryBtn} onClick={() => setShowAdd(true)}>
            Add someone
          </button>
        </div>
      )}

      {friends.length > 0 && !showAdd && (
        <>
          <div className={styles.friendTabs}>
            {friends.map((f) => (
              <button
                key={f.id}
                className={`${styles.tab} ${f.id === selectedId ? styles.tabActive : ''}`}
                onClick={() => setSelectedId(f.id)}
              >
                {f.name}
              </button>
            ))}
            <button className={styles.addTab} onClick={() => setShowAdd(true)}>
              + add
            </button>
          </div>

          {selectedFriend && theirChart && (
            <>
              <GlassCard className={styles.friendCard}>
                <div className={styles.friendHeader}>
                  <div>
                    <span className={styles.friendLabel}>You & {selectedFriend.name}</span>
                    <p className={styles.friendSuns}>
                      <span style={{ color: `var(--chakra-${myChart.sun.chakra})` }}>☉</span>{' '}
                      {myChart.sun.sign.name}{' · '}
                      <span style={{ color: `var(--chakra-${theirChart.sun.chakra})` }}>☉</span>{' '}
                      {theirChart.sun.sign.name}
                    </p>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleDelete(selectedFriend.id)}
                  >
                    remove
                  </button>
                </div>
              </GlassCard>

              {synastry.length > 0 && (
                <GlassCard className={styles.aspectsCard}>
                  <span className={styles.aspectsLabel}>Between your skies</span>
                  <div className={styles.aspects}>
                    {synastry.map((a, i) => (
                      <div key={i} className={styles.aspect}>
                        <div className={styles.aspectSide}>
                          <span
                            className={styles.aspectGlyph}
                            style={{ color: `var(--chakra-${a.transit.chakra})` }}
                          >
                            {a.transit.glyph}
                          </span>
                          <span className={styles.aspectName}>
                            their {a.transit.name}
                          </span>
                        </div>
                        <div className={styles.aspectCore}>
                          <span className={styles.aspectSymbol}>
                            {ASPECT_GLYPHS[a.aspect.id]}
                          </span>
                          <span className={styles.aspectMood}>
                            {ASPECT_MOOD[a.aspect.id]}
                          </span>
                        </div>
                        <div className={styles.aspectSide}>
                          <span
                            className={styles.aspectGlyph}
                            style={{ color: `var(--chakra-${a.natal.chakra})` }}
                          >
                            {a.natal.glyph}
                          </span>
                          <span className={styles.aspectName}>
                            your {a.natal.name}
                          </span>
                        </div>
                        <span className={styles.aspectOrb}>{a.orb.toFixed(1)}°</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </>
          )}
        </>
      )}

      {showAdd && (
        <GlassCard className={styles.addCard}>
          <h3 className={styles.addTitle}>Someone new</h3>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={styles.input}
              placeholder="Their name"
            />
          </label>
          <div className={styles.dateRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Year</span>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              >
                {Array.from({ length: 107 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Month</span>
              <select
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Day</span>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.actions}>
            <button className={styles.ghostBtn} onClick={() => setShowAdd(false)}>
              Cancel
            </button>
            <button className={styles.primaryBtn} onClick={handleAdd} disabled={!form.name.trim()}>
              Add
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
