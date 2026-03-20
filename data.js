// Auto-split from original test.html — DATA ONLY

const INTRO_SLIDES = [
  {
    chapter: 'Prolog — Södervik, 2019',
    html: `<p>Södervik. En gång en stolt industristad längs den grå kusten.</p>
           <p>Nu: stängda fabriker. Krossat butiksglas. Ungdomar utan framtid och utan hopp.</p>`
  },
  {
    chapter: 'Prolog — Jon Andersson',
    html: `<p>Jon Andersson patrullerar gatorna i sin polisbil varje kväll. 42 år. Mustasch. Halvtjock. Trötta ögon som sett för mycket.</p>
           <p>Varje natt åker han hem till sin slitna tvåa, lägger ifrån sig vapnet och dricker ett glas whiskey ensam vid köksfönstret.</p>`
  },
  {
    chapter: 'Prolog — Adam',
    html: `<p>Hans son Adam är 14 år. Bor varannan vecka hos Jon. Men förändringarna är tydliga — nya kläder som Jon aldrig köpt, kompisar som aldrig presenteras.</p>
           <div class="intro-dlg"><div class="intro-speaker">ADAM</div><div class="intro-line">Pappa, alla andra har de nya Nike:sarna. Du är polis — varför kan du inte—</div></div>
           <div class="intro-dlg"><div class="intro-speaker">JON</div><div class="intro-line">Jag har inte råd, Adam.</div></div>
           <p>Adam vänder bort blicken. Han skäms inte för att hans pappa är polis. Han skäms för att pappan inte har råd.</p>`
  },
  {
    chapter: 'Prolog — Inbrottet',
    html: `<p>En måndag i mars. Larm: inbrott i en skoaffär på Storgatan.</p>
           <p>Jon åker dit som vanligt. Blåljus. Regnpölar. Kollegor som håller tillbaka en ung kille i svart luvtröja.</p>
           <div class="intro-dlg"><div class="intro-speaker">JON</div><div class="intro-line">... Adam?</div></div>
           <p>Adam tittar upp. Rakt in i sin fars ögon. Ingen av dem säger ett ord.</p>`
  },
  {
    chapter: 'Prolog — Fallet',
    html: `<p>Inga stora konsekvenser. Men Adam väljer att bo hos sin mamma på heltid. Kontakten dör sakta.</p>
           <p>En kväll ser Jon sin son stå på ett gathörn. Han parkerar. Stiger ur. Adams kompisar omringar honom.</p>
           <p>Jon lämnar sjukhuset med sprucket revben och trasig stolthet. Han börjar dricka mer. Slarvar med jobbet.</p>`
  },
  {
    chapter: 'Prolog — Avskedet',
    html: `<p>En kväll ser han en man rekrytera en ung kille utanför 7-Eleven. Något brister inuti honom.</p>
           <p>Han kastar sig ur bilen och misshandlar mannen i blint raseri — utan att förklara, utan att tänka.</p>
           <p>Det slutar med avsked från Södervik PD.</p>
           <p><em>Jon Andersson är inte längre polis.</em></p>`
  },
  {
    chapter: 'Kapitel I — Mordet på Erik',
    html: `<p>Månader senare. Jon går hem från mataffären. Gatlyktorna kastar orange sken mot våt asfalt.</p>
           <p>Han hör skrik från en gränd.</p>
           <p>En ung kille — sjutton, arton år — faller ihop mot en container. Tre figurer springer i mörkret.</p>
           <div class="intro-dlg"><div class="intro-speaker">JON</div><div class="intro-line">Håll dig vaken! Titta på mig — jag ringer ambulans!</div></div>`
  },
  {
    chapter: 'Kapitel I — Tystanden',
    html: `<p>Ambulansen tar 22 minuter. Polisen 38. Killen — som heter Erik — dör i Jons armar.</p>
           <p>Under dagarna som följer söker Jon nyheter om mordet. Ingenting. Sidan nio. Ingen politikerkommentar. Ingen uppföljning.</p>
           <p>Södervik döljer sina sår som om de inte finns. Som om Erik aldrig levde.</p>
           <p><strong style="color:var(--red2)">Jon bestämmer sig. Han tar saken i egna händer.</strong></p>`
  },
];

const SUSPECTS_DATA = [
  { id:'jon',       name:'Jon Andersson',       role:'Fd polis, utredare', age:42, init:'JA', bg:'#1a2a1a', bc:'#408040', dot:'#408040' },
  { id:'alex',      name:'Alex Lindgren',        role:'Påstådd far till Erik', age:30, init:'AL', bg:'#1a2a4a', bc:'#4a6ec0', dot:'#4a6ec0' },
  { id:'vicke',     name:'Viktor "Vicke" Ivanov',role:'SS-distributör', age:45, init:'VI', bg:'#3a1010', bc:'#c03030', dot:'#c03030' },
  { id:'dmitrij',   name:'Dmitrij Petrov',       role:'SS högt uppsatt', age:38, init:'DP', bg:'#101030', bc:'#5050b0', dot:'#5050b0' },
  { id:'igor',      name:'Igor Pavlov',           role:'Fd SS-medlem', age:32, init:'IP', bg:'#103018', bc:'#30a050', dot:'#30a050' },
  { id:'adam',      name:'Adam Andersson',        role:'Jons son', age:18, init:'AA', bg:'#2a2410', bc:'#908030', dot:'#908030' },
  { id:'vladislav', name:'Vladislav Morozov',     role:'SS-ledare', age:55, init:'VM', bg:'#2a1010', bc:'#a04040', dot:'#a04040' },
];

