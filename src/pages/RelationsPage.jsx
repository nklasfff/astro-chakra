import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { computeNatalChart } from '../engine/natal';
import { computeTransits } from '../engine/transits';
import { compareCharts, CHAKRA_RESONANCE } from '../engine/chakraResonance';
import { loadFriends, addFriend, deleteFriend } from '../utils/friendStore';
import { addReflection } from '../utils/reflectionStore';
import { calculateAge } from '../utils/dateUtils';
import { getJourneyPosition } from '../engine/chakraJourney';
import { analyzeGroup, buildGroupPerson, PAIR_DESCRIPTIONS, FIELD_SUMMARIES } from '../engine/groupConstellation';
import TwoSkies from '../components/hero/TwoSkies';
import GroupConstellation from '../components/hero/GroupConstellation';
import GlassCard from '../components/common/GlassCard';
import AspectRow from '../components/common/AspectRow';
import ReflectionInput from '../components/common/ReflectionInput';
import styles from './RelationsPage.module.css';

export default function RelationsPage() {
  const { profile } = useUser();
  const [friends, setFriends] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', year: 1990, month: 1, day: 1, hour: 12, minute: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('pair'); // 'pair' | 'group'
  const [includedIds, setIncludedIds] = useState(new Set(['self']));

  useEffect(() => {
    const loaded = loadFriends();
    setFriends(loaded);
    if (loaded.length > 0 && !selectedId) setSelectedId(loaded[0].id);
    // Default group: self + all friends
    setIncludedIds(new Set(['self', ...loaded.map((f) => f.id)]));
  }, []);

  const toggleIncluded = (id) => {
    setIncludedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // Build group-analysis from profile + friends
  const groupAnalysis = useMemo(() => {
    if (!profile || !myChart) return null;
    const candidates = [];
    // Self
    if (includedIds.has('self')) {
      const myAge = calculateAge(
        profile.birthDate.year,
        profile.birthDate.month,
        profile.birthDate.day
      );
      const myJourney = { ...getJourneyPosition(myAge), age: myAge };
      candidates.push(
        buildGroupPerson({ id: 'self', name: 'You', chart: myChart, journey: myJourney })
      );
    }
    // Friends
    for (const f of friends) {
      if (!includedIds.has(f.id)) continue;
      const fChart = computeNatalChart({ birthDate: f.birthDate, birthTime: f.birthTime });
      const fAge = calculateAge(
        f.birthDate.year,
        f.birthDate.month,
        f.birthDate.day
      );
      const fJourney = { ...getJourneyPosition(fAge), age: fAge };
      candidates.push(
        buildGroupPerson({ id: f.id, name: f.name, chart: fChart, journey: fJourney })
      );
    }
    if (candidates.length < 2) return null;
    return analyzeGroup(candidates);
  }, [profile, myChart, friends, includedIds]);

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

  const handleSaveReflection = ({ text, themes }) => {
    if (!profile || !selectedFriend) return;
    const age = calculateAge(
      profile.birthDate.year,
      profile.birthDate.month,
      profile.birthDate.day
    );
    const pos = getJourneyPosition(age);
    addReflection({
      text,
      themes,
      source: 'relations',
      chakraId: pos.primary.id,
      chakraName: pos.primary.name,
      age,
      spiral: pos.spiral,
      sourceMeta: { friendName: selectedFriend.name, friendId: selectedFriend.id },
    });
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
          {/* View toggle — pair (1-1) vs group (2+) */}
          {friends.length >= 2 && (
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${view === 'pair' ? styles.viewBtnActive : ''}`}
                onClick={() => setView('pair')}
              >
                Pair
              </button>
              <button
                className={`${styles.viewBtn} ${view === 'group' ? styles.viewBtnActive : ''}`}
                onClick={() => setView('group')}
              >
                Group field
              </button>
            </div>
          )}

          {view === 'pair' && (
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
          )}

          {view === 'pair' && selectedFriend && theirChart && myChart && (
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

              {/* Reflection on this relationship */}
              <GlassCard className={styles.reflectionCard}>
                <span className={styles.reflectionLabel}>
                  A thought about {selectedFriend.name}
                </span>
                <ReflectionInput
                  placeholder={`Something you notice about being with ${selectedFriend.name}.`}
                  buttonLabel="Keep this"
                  onSave={handleSaveReflection}
                  minHeight={100}
                />
              </GlassCard>
            </>
          )}

          {view === 'group' && (
            <>
              {/* Who to include */}
              <GlassCard className={styles.selectorCard}>
                <span className={styles.resonanceLabel}>Select who to include</span>
                <div className={styles.selectorList}>
                  <label className={styles.selectorItem}>
                    <input
                      type="checkbox"
                      checked={includedIds.has('self')}
                      onChange={() => toggleIncluded('self')}
                    />
                    <span>You</span>
                  </label>
                  {friends.map((f) => (
                    <label key={f.id} className={styles.selectorItem}>
                      <input
                        type="checkbox"
                        checked={includedIds.has(f.id)}
                        onChange={() => toggleIncluded(f.id)}
                      />
                      <span>{f.name}</span>
                    </label>
                  ))}
                </div>
              </GlassCard>

              {!groupAnalysis && (
                <p className={styles.groupHint}>
                  Select at least two people to see the field between you.
                </p>
              )}

              {groupAnalysis && (
                <>
                  {/* Constellation illustration */}
                  <GroupConstellation
                    people={groupAnalysis.people}
                    pairs={groupAnalysis.pairs}
                    size={320}
                  />

                  {/* Composition: present + absent */}
                  <GlassCard className={styles.resonanceCard}>
                    <span className={styles.resonanceLabel}>Chakra composition</span>
                    <div className={styles.chipsRow}>
                      {groupAnalysis.present.map((c) => (
                        <span
                          key={c.id}
                          className={styles.chip}
                          style={{ color: c.hex, borderColor: c.hex }}
                        >
                          {c.devanagari.charAt(0)} {c.name}
                        </span>
                      ))}
                    </div>
                    {groupAnalysis.absent.length > 0 && (
                      <>
                        <span className={styles.absentLabel}>absent</span>
                        <div className={styles.chipsRow}>
                          {groupAnalysis.absent.map((c) => (
                            <span
                              key={c.id}
                              className={styles.chipAbsent}
                              style={{ color: c.hex }}
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                        <p className={styles.absentNote}>{FIELD_SUMMARIES.absence}</p>
                      </>
                    )}
                  </GlassCard>

                  {/* Dominant chakra */}
                  {groupAnalysis.dominantChakra && (
                    <GlassCard
                      className={styles.resonanceCard}
                      glowColor={`${groupAnalysis.dominantChakra.hex}25`}
                    >
                      <span className={styles.resonanceLabel}>Dominant in the field</span>
                      <h3
                        className={styles.resonanceName}
                        style={{ color: groupAnalysis.dominantChakra.hex }}
                      >
                        {groupAnalysis.dominantChakra.devanagari} {groupAnalysis.dominantChakra.name}
                      </h3>
                      <p className={styles.resonanceBody}>{FIELD_SUMMARIES.presence}</p>
                      {groupAnalysis.dominantPlanet && (
                        <p className={styles.dominantPlanet}>
                          Ruled by {groupAnalysis.dominantPlanet.name} —{' '}
                          {groupAnalysis.dominantPlanet.domain.toLowerCase()}
                        </p>
                      )}
                    </GlassCard>
                  )}

                  {/* Pair counts */}
                  <GlassCard className={styles.resonanceCard}>
                    <span className={styles.resonanceLabel}>The pattern</span>
                    <div className={styles.pairCounts}>
                      {['resonance', 'flow', 'bridge', 'contrast'].map((t) => (
                        groupAnalysis.typeCounts[t] > 0 && (
                          <div key={t} className={styles.pairCount}>
                            <span className={styles.pairCountNum}>{groupAnalysis.typeCounts[t]}</span>
                            <span className={styles.pairCountLabel}>{t}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </GlassCard>

                  {/* Pairwise dynamics */}
                  <GlassCard className={styles.aspectsCard}>
                    <div className={styles.aspectsHeader}>
                      <span className={styles.aspectsLabel}>Every connection</span>
                      <span className={styles.aspectsHint}>Tap to read</span>
                    </div>
                    <div className={styles.aspects}>
                      {groupAnalysis.pairs.map((pair, i) => (
                        <PairRow key={i} pair={pair} />
                      ))}
                    </div>
                  </GlassCard>

                  {/* Journey span */}
                  {groupAnalysis.journeySpan.minAge != null && (
                    <GlassCard className={styles.resonanceCard}>
                      <span className={styles.resonanceLabel}>Life seasons</span>
                      <div className={styles.seasons}>
                        {groupAnalysis.people.map((p) => (
                          <div key={p.id} className={styles.seasonRow}>
                            <span
                              className={styles.seasonDevanagari}
                              style={{ color: p.chakraHex }}
                            >
                              {p.chakraDevanagari?.charAt(0)}
                            </span>
                            <span className={styles.seasonName}>{p.name}</span>
                            <span className={styles.seasonMeta}>
                              age {p.age} · {p.chakraName.toLowerCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className={styles.seasonsNote}>{FIELD_SUMMARIES.journeyRange}</p>
                    </GlassCard>
                  )}
                </>
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

function PairRow({ pair }) {
  const [open, setOpen] = useState(false);
  const desc = PAIR_DESCRIPTIONS[pair.type] || {};
  const TYPE_COLOR = {
    resonance: 'var(--text-secondary)',
    flow: 'var(--chakra-heart)',
    bridge: 'var(--chakra-throat)',
    contrast: 'var(--chakra-root)',
  };
  return (
    <div
      className={styles.pairRow}
      onClick={() => setOpen(!open)}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.pairHead}>
        <span className={styles.pairNames}>
          <span style={{ color: pair.a.chakraHex }}>{pair.a.name}</span>
          {' · '}
          <span style={{ color: pair.b.chakraHex }}>{pair.b.name}</span>
        </span>
        <span
          className={styles.pairType}
          style={{ color: TYPE_COLOR[pair.type] }}
        >
          {pair.typeMeta.label}
        </span>
        <span className={styles.pairChevron}>{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div
          className={styles.pairBody}
          onClick={(e) => e.stopPropagation()}
        >
          <p className={styles.pairBodyText}>{desc.body}</p>
          {desc.gift && (
            <p className={styles.pairBodyAccent}>
              <strong className={styles.pairBodyLabel}>Gift.</strong> {desc.gift}
            </p>
          )}
          {desc.shadow && (
            <p className={styles.pairBodyAccent}>
              <strong className={styles.pairBodyLabel}>Shadow.</strong> {desc.shadow}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
