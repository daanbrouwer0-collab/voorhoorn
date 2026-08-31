const HOORN_LINKS = [
    // 1. NIEUWS & MEDIA
    {
        title: "Hoornnieuws",
        url: "https://www.hoornnieuws.nl/",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📰",
        desc: "Actueel 112-nieuws, politiek, stadsnieuws en achtergronden uit Hoorn en omgeving.",
        tags: ["nieuws", "112", "politiek", "actualiteit", "krant"]
    },
    {
        title: "Streekomroep West-Friesland (WEEFF / HoornRadio)",
        url: "https://www.streekomroepwestfriesland.nl/",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📻",
        desc: "Publieke streekomroep met radio, tv-uitzendingen, podcasts en video's ('van Hoorn zeggen').",
        tags: ["omroep", "radio", "weeff", "tv", "podcasts", "video", "nieuws"]
    },
    {
        title: "Hoornsdagblad.nl",
        url: "https://www.hoornsdagblad.nl/",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "🗞️",
        desc: "Digitaal lokaal dagblad met het laatste nieuws, cultuur en interviews uit de stad.",
        tags: ["dagblad", "krant", "artikelen", "nieuws"]
    },
    {
        title: "Rodi Media / Nieuwsblad Hoorn",
        url: "https://www.rodi.nl/hoorn",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📑",
        desc: "Digitaal huis-aan-huisblad Nieuwsblad Hoorn met lokaal verenigings- en stadsnieuws.",
        tags: ["rodi", "huis-aan-huis", "nieuwsblad", "krant", "nieuws"]
    },
    {
        title: "Weekblad Zondag",
        url: "https://www.weekbladzondag.nl/",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "🗞️",
        desc: "Populair regionaal weekblad met lokaal sport-, verenigings- en stadsnieuws.",
        tags: ["weekblad", "zondag", "krant", "sport", "nieuws"]
    },
    {
        title: "NH Nieuws (West-Friesland)",
        url: "https://www.nhnieuws.nl/regio/west-friesland",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📺",
        desc: "Regionale nieuwszender en website van de provincie Noord-Holland met focus op West-Friesland.",
        tags: ["nh nieuws", "regio", "tv", "nieuws"]
    },
    {
        title: "Noordhollands Dagblad (West-Friesland)",
        url: "https://www.noordhollandsdagblad.nl/regio/west-friesland",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📰",
        desc: "Regionale kwaliteitskrant met diepgaande onderzoeksjournalistiek en stadsverslaggeving.",
        tags: ["nhd", "krant", "dagblad", "journalistiek", "nieuws"]
    },

    // 2. GEMEENTE & BESTUUR
    {
        title: "Gemeente Hoorn",
        url: "https://www.hoorn.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "🏛️",
        desc: "Officiële gemeentewebsite voor paspoorten, rijbewijzen, belastingen, afspraken en vergunningen.",
        tags: ["gemeente", "paspoort", "rijbewijs", "vergunning", "burgerzaken", "balie"]
    },
    {
        title: "iBabs Publieksportaal (Gemeenteraad)",
        url: "https://hoorn.bestuurlijkeinformatie.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "📋",
        desc: "Vergaderkalender, live meekijken, videoarchief, moties, amendementen en officiële raadsnotulen.",
        tags: ["raad", "notulen", "vergadering", "live", "politiek", "ibabs", "besluiten"]
    },
    {
        title: "Besluitenlijsten College van B&W",
        url: "https://www.hoorn.nl/bestuur-en-organisatie/besluitenlijsten-college-van-bw",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "⚖️",
        desc: "Wekelijkse officiële besluitenlijsten van de burgemeester en wethouders van Hoorn.",
        tags: ["college", "b&w", "besluiten", "burgemeester", "wethouder", "politiek"]
    },
    {
        title: "Gemeenteraad Hoorn",
        url: "https://gemeenteraad.hoorn.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "👥",
        desc: "Informatie over raadsleden, politieke fracties en hoe je als burger kunt inspreken.",
        tags: ["raadsleden", "fracties", "inspreken", "democratie", "gemeente"]
    },
    {
        title: "Officiële Bekendmakingen Hoorn",
        url: "https://zoek.officielebekendmakingen.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "📜",
        desc: "Zoek op postcode naar bouwvergunningen, bestemmingsplannen en lokale verordeningen.",
        tags: ["vergunningen", "bekendmakingen", "bouwplannen", "bestemming", "postcode"]
    },
    {
        title: "Wet open overheid (Woo) Hoorn",
        url: "https://www.hoorn.nl/woo",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "🔍",
        desc: "Openbare overheidsdocumenten inzien of zelf een Woo-verzoek indienen.",
        tags: ["woo", "openbaarheid", "overheid", "documenten", "transparantie"]
    },

    // 3. SPOED & NOODDIENSTEN
    {
        title: "Huisartsenpost West-Friesland",
        url: "https://www.huisartsenpostwf.nl/",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "🩺",
        desc: "Spoedeisende huisartsenzorg 's avonds, 's nachts en in het weekend bij Dijklander Ziekenhuis (0229-297800).",
        tags: ["dokter", "huisarts", "spoed", "ziekenhuis", "weekend", "nacht", "nood"]
    },
    {
        title: "Politie Hoorn & Wijkagenten",
        url: "https://www.politie.nl/mijn-buurt/wijkagenten",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "👮",
        desc: "Vind direct de contactgegevens van de wijkagent voor jouw wijk (Binnenstad, Risdam, Kersenboogerd, etc.).",
        tags: ["politie", "wijkagent", "veiligheid", "aangifte", "overlast", "buurt"]
    },
    {
        title: "Burgernet Hoorn",
        url: "https://www.burgernet.nl/",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "🚨",
        desc: "Realtime politieoproepen en meldingen bij vermiste personen of verdachte situaties in Hoorn.",
        tags: ["burgernet", "vermissing", "dader", "veiligheid", "politie"]
    },
    {
        title: "WhatsApp Buurtpreventie (WABP Hoorn)",
        url: "https://www.wabp.nl/",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "📱",
        desc: "Overzicht en registratie van actieve Buurt-WhatsApp preventiegroepen in straten en wijken.",
        tags: ["whatsapp", "buurtpreventie", "wabp", "veiligheid", "buren"]
    },
    {
        title: "Dierenambulance Hoorn e.o.",
        url: "https://www.dierenbescherming.nl/dierenambulance",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "🐾",
        desc: "Eerste hulp en vervoer voor gewonde, zieke of gevonden dieren in Hoorn (0229-245353).",
        tags: ["dieren", "hond", "kat", "vogel", "ambulance", "spoed"]
    },
    {
        title: "Veiligheidsregio Noord-Holland Noord",
        url: "https://www.vrnhn.nl/",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "🚒",
        desc: "Crisisbeheersing, brandweerkazerne Hoorn, rampeninstructies en veiligheidstips.",
        tags: ["brandweer", "crisis", "rampen", "veiligheid", "ggd"]
    },

    // 4. BOUWPROJECTEN & WIJKEN
    {
        title: "Hoorn Bouwt (Bouwprojecten Portaal)",
        url: "https://bouwprojecten.hoorn.nl/",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🏗️",
        desc: "Het centrale overzicht van alle lopende nieuwbouw- en herontwikkelingsprojecten per wijk.",
        tags: ["bouw", "nieuwbouw", "projecten", "woningen", "ontwikkeling"]
    },
    {
        title: "Poort van Hoorn",
        url: "https://www.hoorn.nl/poort-van-hoorn",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🚉",
        desc: "Herinrichting stationsgebied met nieuwbouw van woningen, verplaatst busstation en P+R.",
        tags: ["poort van hoorn", "station", "nieuwbouw", "stationsgebied", "busstation"]
    },
    {
        title: "Kansen voor de Kersenboogerd",
        url: "https://www.hoornkersenboogerd.nl/",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🏡",
        desc: "Grootschalige wijkverbetering voor de Kersenboogerd: vergroening, nieuwbouw en winkelcentrum.",
        tags: ["kersenboogerd", "wijkvernieuwing", "groen", "winkelgebied", "leefbaarheid"]
    },
    {
        title: "Stadsstrand Hoorn",
        url: "https://www.hoorn.nl/stadsstrand",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🏖️",
        desc: "Het grootste stadsstrand van Nederland aan het Markermeer met strandpaviljoens en recreatie.",
        tags: ["stadsstrand", "strand", "markermeer", "recreatie", "zwemmen", "zomer"]
    },
    {
        title: "Holenkwartier",
        url: "https://www.holenkwartier.nl/",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🏢",
        desc: "Moderne industriële nieuwbouwwijk met woningen en creatieve bedrijvigheid op het oude Philips-terrein.",
        tags: ["holenkwartier", "nieuwbouw", "woningen", "philips", "appartementen"]
    },
    {
        title: "Bangert Oosterpolder",
        url: "https://www.hoorn.nl/bangert-oosterpolder",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🏘️",
        desc: "De grote groene uitbreidingswijk van Hoorn en Zwaag met waterpartijen en voorzieningen.",
        tags: ["bangert oosterpolder", "nieuwbouw", "zwaag", "wonen", "uitbreiding"]
    },
    {
        title: "Warmtenet Hoorn",
        url: "https://www.warmtenethoorn.nl/",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🔥",
        desc: "Aanleg en planning van het duurzame aardgasvrije warmtenet in de wijken van Hoorn.",
        tags: ["warmtenet", "duurzaam", "aardgasvrij", "energie", "verwarming", "hvc"]
    },

    // 5. SUBSIDIES & BUURTINITIATIEVEN
    {
        title: "Buurtbudget voor Buurtfeest",
        url: "https://www.hoorn.nl/buurtbudget",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "🎉",
        desc: "Vraag tot max. € 300 vergoeding aan voor huur van materialen (springkussen, partytent, barbecue, tafels).",
        tags: ["buurtfeest", "subsidie", "vergoeding", "buurtbudget", "bbq", "feest", "tent", "springkussen"]
    },
    {
        title: "Voor Een Mooie Stad (Hoorn)",
        url: "https://www.vooreenmooiestad.nl/",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "💡",
        desc: "Gemeentelijk platform voor wijkprojecten, bewonersinitiatieven en crowdfunding in Hoorn.",
        tags: ["initiatief", "wijk", "crowdfunding", "buurt", "mooie stad", "idee"]
    },
    {
        title: "Gratis Geveltuin Aanleggen",
        url: "https://vooreenmooiestad.nl/project/geveltuintjes-hoorn/",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "🌱",
        desc: "De gemeente verwijdert gratis tegels voor je gevel en levert tuinaarde voor meer groen in de straat.",
        tags: ["geveltuin", "groen", "planten", "tuin", "gratis", "tegels"]
    },
    {
        title: "Adoptiegroen Hoorn",
        url: "https://www.hoorn.nl/adoptiegroen",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "🌳",
        desc: "Adopteer en onderhoud met buurtgenoten een openbare groenstrook, plantsoen of boomspiegel.",
        tags: ["adoptiegroen", "perkje", "bomen", "groen", "beheer", "buurt"]
    },
    {
        title: "Fixi Hoorn (Meldingen openbare ruimte)",
        url: "https://www.hoorn.nl/melding",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "🛠️",
        desc: "Meld losse stoeptegels, kapotte lantaarnpalen, zwerfafval of overlast snel via app of web.",
        tags: ["fixi", "melding", "losse tegel", "lantaarnpaal", "afval", "reparatie"]
    },
    {
        title: "Cultuurfonds Noord-Holland / Hoorn",
        url: "https://www.cultuurfonds.nl/",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "🎨",
        desc: "Financiële bijdragen voor lokale kunst-, muziek-, theater-, geschiedenis- en natuurprojecten.",
        tags: ["cultuurfonds", "subsidie", "kunst", "muziek", "projecten"]
    },

    // 6. ENERGIE & DUURZAAMHEID
    {
        title: "Gratis Energiecoaches & WarmHoorn Fixers",
        url: "https://energieloketten.nl/hoorn",
        category: "energie",
        categoryName: "Energie & Duurzaamheid",
        icon: "⚡",
        desc: "Vrijwillige coaches komen gratis langs voor een warmtescan en plaatsen tochtstrips en radiatorfolie.",
        tags: ["energiecoach", "warmtescan", "besparen", "isolatie", "gratis", "tochtstrip", "gas"]
    },
    {
        title: "Lokale Isolatiesubsidie Hoorn (NIP)",
        url: "https://klimaatroute.nl/hoorn",
        category: "energie",
        categoryName: "Energie & Duurzaamheid",
        icon: "🏠",
        desc: "Tot € 2.500 gemeentelijke subsidie voor isolatiemaatregelen bij woningen met een laag energielabel.",
        tags: ["isolatie", "subsidie", "glas", "spouwmuur", "vloer", "nip", "klimaatroute"]
    },
    {
        title: "Duurzaam Bouwloket Hoorn",
        url: "https://www.duurzaambouwloket.nl/gemeente-hoorn",
        category: "energie",
        categoryName: "Energie & Duurzaamheid",
        icon: "🌿",
        desc: "Onafhankelijk adviesloket voor warmtepompen, zonnepanelen, subsidies en verduurzaming.",
        tags: ["bouwloket", "warmtepomp", "zonnepanelen", "duurzaam", "advies"]
    },

    // 7. SPORT & BEWEGEN
    {
        title: "Sport Hoorn / Sportbedrijf",
        url: "https://www.sporthoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Overzicht van alle gemeentelijke sportaccommodaties, cursussen, sporthallen en sportstimulering.",
        tags: ["sport", "sportbedrijf", "sporthal", "cursus", "bewegen"]
    },
    {
        title: "Zwembad De Waterhoorn",
        url: "https://www.optisport.nl/locaties/waterhoorn",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🏊",
        desc: "Optisport zwemcentrum met recreatiebad, wedstrijdbad, buitenbad, glijbanen en banenzwemmen.",
        tags: ["zwembad", "waterhoorn", "zwemmen", "banenzwemmen", "zwemles", "optisport"]
    },
    {
        title: "IJsbaan De Westfries",
        url: "https://www.optisport.nl/locaties/westfries",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⛸️",
        desc: "De overdekte 400-meter kunstijsbaan van Hoorn voor recreatief schaatsen en schaatslessen.",
        tags: ["ijsbaan", "schaatsen", "westfries", "optisport", "winter"]
    },
    {
        title: "HVV Hollandia",
        url: "https://www.hvvhollandia.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Historische voetbalvereniging op Sportpark Julianapark aan het Markermeer.",
        tags: ["hollandia", "voetbal", "julianapark", "sport"]
    },
    {
        title: "Always Forward",
        url: "https://www.alwaysforward.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Grote actieve voetbalvereniging op Sportcomplex De Blauwe Berg.",
        tags: ["always forward", "voetbal", "blauwe berg", "sport"]
    },
    {
        title: "HCSV Zwaluwen '30",
        url: "https://www.zwaluwen1930.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Omnisportvereniging met veldvoetbal, zaalvoetbal (futsal) en handbal.",
        tags: ["zwaluwen", "voetbal", "zaalvoetbal", "handbal", "sport"]
    },
    {
        title: "HSV Sport 1889",
        url: "https://www.hsvsport.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Een van de oudste voetbalclubs van Nederland, gevestigd aan de Berkhouterweg.",
        tags: ["hsv sport", "voetbal", "berkhout", "sport"]
    },
    {
        title: "sv De Blokkers",
        url: "https://www.deblokkers.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Voetbalvereniging actief in Blokker en Hoorn.",
        tags: ["blokkers", "voetbal", "blokker", "sport"]
    },
    {
        title: "vv Westfriezen",
        url: "https://www.westfriezen.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Voetbal- en handbalvereniging in Zwaag en Hoorn.",
        tags: ["westfriezen", "voetbal", "handbal", "zwaag", "sport"]
    },
    {
        title: "WFHC Hoorn (Hockey)",
        url: "https://www.wfhc.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🏑",
        desc: "De West-Friese Hockeyclub met watervelden op Sportpark Zwaag.",
        tags: ["wfhc", "hockey", "zwaag", "sport"]
    },
    {
        title: "AV Hollandia (Atletiek)",
        url: "https://www.avhollandia.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🏃",
        desc: "Atletiekvereniging op De Blauwe Berg voor sprinten, werpen, springen en lange afstand.",
        tags: ["av hollandia", "atletiek", "hardlopen", "blauwe berg", "sport"]
    },
    {
        title: "Loopgroep Hoorn",
        url: "https://www.loopgroephoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "👟",
        desc: "Gezellige hardloopvereniging voor beginners tot marathonlopers.",
        tags: ["loopgroep", "hardlopen", "marathon", "conditie", "sport"]
    },
    {
        title: "Tennisvereniging Hoorn",
        url: "https://www.tvhoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🎾",
        desc: "Tennis- en padelvereniging met binnen- en buitenbanen aan de Drieboomlaan.",
        tags: ["tennis", "padel", "tv hoorn", "sport", "racket"]
    },
    {
        title: "Tennisvereniging De Hulk",
        url: "https://www.tvdehulk.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🎾",
        desc: "Tennisvereniging gelegen nabij natuurgebied De Hulk en de Grote Waal.",
        tags: ["tennis", "de hulk", "grote waal", "sport"]
    },
    {
        title: "Watersportvereniging WSV Hoorn",
        url: "https://www.wsvhoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⛵",
        desc: "Zeilen, jachthavenfaciliteiten en sloep-/coastal roeien op het Markermeer bij het Julianapark.",
        tags: ["wsv", "zeilen", "roeien", "haven", "watersport", "markermeer"]
    },
    {
        title: "Hoornse Reddingsbrigade",
        url: "https://www.reddingsbrigadehoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🛟",
        desc: "Zwemmend redden, bewaking van evenementen en waterhulpverlening.",
        tags: ["reddingsbrigade", "zwemmen", "water", "hulpverlening", "veiligheid"]
    },
    {
        title: "Schaakvereniging Caïssa-Eenhoorn",
        url: "https://www.caissa-eenhoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "♟️",
        desc: "Bloeiende schaakclub voor jeugd en senioren met wekelijkse clubavonden en toernooien.",
        tags: ["schaken", "denksport", "caissa", "toernooi", "club"]
    },
    {
        title: "Jeugdfonds Sport & Cultuur",
        url: "https://jeugdfondssportencultuur.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🎟️",
        desc: "Vergoedt de contributie en sportkleding voor kinderen uit gezinnen met weinig geld.",
        tags: ["jeugdfonds", "contributie", "gratis sport", "subsidie", "kinderen"]
    },

    // 8. CULTUUR & EVENEMENTEN
    {
        title: "Kermis Hoorn (met Lappendag)",
        url: "https://www.kermis-hoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎡",
        desc: "De op één na oudste en grootste kermis van Nederland (jaarlijks in augustus) met de iconische Lappendag.",
        tags: ["kermis", "lappendag", "feest", "attracties", "augustus", "evenement"]
    },
    {
        title: "inHoorn.nl (Toerisme & Uitagenda)",
        url: "https://www.inhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🗺️",
        desc: "Officiële vrijetijdsgids van Hoorn: evenementenkalender, horeca, winkelen en bezienswaardigheden.",
        tags: ["inhoorn", "uitagenda", "toerisme", "evenementen", "uitgaan", "eten"]
    },
    {
        title: "Westfriese Uitagenda",
        url: "https://www.westfrieseuitagenda.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎭",
        desc: "Volledige culturele en uitgaansagenda voor Hoorn en de hele regio West-Friesland.",
        tags: ["uitagenda", "theater", "concert", "weekend", "cultuur"]
    },
    {
        title: "Cultuurweekend Hoorn",
        url: "https://www.cultuurweekendhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎻",
        desc: "Het jaarlijkse culturele openingsfestival in september met de Havenconcerten en grote Kunstmarkt.",
        tags: ["cultuurweekend", "havenconcerten", "kunstmarkt", "festival", "september"]
    },
    {
        title: "Schouwburg Het Park",
        url: "https://www.hetpark.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🏛️",
        desc: "Het grote theater aan het Markermeer voor cabaret, toneel, musicals, klassiek en concerten.",
        tags: ["het park", "schouwburg", "theater", "cabaret", "musical", "concert"]
    },
    {
        title: "Poppodium Manifesto",
        url: "https://www.manifesto-hoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎸",
        desc: "Poppodium voor live concerten, dance-events, tribute bands en optredens van nieuw muziektalent.",
        tags: ["manifesto", "poppodium", "concert", "dance", "feest", "muziek"]
    },
    {
        title: "Cinema Oostereiland",
        url: "https://www.cinemaoostereiland.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎬",
        desc: "Filmhuis en cultuurpodium op het historische Oostereiland voor arthouse films, documentaires en horeca.",
        tags: ["cinema", "film", "filmhuis", "oostereiland", "bioscoop"]
    },
    {
        title: "Ironman 70.3 Westfriesland",
        url: "https://www.ironman.com/im703-westfriesland",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🏅",
        desc: "Het internationale triatlonevenement met start, parcours en finish in en rondom Hoorn.",
        tags: ["ironman", "triatlon", "sportevenement", "zwemmen", "fietsen", "hardlopen"]
    },
    {
        title: "Hoornse Havenfeesten",
        url: "https://www.havenfeesten-hoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "⚓",
        desc: "Groot maritiem feest in de historische havens met schepen, live muziek en demonstraties.",
        tags: ["havenfeesten", "haven", "boten", "schepen", "feest", "maritiem"]
    },
    {
        title: "Westfries Museum",
        url: "https://www.westfriesmuseum.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🏺",
        desc: "Rijke geschiedenis van Hoorn en West-Friesland (met actuele pop-up presentaties in de binnenstad).",
        tags: ["westfries museum", "museum", "geschiedenis", "historie", "voc", "erfgoed"]
    },
    {
        title: "Museum van de 20e Eeuw",
        url: "https://www.museumhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "📺",
        desc: "Nostalgisch museum op het Oostereiland over het dagelijks leven, speelgoed, interieurs en radio/tv.",
        tags: ["museum 20e eeuw", "nostalgie", "oostereiland", "lego", "kinderen", "geschiedenis"]
    },
    {
        title: "Museumstoomtram Hoorn-Medemblik",
        url: "https://www.stoomtram.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🚂",
        desc: "Historische stoomtram en bootreizen door het prachtige West-Friese landschap.",
        tags: ["stoomtram", "trein", "stoomboot", "medemblik", "uitje", "historie"]
    },
    {
        title: "Vereniging Oud Hoorn",
        url: "https://www.oudhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🏰",
        desc: "Historische vereniging met een grote beeldbank, documentatiecentrum, lezingen en stadswandelingen.",
        tags: ["oud hoorn", "beeldbank", "monumenten", "historie", "wandeling"]
    },
    {
        title: "Westfries Archief",
        url: "https://www.westfriesarchief.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "📚",
        desc: "Historische aktes, stamboomonderzoek, oude foto's en originele bouwtekeningen van woningen in Hoorn.",
        tags: ["archief", "stamboom", "bouwtekening", "kadaster", "geschiedenis"]
    },
    {
        title: "Bibliotheek Hoorn",
        url: "https://www.bibliotheekhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "📖",
        desc: "Locaties in Binnenstad, Kersenboogerd en Risdam voor boeken, cursussen, taallessen en lezingen.",
        tags: ["bibliotheek", "boeken", "lezen", "studeren", "taallessen", "cursus"]
    },
    {
        title: "Oosterkerk Hoorn",
        url: "https://www.oosterkerkhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "⛪",
        desc: "Monumentale voormalige schipperskerk uit 1519, nu in gebruik voor concerten en evenementen.",
        tags: ["oosterkerk", "kerk", "monument", "concert", "historie"]
    },
    {
        title: "Koepelkerk Hoorn",
        url: "https://www.koepelkerk.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "⛪",
        desc: "De markante rooms-katholieke koepelkerk (H. Cyriacus en Franciscus) in de binnenstad.",
        tags: ["koepelkerk", "kerk", "katholiek", "monument", "architectuur"]
    },
    {
        title: "Noorderkerk Hoorn",
        url: "https://www.noorderkerkhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "⛪",
        desc: "Laatgotische kerk aan het Kleine Noord met rijk interieur en culturele activiteiten.",
        tags: ["noorderkerk", "kerk", "monument", "kleine noord", "historie"]
    },

    // 9. ZORG, WELZIJN & WONEN
    {
        title: "1.Hoorn (Sociaal Loket)",
        url: "https://www.1hoorn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🤝",
        desc: "Centrale toegang voor zorg, Wmo, jeugdhulp, schuldhulpverlening en ondersteuning bij een laag inkomen.",
        tags: ["1.hoorn", "wmo", "jeugdzorg", "uitkering", "schuldhulp", "zorg"]
    },
    {
        title: "HoornPas & Meedoenbudget",
        url: "https://www.1hoorn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "💳",
        desc: "Jaarlijks tegoed voor inwoners met een laag inkomen voor sport, theater, musea en kermistegoed voor kinderen.",
        tags: ["hoornpas", "meedoenbudget", "minima", "korting", "laag inkomen", "kermis"]
    },
    {
        title: "Kindpakket Hoorn",
        url: "https://www.1hoorn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🎒",
        desc: "Gratis zwemles (diploma A), laptopregeling voor scholieren en schoolspullen voor gezinnen met krap budget.",
        tags: ["kindpakket", "zwemles", "laptop", "school", "kinderen", "gratis"]
    },
    {
        title: "Stichting Leergeld West-Friesland",
        url: "https://www.leergeldwestfriesland.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🚲",
        desc: "Ondersteuning voor kinderen bij schoolkosten, fietsen, sportkleding en schoolreisjes.",
        tags: ["leergeld", "fiets", "schoolspullen", "kinderen", "armoede"]
    },
    {
        title: "Voedselbank West-Friesland",
        url: "https://www.voedselbankwestfriesland.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🍞",
        desc: "Noodhulp met wekelijkse voedselpakketten voor huishoudens in financiële nood.",
        tags: ["voedselbank", "voedselpakket", "eten", "hulp", "minima"]
    },
    {
        title: "Stichting Netwerk (Wijkcentra)",
        url: "https://www.netwerkhoorn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🏠",
        desc: "Wijkcentra De Huesmolen, Kersenboogerd, De Zaagtand en De Grote Waal voor activiteiten en ontmoeting.",
        tags: ["wijkcentrum", "netwerk", "jongerenwerk", "buurthuis", "zaagtand", "huesmolen"]
    },
    {
        title: "Vrijwilligerspunt Westfriesland",
        url: "https://www.vrijwilligerspunt.com/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🤲",
        desc: "Centrale vacaturebank en adviesbureau voor vrijwilligers en lokale verenigingen.",
        tags: ["vrijwilligers", "vacatures", "helpen", "stichting", "cursus"]
    },
    {
        title: "Gratis Vrijwilligersverzekering",
        url: "https://www.hoorn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🛡️",
        desc: "Automatische ongevallen- en aansprakelijkheidsdekking voor alle vrijwilligers en mantelzorgers in Hoorn.",
        tags: ["vrijwilligersverzekering", "verzekering", "dekking", "mantelzorg"]
    },
    {
        title: "Mantelzorgcentrum West-Friesland",
        url: "https://www.mantelzorgcentrum.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "💜",
        desc: "Onafhankelijk advies, emotionele steun, cursussen en respijtzorg voor mantelzorgers.",
        tags: ["mantelzorg", "zorg", "respijtzorg", "ondersteuning"]
    },
    {
        title: "Dijklander Ziekenhuis",
        url: "https://www.dijklander.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🏥",
        desc: "Ziekenhuislocatie Hoorn aan de Maelsonstraat voor polikliniek, opnames en specialistische zorg.",
        tags: ["ziekenhuis", "dijklander", "dokter", "afspraak", "specialist"]
    },
    {
        title: "GGD Hollands Noorden",
        url: "https://www.ggdhn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "💉",
        desc: "Consultatiebureaus, jeugdgezondheidszorg, vaccinaties en infectieziektebestrijding in Hoorn.",
        tags: ["ggd", "consultatiebureau", "vaccinatie", "baby", "gezondheid"]
    },
    {
        title: "Veilig Thuis Noord-Holland Noord",
        url: "https://www.veiligthuisnhn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🛡️",
        desc: "Het centrale advies- en meldpunt voor huiselijk geweld en kindermishandeling.",
        tags: ["veilig thuis", "huiselijk geweld", "hulp", "kindermishandeling", "veiligheid"]
    },
    {
        title: "Omring Hoorn (Thuiszorg & Woonzorg)",
        url: "https://www.omring.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "👵",
        desc: "Thuiszorg, revalidatiezorg en woonzorglocaties zoals Lindendael en Westerhaven.",
        tags: ["omring", "thuiszorg", "ouderenzorg", "lindendael", "westerhaven"]
    },
    {
        title: "WilgaerdenLeekerweideGroep (WLGroep)",
        url: "https://www.wlgroep.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🏡",
        desc: "Zorglocaties, dagbesteding en seniorenzorg (o.a. Woonzorgcentrum Avondlicht en De Huesmolen).",
        tags: ["wlgroep", "wilgaerden", "dagbesteding", "senioren", "zorgcentrum"]
    },
    {
        title: "KBO Noord-Holland / Hoorn",
        url: "https://www.kbonoordholland.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🧓",
        desc: "Belangenvereniging voor senioren met wekelijkse activiteiten, reizen en hulp bij belastingaangifte.",
        tags: ["kbo", "senioren", "ouderen", "activiteiten", "belastinghulp"]
    },
    {
        title: "Intermaris",
        url: "https://www.intermaris.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🏢",
        desc: "De grootste sociale woningcorporatie voor huurwoningen in Hoorn en omstreken.",
        tags: ["intermaris", "huurwoning", "sociale huur", "woningbouw", "reparatie"]
    },
    {
        title: "Woonmatch West-Friesland",
        url: "https://www.woonmatchwestfriesland.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🔑",
        desc: "Het centrale platform voor het inschrijven en reageren op sociale huurwoningen in de regio.",
        tags: ["woonmatch", "huurwoning", "inschrijven", "woningzoekende"]
    },

    // 10. SCHOLEN & ONDERWIJS
    {
        title: "Stichting Talent (Basisonderwijs)",
        url: "https://www.talenthoorn.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🏫",
        desc: "Koepelorganisatie voor alle openbare basisscholen in Hoorn, Zwaag en Blokker.",
        tags: ["basisschool", "talent", "openbaar onderwijs", "kinderen", "groep 1-8"]
    },
    {
        title: "Stichting Allure (Basisonderwijs)",
        url: "https://www.stichtingallure.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🏫",
        desc: "Koepelorganisatie voor katholiek en interconfessioneel primair onderwijs in West-Friesland.",
        tags: ["allure", "basisschool", "katholiek onderwijs", "scholen"]
    },
    {
        title: "Stichting Kinderkoepel",
        url: "https://www.kinderkoepel.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "👶",
        desc: "Kinderdagverblijven, peuterspeelzalen en buitenschoolse opvang (BSO) in Hoorn.",
        tags: ["kinderopvang", "kinderkoepel", "peuterspeelzaal", "bso", "baby"]
    },
    {
        title: "Berend Botje Hoorn",
        url: "https://www.berendbotje.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🧸",
        desc: "Professionele kinderopvang, peutergroepen en gastouderopvang in Hoorn.",
        tags: ["berend botje", "kinderopvang", "gastouder", "peuters", "bso"]
    },
    {
        title: "Copernicus SG (Atlas College)",
        url: "https://www.copernicushoorn.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🎓",
        desc: "Scholengemeenschap voor mavo, havo en vwo (met o.a. sport- en kunstklassen).",
        tags: ["copernicus", "middelbare school", "mavo", "havo", "vwo", "atlas college"]
    },
    {
        title: "Tabor College (Werenfridus, d'Ampte, Oscar Romero)",
        url: "https://www.tabor.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🎓",
        desc: "Drie scholengemeenschappen in Hoorn van praktijkonderwijs en vmbo tot tweetalig vwo/gymnasium.",
        tags: ["tabor", "werenfridus", "dampte", "oscar romero", "middelbare school"]
    },
    {
        title: "SG Newton (Atlas College)",
        url: "https://www.sgnewton.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🔧",
        desc: "Praktijkgericht en modern vmbo- en mavo-onderwijs in Hoorn.",
        tags: ["newton", "vmbo", "mavo", "techniek", "middelbare school"]
    },
    {
        title: "Vonk Hoorn",
        url: "https://www.vonknh.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🌱",
        desc: "Praktijkgericht vmbo en mbo in o.a. groen, techniek, voeding, zorg en dierverzorging.",
        tags: ["vonk", "clusius", "vmbo", "mbo", "groen", "dieren", "techniek"]
    },
    {
        title: "Talland College Hoorn",
        url: "https://www.talland.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🏛️",
        desc: "Groot regionaal MBO-opleidingscentrum (voorheen Horizon College) voor tientallen beroepsopleidingen.",
        tags: ["talland", "horizon college", "mbo", "opleiding", "studeren", "beroepsonderwijs"]
    },

    // 11. VERVOER, HAVENS & VERKEER
    {
        title: "NS Reisplanner (Station Hoorn & Kersenboogerd)",
        url: "https://www.ns.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚆",
        desc: "Actuele vertrektijden, spoorwijzigingen en reisplanner voor treinverkeer van en naar Hoorn.",
        tags: ["ns", "trein", "station", "station kersenboogerd", "reisplanner", "intercity"]
    },
    {
        title: "MeerPlus / EBS Bussen West-Friesland",
        url: "https://www.meerplus.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚌",
        desc: "Lijnennet en dienstregeling van stads- en streekbussen in Hoorn en omliggende dorpen.",
        tags: ["bus", "meerplus", "ebs", "bushalte", "dienstregeling", "stadsbus"]
    },
    {
        title: "Regiotaxi West-Friesland",
        url: "https://www.hoorn.nl/regiotaxi",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚕",
        desc: "Deeltaxivervoer van deur tot deur voor Wmo-geïndiceerden en senioren.",
        tags: ["regiotaxi", "taxi", "wmo", "senioren", "deeltaxi"]
    },
    {
        title: "Greenwheels Deelauto's Hoorn",
        url: "https://www.greenwheels.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚗",
        desc: "Deelauto's huren per uur bij o.a. Station Hoorn en locaties in de binnenstad.",
        tags: ["greenwheels", "deelauto", "huren", "station", "autodelen"]
    },
    {
        title: "Parkeren in Hoorn",
        url: "https://www.hoorn.nl/parkeren",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🅿️",
        desc: "Parkeertarieven, vergunningen, zones en garages ('t Jeudje, Het Park, Noorderveemarkt).",
        tags: ["parkeren", "parkeergarage", "jeudje", "het park", "tarieven", "vergunning"]
    },
    {
        title: "Werk aan de weg (Hoorn.nl)",
        url: "https://www.hoorn.nl/werk-aan-de-weg",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚧",
        desc: "Actuele wegafsluitingen, asfalteringsprojecten en verkeersomleidingen in Hoorn.",
        tags: ["werkzaamheden", "afsluiting", "omleiding", "asfalt", "weg"]
    },
    {
        title: "NH Bereikbaar",
        url: "https://www.nhbereikbaar.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🛣️",
        desc: "Werkzaamheden aan provinciale wegen en grote verkeersaders in West-Friesland.",
        tags: ["nh bereikbaar", "provinciale weg", "a7", "verkeer", "omleiding"]
    },
    {
        title: "Havens Hoorn / Havendienst",
        url: "https://www.hoorn.nl/havens",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "⛵",
        desc: "Havenfaciliteiten Binnenhaven, Buitenhaven, Grashaven en contact Havenmeester (06 54 20 28 28, VHF 74).",
        tags: ["havenmeester", "havens", "ligplaats", "binnenhaven", "grashaven", "marifoon"]
    },
    {
        title: "Watertaxi Hoorn & Rondvaarten",
        url: "https://www.watertaxihoorn.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🛥️",
        desc: "Historische rondvaarten door de grachten en havens van Hoorn of varen op bestelling.",
        tags: ["watertaxi", "rondvaart", "grachten", "varen", "bootje"]
    },

    // 12. PARKEN, NATUUR & HONDEN
    {
        title: "Hondenlosloopgebieden Hoorn",
        url: "https://www.hoorn.nl/honden",
        category: "parken",
        categoryName: "Parken & Natuur",
        icon: "🐕",
        desc: "Overzichtskaart van alle officiële losloopzones, uitrenvelden en hondenstranden.",
        tags: ["hond", "losloopgebied", "uitlaten", "hondenstrand", "dieren"]
    },
    {
        title: "Wandelnetwerk Noord-Holland (West-Friesland)",
        url: "https://www.wandelnetwerknoordholland.nl/",
        category: "parken",
        categoryName: "Parken & Natuur",
        icon: "🥾",
        desc: "Mooie gemarkeerde wandelroutes langs de historische havens en over de Westfriese Omringdijk.",
        tags: ["wandelen", "routes", "omringdijk", "wandelnetwerk", "natuur"]
    },
    {
        title: "Speeltuin De Speelhoorn",
        url: "https://www.speelhoorn.nl/",
        category: "parken",
        categoryName: "Parken & Natuur",
        icon: "🛝",
        desc: "Groot omheind buitenspeelpark op De Blauwe Berg met speeltoestellen, zandbakken en waterpret.",
        tags: ["speeltuin", "speelhoorn", "kinderen", "spelen", "blauwe berg"]
    },

    // 13. MARKTEN, WINKELS & BEDRIJVIGHEID
    {
        title: "Weekmarkten Hoorn",
        url: "https://www.hoorn.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🧀",
        desc: "Zaterdagmarkt Binnenstad (09-17u), Dinsdagmarkt Kersenboogerd (08:30-16u) en Woensdagmarkt Risdam (08:30-16u).",
        tags: ["markt", "weekmarkt", "zaterdagmarkt", "boodschappen", "kaas", "vis"]
    },
    {
        title: "RataPlan Kringloopwinkel (Zwaag/Hoorn)",
        url: "https://rataplan.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "♻️",
        desc: "Grote kringloopwinkel aan De Marowijne / Oude Veiling voor meubels, kleding, boeken en elektronica.",
        tags: ["kringloop", "rataplan", "noppes", "tweedehands", "vintage", "meubels"]
    },
    {
        title: "Repair Café Hoorn",
        url: "https://www.netwerkhoorn.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🔧",
        desc: "Gratis hulp van handige vrijwilligers bij het repareren van apparaten, kleding en speelgoed.",
        tags: ["repair cafe", "repareren", "duurzaam", "gratis", "netwerk"]
    },
    {
        title: "Ondernemers Federatie Hoorn (OFH)",
        url: "https://www.ondernemersfederatiehoorn.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "💼",
        desc: "Koepelorganisatie voor alle bedrijventerreinen en ondernemersverenigingen in Hoorn.",
        tags: ["ondernemers", "ofh", "bedrijven", "bedrijventerrein", "economie"]
    },
    {
        title: "Hoornse Ondernemers Compagnie (HOC)",
        url: "https://www.hoc.nu/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🤝",
        desc: "Netwerkvereniging voor ondernemers en directeuren in de regio Hoorn.",
        tags: ["hoc", "ondernemers", "netwerk", "bedrijven"]
    },
    {
        title: "Ondernemers Stad Hoorn (OSH)",
        url: "https://www.ondernemersstadhoorn.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🛍️",
        desc: "Samenwerkingsverband van binnenstadondernemers, winkeliers en horecagelegenheden.",
        tags: ["osh", "binnenstad", "winkeliers", "horeca", "winkelen"]
    },
    {
        title: "Pact van Westfriesland",
        url: "https://www.westfriesland.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🌐",
        desc: "Regionale samenwerking tussen de 7 West-Friese gemeenten, onderwijs en ondernemers.",
        tags: ["pact", "westfriesland", "economie", "regio", "samenwerking"]
    },
    {
        title: "Hotel Oostereiland",
        url: "https://www.hoteloostereiland.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🏨",
        desc: "Overnachten in de historische monumentale voormalige gevangenis op het Oostereiland.",
        tags: ["hotel", "oostereiland", "overnachten", "slapen", "toerisme"]
    },
    {
        title: "Van der Valk Hotel Hoorn",
        url: "https://www.hotelhoorn.com/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🏨",
        desc: "Groot 4-sterren hotel aan de A7 met zwembad, wellness, bioscoop en restaurants.",
        tags: ["van der valk", "hotel", "restaurant", "a7", "overnachten"]
    },
    {
        title: "HVC Groep (Afvalkalender Hoorn)",
        url: "https://www.hvcgroep.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🗑️",
        desc: "Ophaaldagen voor restafval, GFT, plastic/papier, afvalpas en grofvuilafspraken in Hoorn.",
        tags: ["afval", "hvc", "afvalkalender", "grofvuil", "kliko", "container", "vuilnis"]
    },
    {
        title: "Dierenasiel & Knaagdierencentrum Hoorn",
        url: "https://www.dierenbescherming.nl/dierenasiel-en-knaagdierencentrum-hoorn",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🐶",
        desc: "Opvang, verzorging en adoptie van honden, katten en knaagdieren aan de Schellinkhouterdijk.",
        tags: ["dierenasiel", "asiel", "hond", "kat", "adopteren", "dieren"]
    }
];