const SUSPECT_UNLOCK = {
  jon: 'start',
  alex: 'met_alex',
  vicke: 'met_vicke',
  dmitrij: 'met_dmitrij',
  igor: 'met_igor',
  adam: 'talked_adam',
  vladislav: 'heard_vladislav',
};

const CLUES_DATA = {
  'c_body':       { title:'Eriks kropp', type:'Brottsplats', text:'Erik, ca 17-18 år. Knivhuggen i gränden vid Storgatan. Ambulans: 22 min. Polis: 38 min.', loc:'Storgatan', color:'#b03030', rot:-2, pos:{x:8,y:12} },
  'c_trail':      { title:'Blodfläckar', type:'Spår', text:'Blodfläckar längs en bakgata — gärningsmannen flydde den vägen.', loc:'Storgatan', color:'#922b21', rot:2, pos:{x:8,y:36} },
  'c_media':      { title:'Media tiger', type:'Mönster', text:'Ingen nyhetsartikel. Inga politikerkommentarer. Södervik döljer sina sår.', loc:'Södervik', color:'#5a2a2a', rot:-1, pos:{x:22,y:22} },
  'c_police_off': { title:'Polisen avvisar', type:'Hinder', text:'"Lägg av med det här, Jon. Du är inte polis längre." Ärendet nedprioriterat.', loc:'Södervik PD', color:'#4a4030', rot:1, pos:{x:22,y:48} },
  'c_alex_calm':  { title:'Alex — märkligt lugn', type:'Avvikelse', text:'En sörjande far borde inte ha ögon som aldrig rör sig snabbt. Alex var för kontrollerad.', loc:'Minnesmärket', color:'#1a3a7a', rot:2, pos:{x:58,y:10} },
  'c_alex_knew':  { title:'Alex kände till Jon', type:'Avvikelse', text:'Alex visste Jons namn och bakgrund INNAN de presenterades. Hur?', loc:'Minnesmärket', color:'#1a3a7a', rot:-3, pos:{x:68,y:24} },
  'c_ss_hier':    { title:'SS-hierarki', type:'Organisation', text:'Vladislav (topp) → Dmitrij (operativt) → Vicke (distribution). En fjärde roll: okänd rekryterare.', loc:'Polisfiler', color:'#4a3010', rot:2, pos:{x:12,y:65} },
  'c_vicke_dead': { title:'Vicke — återvändsgränd', type:'Uteslutning', text:'3 nätters spaning. Knarkhandel bekräftad. Intet kopplat till Eriks mord.', loc:'Hamnen', color:'#6a2020', rot:-1, pos:{x:6,y:54} },
  'c_dmitrij_fear':{ title:'Dmitrij fruktade namnet', type:'Reaktion', text:'"Det namnet nämner jag inte." Dmitrij stängde totalt vid "Svarta Hanken".', loc:'Lagret', color:'#1a1a5a', rot:-2, pos:{x:50,y:50} },
  'c_alex_smile': { title:'Alex log vid "Svarta Hanken"', type:'Avslöjande', text:'Medan Dmitrij fruktade, log Alex nästan omärkligt. Som bekräftelse.', loc:'Lagret', color:'#1a3a7a', rot:3, pos:{x:70,y:42} },
  'c_hanken':     { title:'"Svarta Hanken"', type:'Oidentifierad', text:'Rekryterar unga till SS via internet. Ingen vet vem. Opererar nära utredningen av Eriks mord.', loc:'Kaféet', color:'#3a1010', rot:-1, pos:{x:36,y:62} },
  'c_igor_warn':  { title:'Igors varning', type:'Vittne', text:'"Svarta Hanken opererar NÄRA utredningen." Igor vägrade träffa Jon när Alex var med.', loc:'Kaféet', color:'#1a4a20', rot:2, pos:{x:22,y:78} },
  'c_sabotage':   { title:'Alex saboterar', type:'Direkt sabotage', text:'Tre försök att nå Vladislav. Alla saboterade. Alex koordinerade detaljerna varje gång.', loc:'SS territorium', color:'#1a3a7a', rot:1, pos:{x:72,y:62} },
  'c_adam_no':    { title:'Adam förnekar mordet', type:'Vittne', text:'"Jag kände Erik men jag dödade honom inte." Han visste om mordet utan att Jon sagt det.', loc:'Telefon', color:'#706020', rot:-2, pos:{x:30,y:86} },
  'c_adam_warn':  { title:'Adams varning', type:'Nyckel', text:'"Någon nära dig är inte den han utger sig för att vara." — Adam', loc:'Telefon', color:'#706020', rot:2, pos:{x:48,y:86} },
  'c_alex_is':    { title:'ALEX = SVARTA HANKEN', type:'Slutledning', text:'Alex kände till Jon. Log vid nyckelnamnet. Saboterade Vladislav. Igor undvek honom. Adam varnade.', loc:'Slutledning', color:'#8b0000', rot:0, pos:{x:60,y:74} },
};

