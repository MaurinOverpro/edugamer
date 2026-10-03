import { ChatThread, ChatBubble } from 'edugamer-design-system';

export const Quiz = () => (
  <ChatThread>
    <ChatBubble from="tutor" author="🎓 Tutor">Domanda 1: quanto fa 7 × 8?</ChatBubble>
    <ChatBubble from="studente">56</ChatBubble>
    <ChatBubble from="tutor" author="🎓 Tutor">Esatto, pirata! +10 XP 🏴‍☠️</ChatBubble>
  </ChatThread>
);
