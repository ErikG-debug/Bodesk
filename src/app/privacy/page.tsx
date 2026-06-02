import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritetspolicy – PropDesk",
  description: "Hur PropDesk hanterar personuppgifter och e-postdata.",
};

export default function PrivacyPage() {
  const updated = "2026-06-02";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-gray-800">
      <h1 className="mb-2 text-3xl font-bold">Integritetspolicy</h1>
      <p className="mb-10 text-sm text-gray-400">Senast uppdaterad: {updated}</p>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Om tjänsten</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          PropDesk är ett ärendehanteringssystem för fastighetsbolag. Tjänsten tar emot
          inkommande e-post från hyresgäster, bearbetar innehållet med hjälp av artificiell
          intelligens och skickar svar från fastighetsbolagets egna e-postadress via Gmail.
          Dashboarden ger fastighetspersonal tillgång till ärendehistorik och kommunikation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Personuppgifter vi behandlar</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
          <li><span className="font-medium text-gray-700">Hyresgästens e-postadress och namn</span> — samlas in automatiskt från inkommande e-post.</li>
          <li><span className="font-medium text-gray-700">E-postinnehåll</span> — ärendemeddelanden lagras för att ge fastighetspersonal en fullständig ärendehistorik.</li>
          <li><span className="font-medium text-gray-700">Fastighetsinformation</span> — kopplas till ärenden för att underlätta handläggning.</li>
          <li><span className="font-medium text-gray-700">Gmail OAuth-token</span> — lagras för att skicka utgående e-post å fastighetspersonalens vägnar. Inga e-postmeddelanden läses utöver det som krävs för att skicka svar.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Hur vi använder Gmail</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          PropDesk ansluter till Gmail via Google OAuth 2.0 enbart i syfte att skicka
          e-postsvar från fastighetsbolagets befintliga e-postadress. Åtkomsten begränsas
          till scopet <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">gmail.send</code>.
          Vi läser, lagrar eller analyserar inte befintlig e-post i Gmail-kontot.
          OAuth-tokens lagras krypterat och används enbart för utgående e-post relaterad
          till ärenden i PropDesk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Artificiell intelligens</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Inkommande e-postmeddelanden skickas till Anthropic Claude API för att
          klassificera ärendet och generera ett förslag på svar. Anthropic behandlar
          innehållet enligt sina egna användarvillkor och integritetspolicy. Inga
          personuppgifter används för att träna modeller.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Lagring och radering</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Ärenden och tillhörande personuppgifter lagras i en PostgreSQL-databas hos
          Railway (EU-region). Avslutade och arkiverade ärenden raderas automatiskt
          90 dagar efter stängning i enlighet med GDPR:s princip om lagringsminimering.
          Fastighetspersonal kan stänga ärenden manuellt via dashboarden.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Dina rättigheter</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Du har rätt att begära ut, korrigera eller radera dina personuppgifter.
          Kontakta det fastighetsbolag vars tjänst du använder, eller nå oss direkt
          via e-postadressen nedan.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Kontakt</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          Frågor om hur vi hanterar personuppgifter skickas till:{" "}
          <a href="mailto:egron9621@gmail.com" className="text-[#1a6ba8] underline underline-offset-2">
            egron9621@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