const LOCATIONS_DATA = {
  brottsplats: {
    name:'Brottsplatsen', sub:'Storgatan, gränden', time:'Kväll — månader efter avskedet',
    chapter:'Kapitel 1 — Mordet på Erik',
    atm:'Gränden luktar fukt och avlopp. En blomma är lagd mot väggen — inte färsk. Lyktorna flimrar. Du ser ett mörkare område på asfalten där blod en gång sjönk ner i betongen.',
    acts:[
      { id:'a_body', type:'exam', ico:'🩸', lbl:'Undersök blodfläcken', hint:'Brottsplats', examId:'c_body' },
      { id:'a_trail', type:'exam', ico:'👟', lbl:'Följ spåren längs väggen', hint:'Fotspår', examId:'c_trail' },
      { id:'a_witness', type:'dlg', ico:'👤', lbl:'Prata med vittne i fönstret', hint:'Granne', charId:'witness' },
      { id:'a_to_police', type:'goto', ico:'🚔', lbl:'Gå till polishuset', hint:'→', to:'polishuset' },
    ]
  },
  polishuset: {
    name:'Södervik PD', sub:'Polishuset, centrum', time:'Dagen därpå',
    chapter:'Kapitel 1 — Södervik vänder ryggen',
    atm:'Du är inte välkommen här längre. Kollegor tittar bort. Receptionen ser på dig med en blandning av igenkänning och obehag. Det luktar gammal kaffe och frustration.',
    acts:[
      { id:'a_detective', type:'dlg', ico:'🕵️', lbl:'Tala med utredare Larsson', hint:'Fd kollega', charId:'detective' },
      { id:'a_search_public', type:'search', ico:'🔍', lbl:'Sök offentlig information om fallet', hint:'Öppen sökning' },
      { id:'a_breakin', type:'breakin', ico:'💻', lbl:'Försök komma åt polisens interna terminal', hint:'⚠ Riskabelt' },
      { id:'a_to_memorial', type:'goto', ico:'🕯️', lbl:'Gå till minnesmärket', hint:'→ Storgatan', to:'minnesmärket' },
    ]
  },
  minnesmärket: {
    name:'Minnesmärket', sub:'Storgatan, Södervik', time:'En eftermiddag',
    chapter:'Kapitel 2 — Alex Lindgren',
    atm:'Torra blommor mot betongväggen. Foton på ett leende ansikte under en keps. Rök från en cigarett du inte ser varifrån den kommer. En välklädd man lägger en ny blomma mot väggen.',
    acts:[
      { id:'a_flowers', type:'exam', ico:'🌹', lbl:'Titta på minnesmärket', hint:'Föremål', examId:'c_media' },
      { id:'a_alex_1', type:'dlg', ico:'🧑', lbl:'Tala med mannen vid blomstren', hint:'Okänd man', charId:'alex_memorial' },
      { id:'a_to_streets', type:'goto', ico:'🚶', lbl:'Fortsätt till Söderviks gator', hint:'→ Utredning', to:'gator', req:'met_alex' },
    ]
  },
  gator: {
    name:'Söderviks gator', sub:'Industrikvarteret', time:'Sen kväll',
    chapter:'Kapitel 3 — Spaning',
    atm:'Ungdomar samlas vid ett gathörn. En affär sker öppet trettio meter bort. En patrullbil åker förbi utan att sakta in. Det är en stad som har gett upp på sig själv.',
    acts:[
      { id:'a_youth', type:'dlg', ico:'👦', lbl:'Snacka med ungdomarna', hint:'Gatinfo', charId:'youth' },
      { id:'a_files', type:'exam', ico:'📁', lbl:'Gå hem — kolla gamla polisfiler', hint:'Bakgrundskoll', examId:'c_ss_hier' },
      { id:'a_to_hamn', type:'goto', ico:'🚢', lbl:'Åk till hamnen — spana på Vicke', hint:'→ Viktor Ivanov', to:'hamnen', req:'c_ss_hier' },
    ]
  },
  hamnen: {
    name:'Hamnen', sub:'Södervik hamnkvarter', time:'Tre nätter',
    chapter:'Kapitel 3 — Viktor Ivanov',
    atm:'Salt luft och dieselavgaser. En kraftig man rör sig regelbundet mellan tre punkter i mörket. Du och Alex sitter i bilen i tystnad. Tredje natten i rad.',
    acts:[
      { id:'a_watch_vicke', type:'exam', ico:'🔭', lbl:'Spana på Vickes rutin', hint:'3 nätter', examId:'c_vicke_dead' },
      { id:'a_talk_vicke', type:'dlg', ico:'😠', lbl:'Konfrontera Vicke', hint:'Riskabelt', charId:'vicke', req:'c_vicke_dead' },
      { id:'a_to_lager', type:'goto', ico:'🏭', lbl:'Åk till lagret — Dmitrij Petrov', hint:'→ Nästa spår', to:'lagret', req:'c_vicke_dead' },
    ]
  },
  lagret: {
    name:'Lagret', sub:'Industrivägen, Södervik', time:'Regnig tisdag',
    chapter:'Kapitel 4 — Dmitrij Petrov',
    atm:'Betong och rost. Motorolja och cigarettrök. En stor man med tatuerade händer sitter på en kavel med korslagda armar och tittar på er som om ni är insekter.',
    acts:[
      { id:'a_dmitrij', type:'dlg', ico:'💀', lbl:'Förhör Dmitrij Petrov', hint:'Farligt', charId:'dmitrij' },
      { id:'a_to_cafe', type:'goto', ico:'☕', lbl:'Gå till kaféet — ensam, utan Alex', hint:'→ Lämna Alex hemma', to:'kafeet', req:'met_dmitrij' },
    ]
  },
  kafeet: {
    name:'Kaféet', sub:'Stadskärnan, Södervik', time:'Eftermiddag',
    chapter:'Kapitel 5 — Igor Pavlov',
    atm:'Halvtom. Neonljus. En man i läderjacka med nervösa ögon sitter längst in och vinkar dig dit med ett litet tecken. Han kollar mot dörren innan han talar.',
    acts:[
      { id:'a_igor', type:'dlg', ico:'😰', lbl:'Lyssna på vad Igor har att säga', hint:'Fd SS-medlem', charId:'igor' },
      { id:'a_to_ss', type:'goto', ico:'⚠️', lbl:'Försök nå Vladislav Morozov', hint:'→ SS territorium', to:'ss_territorium', req:'met_igor' },
    ]
  },
  ss_territorium: {
    name:'SS Territorium', sub:'Södra Södervik', time:'Fredagskväll',
    chapter:'Kapitel 6 — Sabotage',
    atm:'Du väntar vid avtalad plats. Alex kom en halvtimme sent. Porten som skulle stå öppen är kedjad. Det är tredje gången i rad. Det börjar skapa ett mönster.',
    acts:[
      { id:'a_sabotage', type:'exam', ico:'🚪', lbl:'Undersök den kedjade porten', hint:'Alex koordinerade', examId:'c_sabotage' },
      { id:'a_confront_alex', type:'dlg', ico:'🧑', lbl:'Konfrontera Alex om sabotaget', hint:'Spänning', charId:'alex_confront', req:'c_sabotage' },
      { id:'a_to_lagenhet', type:'goto', ico:'🏠', lbl:'Gå hem — vänta', hint:'→ Adams samtal', to:'lägenheten', req:'confronted_alex' },
    ]
  },
  lägenheten: {
    name:'Jons lägenhet', sub:'Södervik', time:'Sen kväll',
    chapter:'Kapitel 7 — Adams röst',
    atm:'Whiskey på diskbänken. Polisfiler på golvet. Du sitter på köksgolvet och lägger ihop pusselbitarna. Telefonen vibrerar mot bordet. Okänt nummer.',
    acts:[
      { id:'a_adam', type:'dlg', ico:'📞', lbl:'Ta samtalet — Okänt nummer', hint:'Vem är det?', charId:'adam_call' },
      { id:'a_to_final', type:'goto', ico:'⚓', lbl:'Gå till hamnen — konfrontera Alex', hint:'→ Slutkapitlet', to:'hamnen_final', req:'talked_adam' },
    ]
  },
  hamnen_final: {
    name:'Hamnen — Natt', sub:'Södervik, Södra kajen', time:'Sent på natten',
    chapter:'Kapitel 8 — Konfrontationen',
    atm:'Alex står vid vattenkanten och väntar. Han rör sig inte när han ser dig komma. Det är kallt. Vattnet är svart. Du har ett vapen i jackfickan.',
    acts:[
      { id:'a_final', type:'final', ico:'🔫', lbl:'Konfrontera Alex — Svarta Hanken', hint:'Sista mötet', charId:'alex_final' },
    ]
  },
};