const CATEGORIES = [
    { id: "all", name: "🌟 Alles", icon: "🌟" },
    { id: "nieuws", name: "📰 Nieuws", icon: "📰" },
    { id: "gemeente", name: "🏛️ Gemeente", icon: "🏛️" },
    { id: "spoed", name: "🚑 Spoed & Nood", icon: "🚑" },
    { id: "subsidie", name: "💰 Subsidies", icon: "💰" },
    { id: "sport", name: "⚽ Sport", icon: "⚽" },
    { id: "cultuur", name: "🎭 Cultuur & Kermis", icon: "🎭" },
    { id: "zorg", name: "🤝 Zorg & Hulp", icon: "🤝" },
    { id: "bouw", name: "🏗️ Bouw & Wijken", icon: "🏗️" },
    { id: "energie", name: "⚡ Duurzaamheid", icon: "⚡" },
    { id: "onderwijs", name: "🏫 Onderwijs", icon: "🏫" },
    { id: "vervoer", name: "🚍 Vervoer & Havens", icon: "🚍" },
    { id: "parken", name: "🌳 Parken & Honden", icon: "🌳" },
    { id: "winkels", name: "🛍️ Markten & Ondernemen", icon: "🛍️" }
];

document.addEventListener('DOMContentLoaded', () => {
    let activeCategory = "all";
    let searchQuery = "";

    const categoryButtonsContainer = document.getElementById("categoryButtonsContainer");
    const cardsGrid = document.getElementById("cardsGrid");
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const resultsCount = document.getElementById("resultsCount");
    const activeCategoryTitle = document.getElementById("activeCategoryTitle");
    const noResults = document.getElementById("noResults");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");

    // Lappendag Elements
    const startLappendagBtn = document.getElementById("startLappendagBtn");
    const appContainer = document.getElementById("appContainer");
    const backBtn = document.getElementById("backBtn");
    const frame = document.getElementById("site-frame");
    const loading = document.getElementById("site-loading");
    const errorContainer = document.getElementById("site-error");

    let isLappendagLoaded = false;

    // Render Category Buttons
    function renderCategoryButtons() {
        categoryButtonsContainer.innerHTML = "";
        
        CATEGORIES.forEach(cat => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `cat-btn ${cat.id === activeCategory ? 'active' : ''}`;
            btn.dataset.category = cat.id;

            // Count items
            const count = cat.id === "all" 
                ? HOORN_LINKS.length 
                : HOORN_LINKS.filter(l => l.category === cat.id).length;

            btn.innerHTML = `
                <span>${cat.name}</span>
                <span class="cat-count">${count}</span>
            `;

            btn.addEventListener("click", () => {
                activeCategory = cat.id;
                document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderCards();
            });

            categoryButtonsContainer.appendChild(btn);
        });
    }

    // Filter and Render Cards
    function renderCards() {
        const query = searchQuery.toLowerCase().trim();

        const filtered = HOORN_LINKS.filter(link => {
            const matchesCategory = activeCategory === "all" || link.category === activeCategory;
            
            if (!matchesCategory) return false;
            if (!query) return true;

            const inTitle = link.title.toLowerCase().includes(query);
            const inDesc = link.desc.toLowerCase().includes(query);
            const inTags = link.tags.some(tag => tag.toLowerCase().includes(query));
            const inCat = link.categoryName.toLowerCase().includes(query);

            return inTitle || inDesc || inTags || inCat;
        });

        // Update Title and Counter
        const currentCatObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];
        activeCategoryTitle.textContent = query 
            ? `Zoekresultaten voor "${query}" in ${currentCatObj.name}` 
            : currentCatObj.name;
            
        resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'link' : 'links'}`;

        cardsGrid.innerHTML = "";

        if (filtered.length === 0) {
            noResults.hidden = false;
            cardsGrid.hidden = true;
        } else {
            noResults.hidden = true;
            cardsGrid.hidden = false;

            filtered.forEach(link => {
                const card = document.createElement("a");
                card.href = link.url;
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                card.className = "card-item";

                // Domain name for preview
                let domain = "";
                try {
                    domain = new URL(link.url).hostname.replace(/^www\./, '');
                } catch (_) {
                    domain = link.url;
                }

                card.innerHTML = `
                    <div>
                        <div class="card-top">
                            <div class="card-icon-box">${link.icon}</div>
                            <div class="card-title-group">
                                <div class="card-title">
                                    <span>${link.title}</span>
                                    <span class="card-arrow">↗</span>
                                </div>
                                <span class="card-badge">${link.categoryName}</span>
                            </div>
                        </div>
                        <p class="card-desc">${link.desc}</p>
                    </div>
                    <div class="card-footer">
                        <span class="card-url-preview">${domain}</span>
                        <span>Openen ↗</span>
                    </div>
                `;

                cardsGrid.appendChild(card);
            });
        }
    }

    // Search input handler
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        clearSearchBtn.hidden = searchQuery.length === 0;
        renderCards();
    });

    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        clearSearchBtn.hidden = true;
        searchInput.focus();
        renderCards();
    });

    resetFiltersBtn.addEventListener("click", () => {
        activeCategory = "all";
        searchQuery = "";
        searchInput.value = "";
        clearSearchBtn.hidden = true;
        document.querySelectorAll(".cat-btn").forEach(b => {
            b.classList.toggle("active", b.dataset.category === "all");
        });
        renderCards();
    });

    // Lappendag Integration (in-page runner)
    if (startLappendagBtn) {
        startLappendagBtn.addEventListener("click", async () => {
            const repo = "daanbrouwer0-collab/Lappendag";
            
            if (isLappendagLoaded) {
                appContainer.hidden = false;
                return;
            }

            loading.hidden = false;

            try {
                const tryBases = [
                    `https://cdn.jsdelivr.net/gh/${repo}@main`,
                    `https://raw.githubusercontent.com/${repo}/main`
                ];

                let htmlRaw = "";
                let base = "";

                for (const tryBase of tryBases) {
                    try {
                        const res = await fetch(`${tryBase}/index.html`, { cache: "no-cache" });
                        if (res.ok) {
                            htmlRaw = await res.text();
                            base = tryBase;
                            break;
                        }
                    } catch (_) {}
                }

                if (!htmlRaw) throw new Error("Kon Lappendag niet laden.");

                // Rewrite base
                if (!/<base\s/i.test(htmlRaw)) {
                    htmlRaw = htmlRaw.replace(/<head([^>]*)>/i, `<head$1><base href="${base}/">`);
                }

                frame.onload = () => {
                    loading.hidden = true;
                    appContainer.hidden = false;
                    isLappendagLoaded = true;
                };

                frame.srcdoc = htmlRaw;
            } catch (err) {
                loading.hidden = true;
                if (errorContainer) {
                    errorContainer.hidden = false;
                }
            }
        });
    }

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            appContainer.hidden = true;
            document.title = "Voorhoorn - Startportaal Hoorn";
        });
    }

    // Initial render
    renderCategoryButtons();
    renderCards();
});
