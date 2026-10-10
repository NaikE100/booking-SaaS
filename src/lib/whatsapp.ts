// src/lib/whatsapp.ts

export interface WhatsAppMessageProps {
  phone: string;
  serviceTitle: string;
  priceZar: number;
  date: string;
  time: string;
  clientName: string;
}

export function generateWhatsAppLink({
  phone,
  serviceTitle,
  priceZar,
  date,
  time,
  clientName,
}: WhatsAppMessageProps): string {
  const cleanPhone = phone.replace(/\D/g, '');

  // UTF-16 Surrogate Pairs guarantee clean parsing across all JS targets
  const clipboard = '\uD83D\uDCCB'; // 📋
  const moneyBag = '\uD83D\uDCB0';  // 💰
  const calendar = '\uD83D\uDCC5';  // 📅
  const clock = '\u23F0';          // ⏰
  const user = '\uD83D\uDC64';       // 👤

  const message = `Hello! I would like to confirm my booking:

${clipboard} *Service:* ${serviceTitle}
${moneyBag} *Price:* R${priceZar}
${calendar} *Date:* ${date}
${clock} *Time:* ${time}
${user} *Name:* ${clientName}

Thank you!`;

  const encodedMessage = encodeURIComponent(message);

  // api.whatsapp.com bypasses wa.me redirect encoding bugs on Windows
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
}