const CHARS_DATA = {
  witness: {
    name:'Granne i fönstret', role:'Vittne', age:'-', init:'?', relId:'witness',
    bg:'#333', bc:'#666', badge:'Vittne', badgeColor:'var(--dim)', relStart:28,
    greet:'Jag vill inte prata om det här. Polisen sa åt oss att hålla tyst.',
    opts:[
      { id:'w1', relChange:0,
        t:'"Vad såg du den kvällen?"',
        r:'Ingenting tydligt. Jag tittade ut och såg ett par killar springa. Det var mörkt. Ambulansen kom inte på länge. Ingen kom.' },
      { id:'w2', relChange:12,
        t:'"Ni är inte ensamma. Det händer varje månad och ingen tar det på allvar."',
        r:'(Hen mjuknar.) Ja. Precis. Vi är lämnade. Ingen politiker, ingen nyhet. De är nöjda med att vi försvinner tyst.', clue:'c_media' },
      { id:'w3', minRel:38, relChange:10,
        t:'"Berätta mer om vad du såg — varje detalj kan vara avgörande."',
        r:'(Tvekar.) En av killarna stannade och tittade sig om. Välklädd, mörk kappa. Passade inte in på den här gatan.', clue:'c_trail' },
    ]
  },
  detective: {
    name:'Utredare Larsson', role:'Södervik PD', age:48, init:'KL', relId:'detective',
    bg:'#1a2a1a', bc:'#507050', badge:'Fd kollega', badgeColor:'#507050', relStart:52,
    greet:'Jon. Du borde inte vara här. Du vet det.',
    opts:[
      { id:'d1', relChange:-5,
        t:'"Vad vet ni officiellt om mordet på Erik?"',
        r:'Vi utreder det aktivt. Det är allt jag kan säga. Ärendet är öppet.', flag:'heard_vladislav' },
      { id:'d2', relChange:8,
        t:'"Vi jobbade ihop i fem år, Larsson. Jag behöver dig."',
        r:'(Sänker rösten.) Jon... ärendet är nedprioriterat uppifrån. Jag vet inte varför. Gå nu innan någon ser dig.' },
      { id:'d3', minRel:58, relChange:15,
        t:'"Är det SS-kopplingar jag ska följa?"',
        r:'(Lång paus.) Kolla SS-kopplingarna. Det var det sista vi hittade innan ärendet lades ned. Inofficiellt — det här samtalet ägde aldrig rum.', clue:'c_ss_hier' },
      { id:'d4', relChange:-18,
        t:'"Varför är det tyst i media? Är polisen inblandad?"',
        r:'(Hårdnar.) Det är ingenting vi styr. Och om du fortsätter att komma hit gör det saker svårare för oss båda. Gå hem.', clue:'c_police_off' },
    ]
  },
  alex_memorial: {
    name:'Alex Lindgren', role:'Okänd man', age:30, init:'AL', relId:'alex',
    bg:'#1a2a4a', bc:'#4a6ec0', badge:'Okänd', badgeColor:'#4a6ec0', relStart:60,
    greet:'Det var min son. Erik Lindgren. Han var arton år.',
    opts:[
      { id:'am1', relChange:8,
        t:'"Jag förstår din smärta. Jag har nästan förlorat mitt eget barn till de här gatorna."',
        r:'(Alex stannar och tittar på dig länge.) Då förstår du varför jag inte kan sluta. Gör du det?', clue:'c_alex_calm', flag:'met_alex' },
      { id:'am2', relChange:-10,
        t:'"Hur visste du vem jag var? Vi har inte träffats."',
        r:'"Jag hörde talas om dig. Du är Jon Andersson, fd polis." Han svarade för snabbt — du hade inte sagt vad du hette.', clue:'c_alex_knew', sus:8 },
      { id:'am3', relChange:5,
        t:'"Vad vill du av mig egentligen?"',
        r:'Hjälp mig ta reda på vem som dödade min son. Du är den ende med tillgång till den här världen som inte längre är bunden av regler.', flag:'met_alex' },
      { id:'am4', minRel:65, relChange:12,
        t:'"Berätta om Erik. Vad var han för kille?"',
        r:'(Rösten brister.) Han var klok. För klok för det här. Han borde ha lämnat Södervik. (En paus.) Han hittade något han inte borde ha hittat.', flag:'met_alex' },
    ]
  },
  youth: {
    name:'Ungdomar på gatan', role:'Södervik, ungdomar', age:'~16', init:'?', relId:'youth',
    bg:'#2a2010', bc:'#706040', badge:'Informanter', badgeColor:'#706040', relStart:12,
    greet:'Vad vill gubben? Vi har ingenting att säga till polisen.',
    opts:[
      { id:'y1', relChange:10,
        t:'"Jag är inte polis längre. Jag letar efter vem som dödade Erik."',
        r:'Erik... alla vet att han hängde med SS-folket ett tag. Det var ett bråk om pengar. Mer vet vi inte.', flag:'heard_vladislav' },
      { id:'y2', relChange:14,
        t:'"Ingen bryr sig om er här heller, eller hur? Inte polisen, inte politikerna."',
        r:'(En av killarna ser rakt på dig.) Nej. Ingen. Det är därför vi... (avbryter sig). Det är därför SS verkar som ett alternativ.' },
      { id:'y3', minRel:30, relChange:0,
        t:'"Vem rekryterar folk till SS just nu?"',
        r:'Det är mer online nu. Nån hemsida, Discord eller nåt. Ingen vet vem som driver det egentligen.' },
      { id:'y4', minRel:42, relChange:-8,
        t:'"Svarta Hanken — ni har hört det namnet?"',
        r:'(Killarna rör sig nervöst och börjar gå.) Vi vet ingenting om det. Fråga inte mer.' },
    ]
  },
  vicke: {
    name:'Viktor "Vicke" Ivanov', role:'SS Syd Syndikatet', age:45, init:'VI', relId:'vicke',
    bg:'#3a1010', bc:'#c03030', badge:'SS-distributör', badgeColor:'#c03030', relStart:5,
    greet:'Vad fan gör du här? Du luktar pig.',
    opts:[
      { id:'v1', relChange:6,
        t:'"Jag letar bara efter information om ett mord. Inget mer."',
        r:'"Erik? Vem fan är det?" (Vicke verkar genuint ovetande.) "Jag hanterar grejer, inte folk."', flag:'met_vicke' },
      { id:'v2', relChange:-8,
        t:'"Vem dödade Erik?"',
        r:'"Jag vet inte om något mord. Och jag vet inte om dig. Försvinn."' },
      { id:'v3', minRel:15, relChange:-15,
        t:'"Svarta Hanken. Vem är det?"',
        r:'(Vickes leende försvinner helt. Något som liknar rädsla.) "Det vet jag inte. Och du vill inte veta heller. Gå nu — för ditt eget bästa."', flag:'met_vicke' },
    ]
  },
  dmitrij: {
    name:'Dmitrij Petrov', role:'SS Syd Syndikatet', age:38, init:'DP', relId:'dmitrij',
    bg:'#101030', bc:'#5050b0', badge:'⚠ Farlig', badgeColor:'var(--red2)', relStart:5,
    greet:'Vad vill ni? Ni luktar pig. Båda två.',
    opts:[
      { id:'dp1', relChange:0,
        t:'"Vem dödade Erik?"',
        r:'Dmitrij stirrar. "Jag vet inte om vilket Erik du pratar om." Han ljuger sämre än han tror.', flag:'met_dmitrij' },
      { id:'dp2', relChange:0,
        t:'"Berätta om hierarkin i SS. Vladislav, Morozov."',
        r:'"Morozov är toppen. Under honom folk som gör sitt jobb. Mer vet du inte."', clue:'c_ss_hier', flag:'met_dmitrij' },
      { id:'dp3', relChange:-12,
        t:'"Svarta Hanken — vem är det?"',
        r:'"Det... namnet nämner jag inte." (Dmitrij stänger totalt. Alex log svagt bakom dig.)', clue:'c_dmitrij_fear', extraClue:'c_alex_smile', sus:15, flag:'met_dmitrij' },
      { id:'dp4', minRel:0, relChange:-20,
        t:'"Jag pressar på tills du pratar."',
        r:'(Reser sig.) "Fråga Igor Pavlov om du vill ha svar. Nu gå, annars är det du som hittas i en gränd." Men ger dig namnet ändå — för att slippa dig.', clue:'c_dmitrij_fear', flag:'met_dmitrij' },
    ]
  },
  igor: {
    name:'Igor Pavlov', role:'Fd SS-medlem', age:32, init:'IP', relId:'igor',
    bg:'#103018', bc:'#30a050', badge:'Flyktig källa', badgeColor:'#30a050', relStart:42,
    greet:'Du är han som letar. Jag väntade på att du skulle komma — ensam. Det var viktigt.',
    opts:[
      { id:'ig1', relChange:5,
        t:'"Vad vet du om Erik?"',
        r:'"Erik hittade rekryteringshemsidan som Svarta Hanken driver. Han hotade gå till polisen. Det var dödsdomen."', flag:'met_igor' },
      { id:'ig2', relChange:10,
        t:'"Vem är Svarta Hanken?"',
        r:'"Ingen i SS vet. Men han opererar NÄRA utredningen av Eriks mord. Väldigt nära." (Igor tittar mot dörren.)', clue:'c_hanken', sus:10, flag:'met_igor' },
      { id:'ig3', relChange:14,
        t:'"Varför ville du inte träffa mig när Alex var med?"',
        r:'"Alex Lindgren. Jag känner igen det namnet från SS:s interna kanaler. Jag kan inte säga mer. Var försiktig, Jon."', clue:'c_igor_warn', sus:20, flag:'met_igor' },
      { id:'ig4', minRel:60, relChange:18,
        t:'"Kan du vittna om vad du vet om SS om det går så långt?"',
        r:'"Om ni lyckas ta Svarta Hanken och Vladislav — ja. Inte annars. Det är döden att vittna annars."', flag:'igor_will_testify' },
    ]
  },
  alex_confront: {
    name:'Alex Lindgren', role:'Misstänkt', age:30, init:'AL', relId:'alex',
    bg:'#1a2a4a', bc:'#c03030', badge:'⚠ Misstänkt', badgeColor:'var(--red2)', relStart:40,
    greet:'Jon. Var lugn. Vladislavs folk var på helspänn. Det är allt.',
    opts:[
      { id:'ac1', relChange:-12,
        t:'"Det har hänt tre gånger — alltid när du koordinerar."',
        r:'"Du är trött och frustrerad. Jag förstår det. Men du kan inte börja peka finger åt mig — jag är på din sida."', flag:'confronted_alex', sus:12 },
      { id:'ac2', relChange:5,
        t:'"Din son Adam dödade Erik — är det vad du försöker säga?"',
        r:'"Adam och Erik hade ett bråk om pengar. Det gick för långt." Hans ton är mjuk. Alldeles för mjuk.', sus:18, flag:'confronted_alex' },
      { id:'ac3', relChange:-20,
        t:'"Jag tror inte på dig längre, Alex."',
        r:'"Det är svårt att höra. Men jag förstår." Han möter din blick utan att blinka — i en sekund för länge.', sus:22, flag:'confronted_alex' },
    ]
  },
  adam_call: {
    name:'Adam Andersson', role:'Jons son', age:18, init:'AA', relId:'adam',
    bg:'#2a2410', bc:'#908030', badge:'Jons son', badgeColor:'#908030', relStart:75,
    greet:'Pappa? Det är jag. Adam.',
    opts:[
      { id:'ad1', relChange:8,
        t:'"Adam — var är du? Är du okej?"',
        r:'"Nej. Pappa, jag vill ut ur SS. Men de släpper mig inte. Jag vet inte vad jag ska göra."', flag:'talked_adam' },
      { id:'ad2', relChange:-10,
        t:'"Dödade du Erik?"',
        r:'"Nej pappa. Nej. Jag kände honom lite — men jag dödade honom inte. Varför frågar du det?"', clue:'c_adam_no', flag:'talked_adam' },
      { id:'ad3', relChange:5,
        t:'"Vem berättade för dig att Erik var mördad?"',
        r:'"Pappa... Det är någon nära dig just nu som inte är den han utger sig för att vara. Var försiktig." (Samtalet bryts.)', clue:'c_adam_warn', sus:25 },
    ]
  },
  alex_final: {
    name:'Alex Lindgren', role:'Svarta Hanken', age:30, init:'AL', relId:'alex',
    bg:'#1a2a4a', bc:'#c03030', badge:'SVARTA HANKEN', badgeColor:'var(--red2)', relStart:10,
    greet:'Du vet. Det ser jag på dig, Jon.',
    opts:[
      { id:'af1', relChange:0,
        t:'"Du dödade Erik."',
        r:'"Erik hittade rekryteringssidan. Han skulle ha gett allt till polisen. Jag hade inget val." Absolut lugn.', clue:'c_alex_is', flag:'alex_revealed' },
      { id:'af2', relChange:0,
        t:'"Du rekryterade mitt barn."',
        r:'"Adam är fortfarande en av mina. Tänk på det — vad du gör nu avgör om han överlever det här."', sus:5, flag:'alex_revealed' },
      { id:'af3', relChange:0,
        t:'"Vad händer nu?"', isEnd:true },
    ]
  },
};

