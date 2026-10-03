import { CharacterQuote } from 'edugamer-design-system';

export const CapitanoSquall = () => (
  <div style={{ maxWidth: 460 }}>
    <CharacterQuote name="Capitano Squall" emoji="🦜" color="#38bdf8">
      Benvenuto sull'Isola Misteriosa, Pirata! Più impari, più terre si svelano davanti a te.
    </CharacterQuote>
  </div>
);

export const Personaggi = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460 }}>
    <CharacterQuote name="Zara la Veggente" emoji="🔭" color="#4ade80">Con le mappe mentali puoi tenere tutto nella testa, senza fatica.</CharacterQuote>
    <CharacterQuote name="Isabella delle Acque" emoji="🌊" color="#c084fc">Le parole sono più potenti di qualsiasi spada.</CharacterQuote>
    <CharacterQuote name="Rex l'Enigmista" emoji="🗝️" color="#fb923c">Solo i pirati più acuti riescono a superarmi. Sei pronto?</CharacterQuote>
  </div>
);
