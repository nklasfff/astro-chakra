import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { computeNatalChart } from '../engine/natal';
import { computeTransits } from '../engine/transits';
import { compareCharts, CHAKRA_RESONANCE } from '../engine/chakraResonance';
import { loadFriends, addFriend, deleteFriend } from '../utils/friendStore';
import TwoSkies from '../components/hero/TwoSkies';
import GlassCard from '../components/common/GlassCard';
import AspectRow from '../components/common/AspectRow';
import styles from './RelationsPage.module.css';

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
    const personalIds = new Set(['sun', 'moon', 'mercury', 'venus', 'mars']);
    return computeTransits(theirChart, myChart)
      .filter((a) => personalIds.has(a.transit.id) || personalIds.has(a.natal.id))
      .slice(0, 8);
  }, [myChart, theirChart]);

  const comparison = useMemo(() => {
    if (!myChart || !theirChart) return null;
    return compareCharts(myChart, theirChart);
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
        colorA={myChart ? `var(--chakra-${myChart.sun.chakra})` : 'var(--chakra-heart)'}
        colorB={theirChart ? `var(--chakra-${theirChart.sun.chakra})` : 'var(--chakra-throat)'}
      />

      {friends.length === 0 && !showAdd && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            No one here yet. Add someone whose sky you want to know beside yours.
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

          {selectedFriend && theirChart && myChart && (
            <>
              {/* Signature pair card */}
              <GlassCard className={styles.signatureCard}>
                <div className={styles.signatureRow}>
                  <div className={styles.sigSide}>
                    <span className={styles.sigWho}>you</span>
                    <div
                      className={styles.sigGlyph}
                      style={{ color: `var(--chakra-${myChart.sun.chakra})` }}
                    >
                      ☉
                    </div>
                    <span className={styles.sigSign}>
                      {myChart.sun.sign.glyph} {myChart.sun.sign.name}
                    </span>
                    <span
                      className={styles.sigMoon}
                      style={{ color: `var(--chakra-${myChart.moon.chakra})` }}
                    >
                      ☽ {myChart.moon.sign.glyph} {myChart.moon.sign.name}
                    </span>
                  </div>
                  <div className={styles.sigDivider} />
                  <div className={styles.sigSide}>
                    <span className={styles.sigWho}>{selectedFriend.name.toLowerCase()}</span>
                    <div
                      className={styles.sigGlyph}
                      style={{ color: `var(--chakra-${theirChart.sun.chakra})` }}
                    >
                      ☉
                    </div>
                    <span className={styles.sigSign}>
                      {theirChart.sun.sign.glyph} {theirChart.sun.sign.name}
                    </span>
                    <span
                      className={styles.sigMoon}
                      style={{ color: `var(--chakra-${theirChart.moon.chakra})` }}
                    >
                      ☽ {theirChart.moon.sign.glyph} {theirChart.moon.sign.name}
                    </span>
                  </div>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleDelete(selectedFriend.id)}
                >
                  remove {selectedFriend.name}
                </button>
              </GlassCard>

              {/* Chakra resonance */}
              {comparison && comparison.shared.length > 0 && (
                <GlassCard className={styles.resonanceCard}>
                  <span className={styles.resonanceLabel}>Chakra resonance</span>
                  {comparison.shared.slice(0, 2).map(({ chakra }) => (
                    <div key={chakra.id} className={styles.resonanceItem}>
                      <span
                        className={styles.resonanceDevanagari}
                        style={{ color: chakra.hex }}
                      >
                        {chakra.devanagari}
                      </span>
                      <div className={styles.resonanceText}>
                        <h3
                          className={styles.resonanceName}
                          style={{ color: chakra.hex }}
                        >
                          Shared {chakra.name.toLowerCase()}
                        </h3>
                        <p className={styles.resonanceBody}>
                          {CHAKRA_RESONANCE[chakra.id].shared}
                        </p>
                      </div>
                    </div>
                  ))}
                  {comparison.contrast.slice(0, 1).map(({ chakra, aVal, bVal }) => (
                    <div key={`c-${chakra.id}`} className={styles.resonanceItem}>
                      <span
                        className={styles.resonanceDevanagari}
                        style={{ color: chakra.hex, opacity: 0.6 }}
                      >
                        {chakra.devanagari}
                      </span>
                      <div className={styles.resonanceText}>
                        <h3
                          className={styles.resonanceName}
                          style={{ color: chakra.hex }}
                        >
                          {aVal > bVal ? 'You lead at' : 'They lead at'} {chakra.name.toLowerCase()}
                        </h3>
                        <p className={styles.resonanceBody}>
                          {CHAKRA_RESONANCE[chakra.id].oneLeads}
                        </p>
                      </div>
                    </div>
                  ))}
                </GlassCard>
              )}

              {/* Synastry aspects */}
              {synastry.length > 0 && (
                <GlassCard className={styles.aspectsCard}>
                  <div className={styles.aspectsHeader}>
                    <span className={styles.aspectsLabel}>Between your skies</span>
                    <span className={styles.aspectsHint}>Tap to read</span>
                  </div>
                  <div className={styles.aspects}>
                    {synastry.map((a, i) => (
                      <AspectRow
                        key={i}
                        leftPlanet={a.transit}
                        rightPlanet={a.natal}
                        leftLabel={selectedFriend.name.toLowerCase()}
                        rightLabel="your"
                        aspect={a.aspect}
                        orb={a.orb}
                        exact={a.exact}
                        context="synastry"
                      />
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