const EXAM_DATA = {
  'c_body':    { ico:'🩸', title:'Blodet på asfalten', text:'Du knäler bredvid platsen. Blodfläcken är stor — han låg här länge. En lapp under en blomma: "Erik — vi glömmer dig inte". Ingen underskrift.\n\nAmbulansen tog 22 minuter. Polisen 38.', clue:'c_body', clueText:'Erik, ca 17-18 år, knivhuggen i gränden. Ambulans 22 min. Polis 38 min.' },
  'c_trail':   { ico:'👟', title:'Spåren längs väggen', text:'Blodfläckar bakåt längs väggen. De leder mot en bakgata och avtar vid ett dräneringsgaller. Gärningsmannen kan ha kommit — eller flytt — den vägen.', clue:'c_trail', clueText:'Spår längs bakgata. Gärningsmannen flydde troligen den vägen.' },
  'c_media':   { ico:'📰', title:'Minnesmärket & tystanden', text:'Du söker på Eriks namn i din telefon. Noll nyhetsresultat. Du ringer Södervik Tidning. Ingen svarar. Kommunen svarar inte heller.\n\nSödervik begravde ett barn och ingen märkte det.', clue:'c_media', clueText:'Eriks mord: noll medietäckning. Tidningen svarar inte. Media och politiker tiger.' },
  'c_ss_hier': { ico:'📁', title:'Gamla polisfiler', text:'Du bläddrar hemma i dina gamla filer.\n\nSS Syd Syndikatet:\nVladislav Morozov (ledare) → Dmitrij Petrov (operativt) → Viktor Ivanov (distribution).\n\nNoterat: rekrytering via digitala kanaler. Ingen identifierad rekryterare.', clue:'c_ss_hier', clueText:'SS-hierarki: Vladislav (topp) → Dmitrij → Vicke. Rekryterare okänd.' },
  'c_vicke_dead':{ ico:'🔭', title:'Tre nätters spaning', text:'Natt 1: leverans från lastbil. Natt 2: möte i gränd, kontanter. Natt 3: ingenting.\n\nVicke är precis vad han verkar — ett verktyg, inte en strateg. Mordet på Erik är inte hans stil.', clue:'c_vicke_dead', clueText:'Vicke: knarkhandel bekräftad. Inget kopplat till Eriks mord. Återvändsgränd.' },
  'c_sabotage':{ ico:'🚪', title:'Den kedjade porten', text:'Porten är kedjad. Patrull rör sig i området. Alex koordinerade detaljerna.\n\nDet är tredje gången i rad. Alltid Alex. Alltid en rimlig förklaring. En rimlig förklaring är slump. Tre är ett mönster.', clue:'c_sabotage', clueText:'Tre försök att nå Vladislav saboterades. Alex koordinerade varje gång.' },
};

