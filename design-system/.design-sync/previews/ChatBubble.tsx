import { ChatBubble, ChatThread } from 'edugamer-design-system';

export const Conversazione = () => (
  <ChatThread>
    <ChatBubble from="studente">Non ho capito cosa sono le frazioni equivalenti.</ChatBubble>
    <ChatBubble from="tutor" author="🎓 Tutor">
      Immagina una pizza tagliata in 2 parti: ne mangi 1. Ora tagliala in 4 parti e mangiane 2. Hai mangiato la stessa quantità! Quindi 1/2 e 2/4 sono equivalenti.
    </ChatBubble>
  </ChatThread>
);

export const Studente = () => (
  <ChatBubble from="studente" author="Tu">Mi fai un quiz sui Romani?</ChatBubble>
);

export const Tutor = () => (
  <ChatBubble from="tutor" author="🎓 Tutor">Certo, pirata! Prima domanda: chi fu il primo imperatore di Roma?</ChatBubble>
);
