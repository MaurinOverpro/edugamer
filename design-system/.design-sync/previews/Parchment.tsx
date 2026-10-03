import { Parchment } from 'edugamer-design-system';

export const Benvenuto = () => (
  <Parchment title="L'Isola Misteriosa" footer="⚓ Buona fortuna, Pirata! ⚓" style={{ maxWidth: 400 }}>
    <p>🏴‍☠️ <strong>Benvenuto, coraggioso esploratore!</strong></p>
    <p>Qui <strong>studiare è un'avventura</strong>. Ogni attività ti porta nuovi punti esperienza (<strong>XP</strong>) e svela nuove zone dalla nebbia.</p>
    <div className="eg-parchment__box">
      <p>🌴 <strong>Giungla dei Segreti</strong> — mappe mentali</p>
      <p>🔢 <strong>Caverna dei Numeri</strong> — matematica</p>
      <p>📜 <strong>Biblioteca Sommersa</strong> — italiano</p>
    </div>
  </Parchment>
);

export const Semplice = () => (
  <Parchment icon="🗝️" title="Indizio" corners={false} style={{ maxWidth: 400 }}>
    <p>Per trovare il tesoro, dividi il bottino in parti uguali tra i 4 pirati della ciurma.</p>
  </Parchment>
);