const E={
    police:{bg:'#001508',word:'RÄTTVISA',titleC:'#2ecc71',title:'Rättvisan Segrar',
      text:`Jon sänker vapnet och ringer 112 med skakande händer.<br><br>Alex Lindgren grips på kajen. Under förhören börjar SS Syd Syndikatets struktur rasa — namn faller, hemsidor stängs, rekryteringen upphör.<br><br>Igor vittnar. Adam vittnar. Rättegången tar ett år och väcker nationell uppmärksamhet. Södervik kan inte längre gömma sina sår.<br><br>Alex döms till livstids fängelse. Vladislav Morozov grips två månader senare.<br><br>Jon besöker Adam på ett skyddat boende. Det är det längsta samtal de haft på fyra år.`,
      quote:'"Jag lärde mig av jobbet att rättvisa håller hårdare än hämnd. Jag lärde mig av Adam att kärlek håller hårdare än besvikelse." — Jon Anderssons dagbok'},
    kill:{bg:'#140000',word:'HÄMND',titleC:'var(--red2)',title:'Mörkret Segrar',
      text:`Skottet ekar ut över hamnen. Alex sjunker mot pirbalkarna.<br><br>Jon kastar vapnet i vattnet och går hem utan att springa. Inga vittnen. Ingen utredning.<br><br>SS Syd Syndikatet fortsätter. Det finns alltid en ny Svarta Hanken. Rekryteringen börjar om under ett nytt namn på en ny hemsida.<br><br>Jon ringer Adam. Numret är bortkopplat.<br><br>Han sitter vid köksfönstret varje kväll och dricker. Han räddade ingen.`,
      quote:'"Det finns en skillnad mellan hämnd och rättvisa. Jag förstod det för sent."'},
    leave:{bg:'#0a0a14',word:'FLYKT',titleC:'#8080c0',title:'Utan Svar',
      text:`Jon sänker vapnet utan att skjuta. Han tittar på Alex länge.<br><br>Alex nickar — ett litet, kallt leende — och försvinner i mörkret.<br><br>Jon lämnar Södervik tre dagar senare. Alex är fortfarande ute. SS rekryterar fortfarande.<br><br>Sex månader senare läser han om mordet på en annan ung kille i Södervik. Sidan nio. Ingen politikerkommentar.`,
      quote:'"Södervik tar alla. Den tar bara sin tid." — Jon Andersson'},
  };

