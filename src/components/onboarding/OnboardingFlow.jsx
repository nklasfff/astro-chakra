import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { getChakraPhase } from '../../engine/chakraPhase';
import { calculateAge } from '../../utils/dateUtils';
import GrainOverlay from '../common/GrainOverlay';
import GlowOrb from '../common/GlowOrb';
import styles from './OnboardingFlow.module.css';

const STEPS = ['welcome', 'birthdate', 'birthtime', 'birthplace', 'reveal'];

export default function OnboardingFlow() {
  const { completeOnboarding } = useUser();
  const [stepIndex, setStepIndex] = useState(0);
  const [birthDate, setBirthDate] = useState({ year: 1990, month: 1, day: 1 });
  const [birthTime, setBirthTime] = useState({ hour: 12, minute: 0 });
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [birthLocation, setBirthLocation] = useState({ city: '', country: '' });
  const [direction, setDirection] = useState('forward');

  const step = STEPS[stepIndex];
  const age = calculateAge(birthDate.year, birthDate.month, birthDate.day);
  const { chakra, spiral, ageRange } = getChakraPhase(age);

  const next = () => {
    setDirection('forward');
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const back = () => {
    setDirection('back');
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const finish = () => {
    completeOnboarding({
      birthDate,
      birthTime: timeUnknown ? null : birthTime,
      birthLocation: birthLocation.city ? birthLocation : null,
    });
  };

  const animClass = direction === 'forward' ? 'animate-fade-up' : 'animate-fade-in';

  return (
    <div className={styles.overlay}>
      <GlowOrb color={`${chakra.hex}33`} size={500} top="-150px" left="-100px" />
      <GrainOverlay />

      <div className={styles.progress}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i <= stepIndex ? styles.dotActive : ''}`}
            style={i <= stepIndex ? { background: chakra.hex } : {}}
          />
        ))}
      </div>

      <div className={styles.content} key={step}>
        {step === 'welcome' && (
          <div className={animClass}>
            <WelcomeIllustration className={styles.welcomeIllustration} />
            <h1 className={styles.title}>Astro Chakra</h1>
            <p className={styles.subtitle}>
              Seven centers. Seven-year cycles. One life spiraling upward.
            </p>
            <p className={styles.body}>
              Discover which chakra is active in your life phase — and how the planets shape the unique signature you were born with.
            </p>
            <div className={styles.actions}>
              <button className={styles.btn} onClick={next}>Begin</button>
            </div>
          </div>
        )}

        {step === 'birthdate' && (
          <div className={animClass}>
            <h2 className={styles.title}>When were you born?</h2>
            <p className={styles.subtitle}>Your birth date reveals your current chakra phase</p>
            <div className={styles.dateInputs}>
              <div className={styles.field}>
                <label>Year</label>
                <select value={birthDate.year} onChange={(e) => setBirthDate({ ...birthDate, year: +e.target.value })}>
                  {Array.from({ length: 107 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Month</label>
                <select value={birthDate.month} onChange={(e) => setBirthDate({ ...birthDate, month: +e.target.value })}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('en', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Day</label>
                <select value={birthDate.day} onChange={(e) => setBirthDate({ ...birthDate, day: +e.target.value })}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {step === 'birthtime' && (
          <div className={animClass}>
            <h2 className={styles.title}>What time were you born?</h2>
            <p className={styles.subtitle}>Birth time anchors your natal chart to the horizon</p>
            <div className={styles.dateInputs} style={timeUnknown ? { opacity: 0.35, pointerEvents: 'none' } : {}}>
              <div className={styles.field}>
                <label>Hour</label>
                <select value={birthTime.hour} onChange={(e) => setBirthTime({ ...birthTime, hour: +e.target.value })}>
                  {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                    <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Minute</label>
                <select value={birthTime.minute} onChange={(e) => setBirthTime({ ...birthTime, minute: +e.target.value })}>
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={timeUnknown}
                onChange={(e) => setTimeUnknown(e.target.checked)}
              />
              <span>I don't know my birth time</span>
            </label>
            <p className={styles.helperText}>
              Without a time we'll show you a solar chart — planets and signs, but no houses.
            </p>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {step === 'birthplace' && (
          <div className={animClass}>
            <h2 className={styles.title}>Where were you born?</h2>
            <p className={styles.subtitle}>Place anchors the chart to the Earth</p>
            <div className={styles.textInputs}>
              <div className={styles.field}>
                <label>City</label>
                <input
                  type="text"
                  value={birthLocation.city}
                  onChange={(e) => setBirthLocation({ ...birthLocation, city: e.target.value })}
                  placeholder="Copenhagen"
                />
              </div>
              <div className={styles.field}>
                <label>Country</label>
                <input
                  type="text"
                  value={birthLocation.country}
                  onChange={(e) => setBirthLocation({ ...birthLocation, country: e.target.value })}
                  placeholder="Denmark"
                />
              </div>
            </div>
            <p className={styles.helperText}>
              We'll look up coordinates and timezone when computing your chart. You can skip this for now.
            </p>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {step === 'reveal' && (
          <div className={animClass}>
            <div className={styles.revealSymbol} style={{ color: chakra.hex }}>
              {chakra.devanagari}
            </div>
            <h2 className={styles.title} style={{ color: chakra.hex }}>{chakra.name}</h2>
            <p className={styles.subtitle}>
              {chakra.sanskrit} — {chakra.theme}
            </p>
            <p className={styles.body}>
              You are {age} years old, in spiral {spiral}, ages {ageRange.start}–{ageRange.end}.
              This is your {chakra.name.toLowerCase()} chakra season.
            </p>
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Chakra</span>
                <span style={{ color: chakra.hex }}>{chakra.devanagari} {chakra.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Planet</span>
                <span>{chakra.planet}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Element</span>
                <span>{chakra.element}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Spiral</span>
                <span>{spiral} — ages {ageRange.start}–{ageRange.end}</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={finish}>Enter</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WelcomeIllustration({ className }) {
  const colors = ['#b85c44', '#d47a50', '#c9a04a', '#7a9e6d', '#6b92b5', '#8275a8', '#a67fc0'];
  return (
    <svg viewBox="0 0 240 260" className={className}>
      <defs>
        {colors.map((color, i) => (
          <radialGradient key={`g${i}`} id={`chGlow${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Vertical axis */}
      <line x1="120" y1="20" x2="120" y2="240" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="1 4" />

      {/* Seven chakra points, bottom to top */}
      {colors.map((color, i) => {
        const y = 230 - i * 32;
        return (
          <g key={i}>
            <circle cx="120" cy={y} r="22" fill={`url(#chGlow${i})`} />
            <circle cx="120" cy={y} r="8" fill="none" stroke={color} strokeWidth="0.8" opacity="0.7" />
            <circle cx="120" cy={y} r="3" fill={color} opacity="0.4" />
          </g>
        );
      })}
    </svg>
  );
}