const SEARCH_DB_PUBLIC = [
  { keywords:['erik','lindgren','mord','offret'],
    source:'Södervik Tidning — Arkiv',
    title:'Inga nyheter om Erik Lindgren',
    text:'En sökning på Erik Lindgren ger inga nyhetsresultat i Södervik Tidnings öppna arkiv. Mordet genererade noll medietäckning.',
    clue:'c_media', clueText:'Bekräftat: Erik Lindgrens mord fick ingen medietäckning alls.' },
  { keywords:['ss','syndikatet','syd','gäng'],
    source:'Brottsförebyggande rådet — Offentlig rapport',
    title:'SS Syd Syndikatet — Organiserad brottslighet',
    text:'SS Syd Syndikatet är ett kriminellt nätverk verksamt i södra Södervik sedan 2015. Verksamheten inkluderar narkotikahandel och rekrytering av unga. Ledare: uppgifter saknas i offentliga register.',
    clue:'c_ss_hier', clueText:'SS bekräftat aktivt i södra Södervik sedan 2015. Ledarskap ej offentligt.' },
  { keywords:['alex','lindgren'],
    source:'Folkbokföringen — Offentlig',
    title:'Alex Lindgren — Folkbokförd',
    text:'Alex Lindgren, 30 år, folkbokförd i Södervik sedan 3 år. Inga offentliga kriminalregisteruppgifter tillgängliga. Inga tidigare nyhetsartiklar.',
    clue:null, clueText:null },
  { keywords:['viktor','vicke','ivanov'],
    source:'Domstolsverket — Öppna domar',
    title:'Viktor Ivanov — Tidigare dom',
    text:'Viktor Ivanov, 45 år. En tidigare dom för narkotikabrott 2018. Villkorlig frigivning 2020. Inga aktuella pågående ärenden i offentliga register.',
    clue:null, clueText:null },
  { keywords:['södervik','polis','nedprioriterat'],
    source:'Södervik Tidning — Ledare',
    title:'"Polisen sviker Södervik"',
    text:'En ledarartikel från 2022 beskriver hur Södervik PD systematiskt nedprioriterar ärenden i södra stadsdelarna. Kommunpolitiker kommenterade inte.',
    clue:'c_police_off', clueText:'Södervik PD nedprioriterar systematiskt södra stadsdelar.' },
  { keywords:['svarta','hanken','rekryterar'],
    source:'Södervik Tidning',
    title:'Inga träffar',
    text:'Sökordet "Svarta Hanken" ger inga träffar i offentliga arkiv eller nyhetsmedier.',
    clue:null, clueText:null },
];

const SEARCH_DB_POLICE = [
  { keywords:['erik','lindgren','mord','offret'],
    source:'Södervik PD — Internt ärende #2387',
    title:'Erik Lindgren — Mordärende [INTERN]',
    text:'Erik Lindgren, 18 år. Knivdödad 22:14 en lördag i oktober. Ärendet nedprioriterat per direktiv från enhetschef. Inga misstänkta identifierade officiellt. Noterat i utredningens interna logg: möjlig koppling till SS Syd Syndikatet — ej följd upp.',
    clue:'c_body', clueText:'Polisens interna ärende: Erik mördad 22:14. Ärendet nedprioriterat per direktiv — SS-koppling noterad men ej utredd.' },
  { keywords:['alex','lindgren'],
    source:'Södervik PD — Säkerhetsregister [SEKRETESS]',
    title:'Alex Lindgren — Flaggad [INTERN]',
    text:'Alex Lindgren förekommer i ett internt signalingsdokument kopplat till SS Syd Syndikatet. Alias okänt. Koppling ej utredd. Ärendet är låst bakom en enhetschefskod som inte är tillgänglig.',
    clue:'c_alex_knew', clueText:'POLISREGISTER: Alex Lindgren flaggad i intern SS-signalingsdatabas. Alias okänt.' },
  { keywords:['ss','syndikatet','vladislav','morozov'],
    source:'Södervik PD — Organiserad Brottslighet [INTERN]',
    title:'SS Syd Syndikatet — Intern kartläggning',
    text:'Vladislav Morozov: bekräftad ledare. Dmitrij Petrov: operativt ansvar. Viktor Ivanov: distribution. Fyra roll: rekrytering. Alias "Svarta Hanken" nämns i ett internt memo men har aldrig identifierats.',
    clue:'c_ss_hier', clueText:'POLISREGISTER: SS bekräftad hierarki. "Svarta Hanken" nämns som rekryterare — aldrig identifierad.' },
  { keywords:['svarta','hanken'],
    source:'Södervik PD — Underrättelse [SEKRETESS]',
    title:'"Svarta Hanken" — Internt underrättelsedokument',
    text:'Kod-alias "Svarta Hanken" förekommer i tre separata interna rapporter kopplade till SS-rekrytering online. Opererar sannolikt nära befintliga utredningar. Varning: kan ha kontakt med pågående fall.',
    clue:'c_hanken', clueText:'POLISREGISTER: Svarta Hanken nämnd i 3 interna SS-rapporter. Verkar nära befintliga utredningar.' },
  { keywords:['adam','andersson'],
    source:'Södervik PD — Ungdomsärenden',
    title:'Adam Andersson — Ungdomsregister',
    text:'Adam Andersson, 18 år. Registrerad i ungdomsärende 2022 (inbrott, ej åtalad). Misstänkt SS-anknytning — ej bekräftad. Far: Jon Andersson, fd polis.',
    clue:null, clueText:null },
];

const DEFAULT_POS = {
  // suspects
  jon:      {xp:2,  yp:4},
  alex:     {xp:52, yp:4},
  vicke:    {xp:6,  yp:44},
  dmitrij:  {xp:42, yp:40},
  igor:     {xp:14, yp:62},
  adam:     {xp:30, yp:76},
  vladislav:{xp:68, yp:6},
  // clue cards from CLUES_DATA.pos (xp/yp)
};
