const HOORN_LINKS = [
    // 1. NIEUWS & MEDIA
    {
        id: "hoornnieuws",
        title: "Hoornnieuws",
        url: "https://www.hoornnieuws.nl/",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📰",
        desc: "Actueel 112-nieuws, politiek, stadsnieuws en achtergronden uit Hoorn en omgeving.",
        tags: ["nieuws", "112", "politiek", "actualiteit", "krant"]
    },
    {
        id: "streekomroep-wf",
        title: "Streekomroep West-Friesland (WEEFF / HoornRadio)",
        url: "https://www.streekomroepwestfriesland.nl/",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📻",
        desc: "Publieke streekomroep met radio, tv-uitzendingen, podcasts en video's ('van Hoorn zeggen').",
        tags: ["omroep", "radio", "weeff", "tv", "podcasts", "video", "nieuws"]
    },
    {
        id: "hoornsdagblad",
        title: "Hoornsdagblad.nl",
        url: "https://www.hoornsdagblad.nl/",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "🗞️",
        desc: "Digitaal lokaal dagblad met het laatste nieuws, cultuur en interviews uit de stad.",
        tags: ["dagblad", "krant", "artikelen", "nieuws"]
    },
    {
        id: "rodi-nieuwsblad-hoorn",
        title: "Rodi Media / Nieuwsblad Hoorn",
        url: "https://www.rodi.nl/hoorn",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📑",
        desc: "Digitaal huis-aan-huisblad Nieuwsblad Hoorn met lokaal verenigings- en stadsnieuws.",
        tags: ["rodi", "huis-aan-huis", "nieuwsblad", "krant", "nieuws"]
    },
    {
        id: "weekblad-zondag",
        title: "Weekblad Zondag",
        url: "https://www.weekbladzondag.nl/",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "🗞️",
        desc: "Populair regionaal weekblad met lokaal sport-, verenigings- en stadsnieuws.",
        tags: ["weekblad", "zondag", "krant", "sport", "nieuws"]
    },
    {
        id: "nh-nieuws-wf",
        title: "NH Nieuws (West-Friesland)",
        url: "https://www.nhnieuws.nl/west-friesland",
        category: "nieuws",
        categoryName: "Nieuws & Media",
        icon: "📺",
        desc: "Regionale nieuwszender en website van de provincie Noord-Holland met actueel West-Friesland nieuws.",
        tags: ["nh nieuws", "regio", "tv", "nieuws", "west-friesland"]
    },
    {
        id: "nhd-wf",
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
        id: "gemeente-hoorn",
        title: "Gemeente Hoorn",
        url: "https://www.hoorn.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "🏛️",
        desc: "Officiële gemeentewebsite voor paspoorten, rijbewijzen, belastingen, afspraken en vergunningen.",
        tags: ["gemeente", "paspoort", "rijbewijs", "vergunning", "burgerzaken", "balie"]
    },
    {
        id: "ibabs-hoorn",
        title: "iBabs Publieksportaal (Gemeenteraad)",
        url: "https://hoorn.bestuurlijkeinformatie.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "📋",
        desc: "Vergaderkalender, live meekijken, videoarchief, moties, amendementen en officiële raadsnotulen.",
        tags: ["raad", "notulen", "vergadering", "live", "politiek", "ibabs", "besluiten"]
    },
    {
        id: "besluitenlijsten-bw",
        title: "Besluitenlijsten College van B&W",
        url: "https://hoorn.bestuurlijkeinformatie.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "⚖️",
        desc: "Officiële besluitenlijsten en documenten van de burgemeester en wethouders van Hoorn.",
        tags: ["college", "b&w", "besluiten", "burgemeester", "wethouder", "politiek"]
    },
    {
        id: "gemeenteraad-politiek",
        title: "Gemeenteraad & Politiek Hoorn",
        url: "https://hoorn.bestuurlijkeinformatie.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "👥",
        desc: "Informatie over raadsleden, politieke fracties, raadsvergaderingen en inspreken.",
        tags: ["raadsleden", "fracties", "inspreken", "democratie", "gemeente"]
    },
    {
        id: "bekendmakingen-hoorn",
        title: "Officiële Bekendmakingen Hoorn",
        url: "https://zoek.officielebekendmakingen.nl/",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "📜",
        desc: "Zoek op postcode naar bouwvergunningen, bestemmingsplannen en lokale verordeningen.",
        tags: ["vergunningen", "bekendmakingen", "bouwplannen", "bestemming", "postcode"]
    },
    {
        id: "contact-gemeente",
        title: "Contact & Openbaarheid (Gemeente Hoorn)",
        url: "https://www.hoorn.nl/contact",
        category: "gemeente",
        categoryName: "Gemeente & Bestuur",
        icon: "🔍",
        desc: "Contact met de gemeente Hoorn, openingstijden, locaties en openbaarheid van bestuur.",
        tags: ["contact", "openbaarheid", "overheid", "balie", "telefoon"]
    },

    // 3. SPOED & NOODDIENSTEN
    {
        id: "huisartsenpost-wf",
        title: "Huisartsenpost West-Friesland",
        url: "https://www.huisartsenpostwf.nl/",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "🩺",
        desc: "Spoedeisende huisartsenzorg 's avonds, 's nachts en in het weekend bij Dijklander Ziekenhuis (0229-297800).",
        tags: ["dokter", "huisarts", "spoed", "ziekenhuis", "weekend", "nacht", "nood"]
    },
    {
        id: "politie-wijkagenten",
        title: "Politie Hoorn & Wijkagenten",
        url: "https://www.politie.nl/mijn-buurt/wijkagenten",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "👮",
        desc: "Vind direct de contactgegevens van de wijkagent voor jouw wijk (Binnenstad, Risdam, Kersenboogerd, etc.).",
        tags: ["politie", "wijkagent", "veiligheid", "aangifte", "overlast", "buurt"]
    },
    {
        id: "burgernet-hoorn",
        title: "Burgernet Hoorn",
        url: "https://www.burgernet.nl/",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "🚨",
        desc: "Realtime politieoproepen en meldingen bij vermiste personen of verdachte situaties in Hoorn.",
        tags: ["burgernet", "vermissing", "dader", "veiligheid", "politie"]
    },
    {
        id: "wabp-hoorn",
        title: "WhatsApp Buurtpreventie (WABP Hoorn)",
        url: "https://www.wabp.nl/",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "📱",
        desc: "Overzicht en registratie van actieve Buurt-WhatsApp preventiegroepen in straten en wijken.",
        tags: ["whatsapp", "buurtpreventie", "wabp", "veiligheid", "buren"]
    },
    {
        id: "dierenambulance-hoorn",
        title: "Dierenambulance Hoorn e.o.",
        url: "https://www.dierenbescherming.nl/dierenambulance",
        category: "spoed",
        categoryName: "Spoed & Veiligheid",
        icon: "🐾",
        desc: "Eerste hulp en vervoer voor gewonde, zieke of gevonden dieren in Hoorn (0229-245353).",
        tags: ["dieren", "hond", "kat", "vogel", "ambulance", "spoed"]
    },
    {
        id: "vrnhn",
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
        id: "hoorn-bouwt",
        title: "Hoorn Bouwt (Bouwprojecten Portaal)",
        url: "https://bouwprojecten.hoorn.nl/",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🏗️",
        desc: "Het centrale overzicht van alle grote bouw-, nieuwbouw- en stadsontwikkelingsprojecten per wijk.",
        tags: ["bouw", "nieuwbouw", "projecten", "woningen", "ontwikkeling", "poort van hoorn", "stadsstrand"]
    },
    {
        id: "kersenboogerd-verbetering",
        title: "Kansen voor de Kersenboogerd",
        url: "https://www.hoornkersenboogerd.nl/",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🏡",
        desc: "Grootschalige wijkverbetering voor de Kersenboogerd: vergroening, nieuwbouw en winkelcentrum.",
        tags: ["kersenboogerd", "wijkvernieuwing", "groen", "winkelgebied", "leefbaarheid"]
    },
    {
        id: "holenkwartier",
        title: "Holenkwartier",
        url: "https://www.holenkwartier.nl/",
        category: "bouw",
        categoryName: "Bouw & Stadsprojecten",
        icon: "🏢",
        desc: "Moderne industriële nieuwbouwwijk met woningen en creatieve bedrijvigheid op het oude Philips-terrein.",
        tags: ["holenkwartier", "nieuwbouw", "woningen", "philips", "appartementen"]
    },
    {
        id: "warmtenet-hoorn",
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
        id: "buurtbudget-feest",
        title: "Buurtbudget voor Buurtfeest",
        url: "https://www.hoorn.nl/buurtbudget",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "🎉",
        desc: "Vraag tot max. € 300 vergoeding aan voor huur van materialen (springkussen, partytent, barbecue, tafels).",
        tags: ["buurtfeest", "subsidie", "vergoeding", "buurtbudget", "bbq", "feest", "tent", "springkussen"]
    },
    {
        id: "voor-een-mooie-stad",
        title: "Voor Een Mooie Stad (Hoorn)",
        url: "https://www.vooreenmooiestad.nl/",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "💡",
        desc: "Gemeentelijk platform voor wijkprojecten, bewonersinitiatieven, geveltuinen en crowdfunding in Hoorn.",
        tags: ["initiatief", "wijk", "crowdfunding", "buurt", "mooie stad", "idee", "geveltuin"]
    },
    {
        id: "adoptiegroen",
        title: "Adoptiegroen Hoorn",
        url: "https://www.hoorn.nl/adoptiegroen",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "🌳",
        desc: "Adopteer en onderhoud met buurtgenoten een openbare groenstrook, plantsoen of boomspiegel.",
        tags: ["adoptiegroen", "perkje", "bomen", "groen", "beheer", "buurt"]
    },
    {
        id: "fixi-hoorn",
        title: "Fixi Hoorn (Meldingen openbare ruimte)",
        url: "https://www.hoorn.nl/melding",
        category: "subsidie",
        categoryName: "Subsidies & Initiatieven",
        icon: "🛠️",
        desc: "Meld losse stoeptegels, kapotte lantaarnpalen, zwerfafval of overlast snel via app of web.",
        tags: ["fixi", "melding", "losse tegel", "lantaarnpaal", "afval", "reparatie"]
    },
    {
        id: "cultuurfonds-nh",
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
        id: "energiecoaches-warmhoorn",
        title: "Gratis Energiecoaches & WarmHoorn Fixers",
        url: "https://energieloketten.nl/hoorn",
        category: "energie",
        categoryName: "Energie & Duurzaamheid",
        icon: "⚡",
        desc: "Vrijwillige coaches komen gratis langs voor een warmtescan en plaatsen tochtstrips en radiatorfolie.",
        tags: ["energiecoach", "warmtescan", "besparen", "isolatie", "gratis", "tochtstrip", "gas"]
    },
    {
        id: "isolatiesubsidie-nip",
        title: "Lokale Isolatiesubsidie Hoorn (NIP)",
        url: "https://klimaatroute.nl/hoorn",
        category: "energie",
        categoryName: "Energie & Duurzaamheid",
        icon: "🏠",
        desc: "Tot € 2.500 gemeentelijke subsidie voor isolatiemaatregelen bij woningen met een laag energielabel.",
        tags: ["isolatie", "subsidie", "glas", "spouwmuur", "vloer", "nip", "klimaatroute"]
    },
    {
        id: "duurzaam-bouwloket",
        title: "Duurzaam Bouwloket Hoorn",
        url: "https://duurzaambouwloket.nl/hoorn",
        category: "energie",
        categoryName: "Energie & Duurzaamheid",
        icon: "🌿",
        desc: "Onafhankelijk adviesloket voor warmtepompen, zonnepanelen, subsidies en energiebesparing.",
        tags: ["bouwloket", "warmtepomp", "zonnepanelen", "duurzaam", "advies"]
    },

    // 7. SPORT & BEWEGEN
    {
        id: "hoornsport",
        title: "Sport in Hoorn (HoornSport)",
        url: "https://hoornsport.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Overzicht van alle sportverenigingen, sportaanbieders, toernooien en evenementen in Hoorn.",
        tags: ["sport", "verenigingen", "clubs", "hoornsport", "bewegen"]
    },
    {
        id: "zwembad-waterhoorn",
        title: "Zwembad De Waterhoorn",
        url: "https://www.optisport.nl/locaties/waterhoorn",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🏊",
        desc: "Optisport zwemcentrum met recreatiebad, wedstrijdbad, buitenbad, glijbanen en banenzwemmen.",
        tags: ["zwembad", "waterhoorn", "zwemmen", "banenzwemmen", "zwemles", "optisport"]
    },
    {
        id: "ijsbaan-westfries",
        title: "IJsbaan De Westfries",
        url: "https://www.optisport.nl/locaties/westfries",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⛸️",
        desc: "De overdekte 400-meter kunstijsbaan van Hoorn voor recreatief schaatsen en schaatslessen.",
        tags: ["ijsbaan", "schaatsen", "westfries", "optisport", "winter"]
    },
    {
        id: "hvv-hollandia",
        title: "HVV Hollandia",
        url: "https://www.hvvhollandia.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Historische voetbalvereniging op Sportpark Julianapark aan het Markermeer.",
        tags: ["hollandia", "voetbal", "julianapark", "sport"]
    },
    {
        id: "always-forward",
        title: "Always Forward",
        url: "https://www.alwaysforward.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Grote actieve voetbalvereniging op Sportcomplex De Blauwe Berg.",
        tags: ["always forward", "voetbal", "blauwe berg", "sport"]
    },
    {
        id: "zwaluwen-30",
        title: "HCSV Zwaluwen '30",
        url: "https://www.zwaluwen.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Omnisportvereniging in De Grote Waal met veldvoetbal, zaalvoetbal en handbal.",
        tags: ["zwaluwen", "voetbal", "zaalvoetbal", "handbal", "sport"]
    },
    {
        id: "hsv-sport",
        title: "HSV Sport 1889",
        url: "https://www.hsvsport.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Een van de oudste voetbalclubs van Nederland, gevestigd aan de Berkhouterweg.",
        tags: ["hsv sport", "voetbal", "berkhout", "sport"]
    },
    {
        id: "sv-de-blokkers",
        title: "sv De Blokkers",
        url: "https://www.blokkers.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Voetbalvereniging met actieve jeugd- en seniorenteams op het sportcomplex in Blokker.",
        tags: ["blokkers", "voetbal", "blokker", "sport"]
    },
    {
        id: "vv-westfriezen",
        title: "vv Westfriezen",
        url: "https://www.westfriezen.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⚽",
        desc: "Voetbal- en handbalvereniging in Zwaag en Hoorn.",
        tags: ["westfriezen", "voetbal", "handbal", "zwaag", "sport"]
    },
    {
        id: "wfhc-hoorn",
        title: "WFHC Hoorn (Hockey)",
        url: "https://www.wfhc.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🏑",
        desc: "De West-Friese Hockeyclub met watervelden op Sportpark Zwaag.",
        tags: ["wfhc", "hockey", "zwaag", "sport"]
    },
    {
        id: "av-hollandia",
        title: "AV Hollandia (Atletiek)",
        url: "https://www.avhollandia.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🏃",
        desc: "Atletiekvereniging op De Blauwe Berg voor sprinten, werpen, springen en lange afstand.",
        tags: ["av hollandia", "atletiek", "hardlopen", "blauwe berg", "sport"]
    },
    {
        id: "loopgroep-hoorn",
        title: "Loopgroep Hoorn",
        url: "https://www.loopgroephoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "👟",
        desc: "Gezellige hardloopvereniging voor beginners tot marathonlopers.",
        tags: ["loopgroep", "hardlopen", "marathon", "conditie", "sport"]
    },
    {
        id: "tpv-hoorn",
        title: "TPV Hoorn (Tennis & Padel)",
        url: "https://www.tpvhoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🎾",
        desc: "Tennis- en Padelvereniging Hoorn bij Sportcentrum Hoorn aan de Holenweg met binnen- en buitenbanen.",
        tags: ["tennis", "padel", "tpv hoorn", "sport", "racket", "holenweg"]
    },
    {
        id: "tpv-de-hulk",
        title: "TPV De Hulk (Tennis & Padel)",
        url: "https://www.tpvdehulk.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🎾",
        desc: "Tennis- en padelvereniging in het Dwaalpark nabij de Grote Waal en natuurgebied De Hulk.",
        tags: ["tennis", "padel", "de hulk", "grote waal", "dwaalpark", "sport"]
    },
    {
        id: "hltv-juliana",
        title: "HLTV Juliana (Tennis)",
        url: "https://www.hltvjuliana.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🎾",
        desc: "Historische Hoornse Lawn Tennisvereniging Juliana op Sportcomplex De Blauwe Berg.",
        tags: ["tennis", "juliana", "blauwe berg", "sport", "racket"]
    },
    {
        id: "wsv-hoorn",
        title: "Watersportvereniging WSV Hoorn",
        url: "https://www.wsvhoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "⛵",
        desc: "Zeilen, jachthavenfaciliteiten en sloep-/coastal roeien op het Markermeer bij het Julianapark.",
        tags: ["wsv", "zeilen", "roeien", "haven", "watersport", "markermeer"]
    },
    {
        id: "reddingsbrigade-nl",
        title: "Reddingsbrigade Nederland (Hoorn)",
        url: "https://www.reddingsbrigade.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "🛟",
        desc: "Zwemmend redden, bewaking van evenementen en waterhulpverlening in en rondom Hoorn.",
        tags: ["reddingsbrigade", "zwemmen", "water", "hulpverlening", "veiligheid"]
    },
    {
        id: "caissa-eenhoorn",
        title: "Schaakvereniging Caïssa-Eenhoorn",
        url: "https://www.caissa-eenhoorn.nl/",
        category: "sport",
        categoryName: "Sport & Bewegen",
        icon: "♟️",
        desc: "Bloeiende schaakclub voor jeugd en senioren met wekelijkse clubavonden en toernooien.",
        tags: ["schaken", "denksport", "caissa", "toernooi", "club"]
    },
    {
        id: "jeugdfonds-sport",
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
        id: "kermis-hoorn",
        title: "Kermis Hoorn (met Lappendag)",
        url: "https://www.kermis-hoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎡",
        desc: "De op één na oudste en grootste kermis van Nederland (jaarlijks in augustus) met de iconische Lappendag.",
        tags: ["kermis", "lappendag", "feest", "attracties", "augustus", "evenement"]
    },
    {
        id: "inhoorn-agenda",
        title: "inHoorn.nl (Toerisme & Uitagenda)",
        url: "https://www.inhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🗺️",
        desc: "Officiële vrijetijdsgids van Hoorn: evenementenkalender, horeca, winkelen en bezienswaardigheden.",
        tags: ["inhoorn", "uitagenda", "toerisme", "evenementen", "uitgaan", "eten"]
    },
    {
        id: "westfriese-uitagenda",
        title: "Westfriese Uitagenda",
        url: "https://www.westfrieseuitagenda.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎭",
        desc: "Volledige culturele en uitgaansagenda voor Hoorn en de hele regio West-Friesland.",
        tags: ["uitagenda", "theater", "concert", "weekend", "cultuur"]
    },
    {
        id: "cultuurweekend",
        title: "Cultuurweekend Hoorn",
        url: "https://www.cultuurweekendhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎻",
        desc: "Het jaarlijkse culturele openingsfestival in september met de Havenconcerten en grote Kunstmarkt.",
        tags: ["cultuurweekend", "havenconcerten", "kunstmarkt", "festival", "september"]
    },
    {
        id: "schouwburg-het-park",
        title: "Schouwburg Het Park",
        url: "https://www.hetpark.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🏛️",
        desc: "Het grote theater aan het Markermeer voor cabaret, toneel, musicals, klassiek en concerten.",
        tags: ["het park", "schouwburg", "theater", "cabaret", "musical", "concert"]
    },
    {
        id: "poppodium-manifesto",
        title: "Poppodium Manifesto",
        url: "https://www.manifesto-hoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎸",
        desc: "Poppodium voor live concerten, dance-events, tribute bands en optredens van nieuw muziektalent.",
        tags: ["manifesto", "poppodium", "concert", "dance", "feest", "muziek"]
    },
    {
        id: "cinema-oostereiland",
        title: "Cinema Oostereiland",
        url: "https://www.cinemaoostereiland.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🎬",
        desc: "Filmhuis en cultuurpodium op het historische Oostereiland voor arthouse films, documentaires en horeca.",
        tags: ["cinema", "film", "filmhuis", "oostereiland", "bioscoop"]
    },
    {
        id: "ironman-wf",
        title: "Ironman 70.3 Westfriesland",
        url: "https://www.ironman.com/im703-westfriesland",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🏅",
        desc: "Het internationale triatlonevenement met start, parcours en finish in en rondom Hoorn.",
        tags: ["ironman", "triatlon", "sportevenement", "zwemmen", "fietsen", "hardlopen"]
    },
    {
        id: "westfries-museum",
        title: "Westfries Museum",
        url: "https://westfriesmuseum.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🏺",
        desc: "Rijke geschiedenis van Hoorn en West-Friesland (met actuele pop-up presentaties in de binnenstad).",
        tags: ["westfries museum", "museum", "geschiedenis", "historie", "voc", "erfgoed"]
    },
    {
        id: "museum-20e-eeuw",
        title: "Museum van de 20e Eeuw",
        url: "https://www.museumhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "📺",
        desc: "Nostalgisch museum op het Oostereiland over het dagelijks leven, speelgoed, interieurs en radio/tv.",
        tags: ["museum 20e eeuw", "nostalgie", "oostereiland", "lego", "kinderen", "geschiedenis"]
    },
    {
        id: "museumstoomtram",
        title: "Museumstoomtram Hoorn-Medemblik",
        url: "https://www.stoomtram.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🚂",
        desc: "Historische stoomtram en bootreizen door het prachtige West-Friese landschap.",
        tags: ["stoomtram", "trein", "stoomboot", "medemblik", "uitje", "historie"]
    },
    {
        id: "vereniging-oud-hoorn",
        title: "Vereniging Oud Hoorn",
        url: "https://www.oudhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "🏰",
        desc: "Historische vereniging met een grote beeldbank, documentatiecentrum, lezingen en stadswandelingen.",
        tags: ["oud hoorn", "beeldbank", "monumenten", "historie", "wandeling"]
    },
    {
        id: "westfries-archief",
        title: "Westfries Archief",
        url: "https://www.westfriesarchief.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "📚",
        desc: "Historische aktes, stamboomonderzoek, oude foto's en originele bouwtekeningen van woningen in Hoorn.",
        tags: ["archief", "stamboom", "bouwtekening", "kadaster", "geschiedenis"]
    },
    {
        id: "bibliotheek-hoorn",
        title: "Bibliotheek Hoorn",
        url: "https://www.bibliotheekhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "📖",
        desc: "Locaties in Binnenstad, Kersenboogerd en Risdam voor boeken, cursussen, taallessen en lezingen.",
        tags: ["bibliotheek", "boeken", "lezen", "studeren", "taallessen", "cursus"]
    },
    {
        id: "oosterkerk",
        title: "Oosterkerk Hoorn",
        url: "https://www.oosterkerkhoorn.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "⛪",
        desc: "Monumentale voormalige schipperskerk uit 1519, nu in gebruik voor concerten en evenementen.",
        tags: ["oosterkerk", "kerk", "monument", "concert", "historie"]
    },
    {
        id: "koepelkerk",
        title: "Koepelkerk Hoorn",
        url: "https://www.koepelkerk.nl/",
        category: "cultuur",
        categoryName: "Cultuur & Evenementen",
        icon: "⛪",
        desc: "De markante rooms-katholieke koepelkerk (H. Cyriacus en Franciscus) in de binnenstad.",
        tags: ["koepelkerk", "kerk", "katholiek", "monument", "architectuur"]
    },
    {
        id: "noorderkerk",
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
        id: "minimaregelingen-hoorn",
        title: "Ondersteuning & Minimaregelingen Hoorn",
        url: "https://www.hoorn.nl/hulp-bij-laag-inkomen",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🤝",
        desc: "Centrale regelingen van de gemeente: HoornPas, Meedoenbudget, Kindpakket (gratis zwemles/laptops) en bijzondere bijstand.",
        tags: ["1.hoorn", "hoornpas", "meedoenbudget", "kindpakket", "zwemles", "minima", "bijstand", "hulp"]
    },
    {
        id: "leergeld-wf",
        title: "Stichting Leergeld West-Friesland",
        url: "https://www.leergeldwestfriesland.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🚲",
        desc: "Ondersteuning voor kinderen bij schoolkosten, fietsen, sportkleding en schoolreisjes.",
        tags: ["leergeld", "fiets", "schoolspullen", "kinderen", "armoede"]
    },
    {
        id: "voedselbanken-nl",
        title: "Voedselbanken Nederland (Regio Hoorn)",
        url: "https://voedselbanken.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🍞",
        desc: "Aanvragen en informatie over wekelijkse voedselpakketten voor huishoudens in financiële nood.",
        tags: ["voedselbank", "voedselpakket", "eten", "hulp", "minima"]
    },
    {
        id: "stichting-netwerk",
        title: "Stichting Netwerk (Wijkcentra)",
        url: "https://www.netwerkhoorn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🏠",
        desc: "Wijkcentra De Huesmolen, Kersenboogerd, De Zaagtand en De Grote Waal voor activiteiten en ontmoeting.",
        tags: ["wijkcentrum", "netwerk", "jongerenwerk", "buurthuis", "zaagtand", "huesmolen"]
    },
    {
        id: "vrijwilligerspunt-wf",
        title: "Vrijwilligerspunt Westfriesland",
        url: "https://www.vrijwilligerspunt.com/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🤲",
        desc: "Centrale vacaturebank en adviesbureau voor vrijwilligers en lokale verenigingen.",
        tags: ["vrijwilligers", "vacatures", "helpen", "stichting", "cursus"]
    },
    {
        id: "vrijwilligersverzekering",
        title: "Vrijwilligersverzekering (Gemeente Hoorn)",
        url: "https://www.hoorn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🛡️",
        desc: "Automatische ongevallen- en aansprakelijkheidsdekking voor alle vrijwilligers en mantelzorgers in Hoorn.",
        tags: ["vrijwilligersverzekering", "verzekering", "dekking", "mantelzorg"]
    },
    {
        id: "mantelzorgcentrum",
        title: "Mantelzorgcentrum West-Friesland",
        url: "https://www.mantelzorgcentrum.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "💜",
        desc: "Onafhankelijk advies, emotionele steun, cursussen en respijtzorg voor mantelzorgers.",
        tags: ["mantelzorg", "zorg", "respijtzorg", "ondersteuning"]
    },
    {
        id: "dijklander-ziekenhuis",
        title: "Dijklander Ziekenhuis",
        url: "https://www.dijklander.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🏥",
        desc: "Ziekenhuislocatie Hoorn aan de Maelsonstraat voor polikliniek, opnames en specialistische zorg.",
        tags: ["ziekenhuis", "dijklander", "dokter", "afspraak", "specialist"]
    },
    {
        id: "ggd-hn",
        title: "GGD Hollands Noorden",
        url: "https://www.ggdhn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "💉",
        desc: "Consultatiebureaus, jeugdgezondheidszorg, vaccinaties en infectieziektebestrijding in Hoorn.",
        tags: ["ggd", "consultatiebureau", "vaccinatie", "baby", "gezondheid"]
    },
    {
        id: "veilig-thuis-nhn",
        title: "Veilig Thuis Noord-Holland Noord",
        url: "https://www.veiligthuisnhn.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🛡️",
        desc: "Het centrale advies- en meldpunt voor huiselijk geweld en kindermishandeling.",
        tags: ["veilig thuis", "huiselijk geweld", "hulp", "kindermishandeling", "veiligheid"]
    },
    {
        id: "omring-hoorn",
        title: "Omring Hoorn (Thuiszorg & Woonzorg)",
        url: "https://www.omring.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "👵",
        desc: "Thuiszorg, revalidatiezorg en woonzorglocaties zoals Lindendael en Westerhaven.",
        tags: ["omring", "thuiszorg", "ouderenzorg", "lindendael", "westerhaven"]
    },
    {
        id: "wlgroep",
        title: "WilgaerdenLeekerweideGroep (WLGroep)",
        url: "https://www.wlgroep.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🏡",
        desc: "Zorglocaties, dagbesteding en seniorenzorg (o.a. Woonzorgcentrum Avondlicht en De Huesmolen).",
        tags: ["wlgroep", "wilgaerden", "dagbesteding", "senioren", "zorgcentrum"]
    },
    {
        id: "kbo-hoorn",
        title: "KBO Noord-Holland / Hoorn",
        url: "https://www.kbonoordholland.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🧓",
        desc: "Belangenvereniging voor senioren met wekelijkse activiteiten, reizen en hulp bij belastingaangifte.",
        tags: ["kbo", "senioren", "ouderen", "activiteiten", "belastinghulp"]
    },
    {
        id: "intermaris",
        title: "Intermaris",
        url: "https://www.intermaris.nl/",
        category: "zorg",
        categoryName: "Zorg, Welzijn & Wonen",
        icon: "🏢",
        desc: "De grootste sociale woningcorporatie voor huurwoningen in Hoorn en omstreken.",
        tags: ["intermaris", "huurwoning", "sociale huur", "woningbouw", "reparatie"]
    },
    {
        id: "woonmatch-wf",
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
        id: "stichting-talent",
        title: "Stichting Talent (Basisonderwijs)",
        url: "https://www.talenthoorn.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🏫",
        desc: "Koepelorganisatie voor alle openbare basisscholen in Hoorn, Zwaag en Blokker.",
        tags: ["basisschool", "talent", "openbaar onderwijs", "kinderen", "groep 1-8"]
    },
    {
        id: "stichting-allure",
        title: "Stichting Allure (Basisonderwijs)",
        url: "https://www.stichtingallure.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🏫",
        desc: "Koepelorganisatie voor katholiek en interconfessioneel primair onderwijs in West-Friesland.",
        tags: ["allure", "basisschool", "katholiek onderwijs", "scholen"]
    },
    {
        id: "kinderkoepel",
        title: "Stichting Kinderkoepel",
        url: "https://www.kinderkoepel.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "👶",
        desc: "Kinderdagverblijven, peuterspeelzalen en buitenschoolse opvang (BSO) in Hoorn.",
        tags: ["kinderopvang", "kinderkoepel", "peuterspeelzaal", "bso", "baby"]
    },
    {
        id: "berend-botje",
        title: "Berend Botje Hoorn",
        url: "https://www.berendbotje.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🧸",
        desc: "Professionele kinderopvang, peutergroepen en gastouderopvang in Hoorn.",
        tags: ["berend botje", "kinderopvang", "gastouder", "peuters", "bso"]
    },
    {
        id: "copernicus-sg",
        title: "Copernicus SG (Atlas College)",
        url: "https://www.copernicushoorn.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🎓",
        desc: "Scholengemeenschap voor mavo, havo en vwo (met o.a. sport- en kunstklassen).",
        tags: ["copernicus", "middelbare school", "mavo", "havo", "vwo", "atlas college"]
    },
    {
        id: "tabor-college",
        title: "Tabor College (Werenfridus, d'Ampte, Oscar Romero)",
        url: "https://www.tabor.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🎓",
        desc: "Drie scholengemeenschappen in Hoorn van praktijkonderwijs en vmbo tot tweetalig vwo/gymnasium.",
        tags: ["tabor", "werenfridus", "dampte", "oscar romero", "middelbare school"]
    },
    {
        id: "sg-newton",
        title: "SG Newton (Atlas College)",
        url: "https://www.sgnewton.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🔧",
        desc: "Praktijkgericht en modern vmbo- en mavo-onderwijs in Hoorn.",
        tags: ["newton", "vmbo", "mavo", "techniek", "middelbare school"]
    },
    {
        id: "vonk-hoorn",
        title: "Vonk Hoorn",
        url: "https://www.vonknh.nl/",
        category: "onderwijs",
        categoryName: "Onderwijs & Scholen",
        icon: "🌱",
        desc: "Praktijkgericht vmbo en mbo in o.a. groen, techniek, voeding, zorg en dierverzorging.",
        tags: ["vonk", "clusius", "vmbo", "mbo", "groen", "dieren", "techniek"]
    },
    {
        id: "talland-college",
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
        id: "ns-reisplanner",
        title: "NS Reisplanner (Station Hoorn & Kersenboogerd)",
        url: "https://www.ns.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚆",
        desc: "Actuele vertrektijden, spoorwijzigingen en reisplanner voor treinverkeer van en naar Hoorn.",
        tags: ["ns", "trein", "station", "station kersenboogerd", "reisplanner", "intercity"]
    },
    {
        id: "meerplus-bussen",
        title: "MeerPlus / EBS Bussen West-Friesland",
        url: "https://www.meerplus.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚌",
        desc: "Lijnennet en dienstregeling van stads- en streekbussen in Hoorn en omliggende dorpen.",
        tags: ["bus", "meerplus", "ebs", "bushalte", "dienstregeling", "stadsbus"]
    },
    {
        id: "regiotaxi-wf",
        title: "Regiotaxi West-Friesland",
        url: "https://www.regiotaxiwestfriesland.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚕",
        desc: "Deeltaxivervoer van deur tot deur voor Wmo-geïndiceerden en senioren in West-Friesland.",
        tags: ["regiotaxi", "taxi", "wmo", "senioren", "deeltaxi"]
    },
    {
        id: "greenwheels-hoorn",
        title: "Greenwheels Deelauto's Hoorn",
        url: "https://www.greenwheels.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚗",
        desc: "Deelauto's huren per uur bij o.a. Station Hoorn en locaties in de binnenstad.",
        tags: ["greenwheels", "deelauto", "huren", "station", "autodelen"]
    },
    {
        id: "parkeren-hoorn",
        title: "Parkeren in Hoorn",
        url: "https://www.hoorn.nl/parkeren",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🅿️",
        desc: "Parkeertarieven, vergunningen, zones en garages ('t Jeudje, Het Park, Noorderveemarkt).",
        tags: ["parkeren", "parkeergarage", "jeudje", "het park", "tarieven", "vergunning"]
    },
    {
        id: "werk-aan-de-weg",
        title: "Werk aan de weg (Hoorn.nl)",
        url: "https://www.hoorn.nl/werk-aan-de-weg",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🚧",
        desc: "Actuele wegafsluitingen, asfalteringsprojecten en verkeersomleidingen in Hoorn.",
        tags: ["werkzaamheden", "afsluiting", "omleiding", "asfalt", "weg"]
    },
    {
        id: "nh-bereikbaar",
        title: "NH Bereikbaar",
        url: "https://www.nhbereikbaar.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "🛣️",
        desc: "Werkzaamheden aan provinciale wegen en grote verkeersaders in West-Friesland.",
        tags: ["nh bereikbaar", "provinciale weg", "a7", "verkeer", "omleiding"]
    },
    {
        id: "havens-hoorn",
        title: "Havens & Ligplaatsen (Gemeente Hoorn)",
        url: "https://www.hoorn.nl/",
        category: "vervoer",
        categoryName: "Vervoer & Parkeren",
        icon: "⛵",
        desc: "Havenfaciliteiten Binnenhaven, Buitenhaven, Grashaven en contact Havenmeester (06 54 20 28 28).",
        tags: ["havenmeester", "havens", "ligplaats", "binnenhaven", "grashaven", "marifoon"]
    },
    {
        id: "watertaxi-hoorn",
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
        id: "honden-hoorn",
        title: "Honden & Uitrenvelden (Gemeente Hoorn)",
        url: "https://www.hoorn.nl/",
        category: "parken",
        categoryName: "Parken & Natuur",
        icon: "🐕",
        desc: "Informatie over hondenbelasting, losloopzones, uitrenvelden en regels in Hoorn.",
        tags: ["hond", "losloopgebied", "uitlaten", "hondenstrand", "dieren"]
    },
    {
        id: "wandelnetwerk-nh",
        title: "Wandelnetwerk Noord-Holland (West-Friesland)",
        url: "https://www.wandelnetwerknoordholland.nl/",
        category: "parken",
        categoryName: "Parken & Natuur",
        icon: "🥾",
        desc: "Mooie gemarkeerde wandelroutes langs de historische havens en over de Westfriese Omringdijk.",
        tags: ["wandelen", "routes", "omringdijk", "wandelnetwerk", "natuur"]
    },
    {
        id: "speeltuin-speelhoorn",
        title: "Stadsspeeltuin De Speelhoorn",
        url: "https://netwerkhoorn.nl/",
        category: "parken",
        categoryName: "Parken & Natuur",
        icon: "🛝",
        desc: "Groot omheind buitenspeelpark op De Blauwe Berg met speeltoestellen, zandbakken en waterpret (Stichting Netwerk).",
        tags: ["speeltuin", "speelhoorn", "kinderen", "spelen", "blauwe berg", "netwerk"]
    },

    // 13. MARKTEN, WINKELS & BEDRIJVIGHEID
    {
        id: "weekmarkten-hoorn",
        title: "Weekmarkten Hoorn",
        url: "https://www.hoorn.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🧀",
        desc: "Zaterdagmarkt Binnenstad (09-17u), Dinsdagmarkt Kersenboogerd (08:30-16u) en Woensdagmarkt Risdam (08:30-16u).",
        tags: ["markt", "weekmarkt", "zaterdagmarkt", "boodschappen", "kaas", "vis"]
    },
    {
        id: "rataplan-hoorn",
        title: "RataPlan Kringloopwinkel (Zwaag/Hoorn)",
        url: "https://rataplan.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "♻️",
        desc: "Grote kringloopwinkel aan De Marowijne / Oude Veiling voor meubels, kleding, boeken en elektronica.",
        tags: ["kringloop", "rataplan", "noppes", "tweedehands", "vintage", "meubels"]
    },
    {
        id: "repair-cafe-hoorn",
        title: "Repair Café Hoorn",
        url: "https://www.netwerkhoorn.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🔧",
        desc: "Gratis hulp van handige vrijwilligers bij het repareren van apparaten, kleding en speelgoed.",
        tags: ["repair cafe", "repareren", "duurzaam", "gratis", "netwerk"]
    },
    {
        id: "ondernemen-hoorn",
        title: "Ondernemen in Hoorn (Gemeente)",
        url: "https://www.hoorn.nl/ondernemen",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "💼",
        desc: "Informatie en contactpunt voor ondernemers, vestigingseisen, bedrijventerreinen en netwerken.",
        tags: ["ondernemers", "ofh", "hoc", "bedrijven", "bedrijventerrein", "economie"]
    },
    {
        id: "winkelen-horeca",
        title: "Winkelen & Horeca in Hoorn (inHoorn)",
        url: "https://www.inhoorn.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🛍️",
        desc: "Winkels, boetiekjes, speciaalzaken, terrassen en horecagelegenheden in de historische binnenstad.",
        tags: ["osh", "binnenstad", "winkeliers", "horeca", "winkelen", "inhoorn"]
    },
    {
        id: "pact-westfriesland",
        title: "Pact van Westfriesland",
        url: "https://www.westfriesland.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🌐",
        desc: "Regionale samenwerking tussen de 7 West-Friese gemeenten, onderwijs en ondernemers.",
        tags: ["pact", "westfriesland", "economie", "regio", "samenwerking"]
    },
    {
        id: "hotel-oostereiland",
        title: "Hotel Oostereiland",
        url: "https://www.hoteloostereiland.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🏨",
        desc: "Overnachten in de historische monumentale voormalige gevangenis op het Oostereiland.",
        tags: ["hotel", "oostereiland", "overnachten", "slapen", "toerisme"]
    },
    {
        id: "hotel-van-der-valk",
        title: "Van der Valk Hotel Hoorn",
        url: "https://www.hotelhoorn.com/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🏨",
        desc: "Groot 4-sterren hotel aan de A7 met zwembad, wellness, bioscoop en restaurants.",
        tags: ["van der valk", "hotel", "restaurant", "a7", "overnachten"]
    },
    {
        id: "hvc-afvalkalender",
        title: "HVC Groep (Afvalkalender Hoorn)",
        url: "https://www.hvcgroep.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🗑️",
        desc: "Ophaaldagen voor restafval, GFT, plastic/papier, afvalpas en grofvuilafspraken in Hoorn.",
        tags: ["afval", "hvc", "afvalkalender", "grofvuil", "kliko", "container", "vuilnis"]
    },
    {
        id: "dierenbescherming-hoorn",
        title: "Dierenbescherming (Regio Hoorn)",
        url: "https://www.dierenbescherming.nl/",
        category: "winkels",
        categoryName: "Markten & Winkels",
        icon: "🐶",
        desc: "Dierenwelzijn, opvang, herplaatsing en advies over huisdieren en dierenopvang in Hoorn.",
        tags: ["dierenasiel", "asiel", "hond", "kat", "adopteren", "dierenbescherming"]
    }
];

const CATEGORIES = [
    { id: "all", name: "Alles", match: null },
    { id: "favorites", name: "Favorieten", match: null },
    { id: "gemeente", name: "Gemeente", match: ["gemeente", "bouw", "subsidie"] },
    { id: "spoed", name: "Spoed", match: ["spoed"] },
    { id: "sport", name: "Sport", match: ["sport"] },
    { id: "cultuur", name: "Cultuur", match: ["cultuur", "parken"] },
    { id: "praktisch", name: "Praktisch", match: ["zorg", "onderwijs", "vervoer", "energie", "winkels", "nieuws"] }
];

const FAVORITES_KEY = "voorhoorn_favorite_links";

function getFavorites() {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (_) {
        return [];
    }
}

function saveFavorites(favs) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    } catch (_) {}
}

function toggleFavorite(id) {
    let favs = getFavorites();
    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
    } else {
        favs.push(id);
    }
    saveFavorites(favs);
    return favs;
}

function categoryMatches(cat, link) {
    if (!cat || cat.id === "all") return true;
    if (cat.id === "favorites") return false;
    if (!cat.match) return link.category === cat.id;
    return cat.match.includes(link.category);
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

const PROMO_SLIDES = [
    {
        id: "lappendag",
        title: "Lappendag DJ",
        subtitle: "Interactieve music player voor de Lappendag",
        cta: "Start DJ",
        icon: "🏮",
        theme: "lappendag",
        action: "lappendag",
    },
    {
        id: "voor-een-mooie-stad",
        title: "Voor Een Mooie Stad",
        subtitle: "Wijkprojecten, geveltuinen en crowdfunding in Hoorn",
        cta: "Naar site",
        icon: "💡",
        theme: "mooiestad",
        url: "https://vooreenmooiestad.nl/",
    },
    {
        id: "buurtbudget-feest",
        title: "Buurtbudget €300",
        subtitle: "Vergoeding voor materialen bij een buurtfeest",
        cta: "Aanvragen",
        icon: "🎉",
        theme: "buurtbudget",
        url: "https://www.hoorn.nl/buurtbudget",
    },
    {
        id: "cultuurfonds-nh",
        title: "Cultuurfonds",
        subtitle: "Bijdrage voor kunst-, muziek- en cultuurprojecten",
        cta: "Bekijken",
        icon: "🎨",
        theme: "cultuurfonds",
        url: "https://www.cultuurfonds.nl/",
    },
    {
        id: "parkeerbon-bezwaar",
        title: "Parkeerbon bezwaar",
        subtitle: "Parkeerbon betalen of bezwaar maken in Hoorn",
        cta: "Naar pagina",
        icon: "🅿️",
        theme: "parkeren",
        url: "https://www.hoorn.nl/parkeerboete",
    },
    {
        id: "d-game",
        title: "D-Game",
        subtitle: "Speel gratis spelletjes op d-game.nl",
        cta: "Speel nu",
        icon: "🎮",
        theme: "dgame",
        url: "https://www.d-game.nl/",
    },
];

document.addEventListener('DOMContentLoaded', () => {
    let activeCategory = "all";
    let searchQuery = "";
    let activeView = "nieuws";

    const categoryButtonsContainer = document.getElementById("categoryButtonsContainer");
    const linksList = document.getElementById("linksList");
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const activeCategoryTitle = document.getElementById("activeCategoryTitle");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    const newsDigest = document.getElementById("newsDigest");
    const linksPanel = document.getElementById("linksPanel");
    const viewTabs = [...document.querySelectorAll(".view-tab")];

    const promoTrack = document.getElementById("promoTrack");
    const promoDots = document.getElementById("promoDots");
    const promoSlideshow = document.getElementById("promoSlideshow");
    const appContainer = document.getElementById("appContainer");
    const backBtn = document.getElementById("backBtn");
    const frame = document.getElementById("site-frame");
    const loading = document.getElementById("site-loading");
    const errorContainer = document.getElementById("site-error");

    let isLappendagLoaded = false;
    let promoIndex = 0;
    let promoTimer = null;

    function setView(view) {
        activeView = view;
        const showNews = view === "nieuws";
        if (newsDigest) newsDigest.hidden = !showNews;
        if (linksPanel) linksPanel.hidden = showNews;

        viewTabs.forEach((btn) => {
            const on = btn.dataset.view === view;
            btn.classList.toggle("is-active", on);
            btn.setAttribute("aria-selected", on ? "true" : "false");
        });

        if (!showNews) renderCards();
    }

    function countForCategory(cat, favs) {
        if (cat.id === "all") return HOORN_LINKS.length;
        if (cat.id === "favorites") return favs.length;
        return HOORN_LINKS.filter((l) => categoryMatches(cat, l)).length;
    }

    function renderCategoryButtons() {
        if (!categoryButtonsContainer) return;
        categoryButtonsContainer.innerHTML = "";
        const favs = getFavorites();

        CATEGORIES.forEach((cat) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `news-tab ${cat.id === activeCategory ? "is-active" : ""} ${cat.id === "favorites" ? "news-tab-fav" : ""}`;
            btn.setAttribute("role", "tab");
            btn.dataset.category = cat.id;
            btn.setAttribute("aria-selected", cat.id === activeCategory ? "true" : "false");

            const count = countForCategory(cat, favs);
            btn.innerHTML = `${escapeHtml(cat.name)} <span class="cat-count" id="count-${cat.id}">${count}</span>`;

            btn.addEventListener("click", () => {
                activeCategory = cat.id;
                categoryButtonsContainer.querySelectorAll(".news-tab").forEach((b) => {
                    const on = b.dataset.category === cat.id;
                    b.classList.toggle("is-active", on);
                    b.setAttribute("aria-selected", on ? "true" : "false");
                });
                renderCards();
            });

            categoryButtonsContainer.appendChild(btn);
        });
    }

    function bindLinkToggles() {
        if (!linksList) return;
        linksList.querySelectorAll(".news-toggle").forEach((btn) => {
            btn.addEventListener("click", () => {
                const row = btn.closest(".news-row");
                const panel = row?.querySelector(".news-panel");
                if (!panel) return;

                const willOpen = panel.hidden;
                linksList.querySelectorAll(".news-row.is-open").forEach((openRow) => {
                    if (openRow === row) return;
                    openRow.classList.remove("is-open");
                    const openBtn = openRow.querySelector(".news-toggle");
                    const openPanel = openRow.querySelector(".news-panel");
                    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
                    if (openPanel) openPanel.hidden = true;
                });

                row.classList.toggle("is-open", willOpen);
                btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
                panel.hidden = !willOpen;
            });
        });
    }

    function renderCards() {
        if (!linksList) return;

        const query = searchQuery.toLowerCase().trim();
        const favs = getFavorites();
        const currentCat = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

        const favCountBadge = document.getElementById("count-favorites");
        if (favCountBadge) favCountBadge.textContent = favs.length;

        const filtered = HOORN_LINKS.filter((link) => {
            let matchesCategory = false;
            if (activeCategory === "all") {
                matchesCategory = true;
            } else if (activeCategory === "favorites") {
                matchesCategory = favs.includes(link.id);
            } else {
                matchesCategory = categoryMatches(currentCat, link);
            }

            if (!matchesCategory) return false;
            if (!query) return true;

            const inTitle = link.title.toLowerCase().includes(query);
            const inDesc = link.desc.toLowerCase().includes(query);
            const inTags = link.tags.some((tag) => tag.toLowerCase().includes(query));
            const inCat = link.categoryName.toLowerCase().includes(query);
            return inTitle || inDesc || inTags || inCat;
        });

        if (activeCategoryTitle) {
            activeCategoryTitle.textContent = query
                ? `Zoekresultaten voor "${query}"`
                : currentCat.name;
        }
        if (resultsCount) {
            resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "link" : "links"}`;
        }

        if (filtered.length === 0) {
            linksList.hidden = true;
            noResults.hidden = false;
            const noResultsHeading = noResults.querySelector("h3");
            const noResultsText = noResults.querySelector("p");
            if (activeCategory === "favorites" && favs.length === 0 && !query) {
                noResultsHeading.textContent = "Nog geen favorieten";
                noResultsText.textContent = "Open een link en tik op het sterretje om favorieten op dit apparaat te bewaren.";
            } else {
                noResultsHeading.textContent = "Geen links gevonden";
                noResultsText.textContent = "Geen resultaten voor je zoekopdracht. Probeer een ander zoekwoord of kies een categorie.";
            }
            return;
        }

        noResults.hidden = true;
        linksList.hidden = false;

        const rows = filtered.map((link, index) => {
            const isFav = favs.includes(link.id);
            let domain = "";
            try {
                domain = new URL(link.url).hostname.replace(/^www\./, "");
            } catch (_) {
                domain = link.url;
            }
            const panelId = `link-panel-${index}`;

            return `
                <article class="news-row link-row">
                    <button
                        type="button"
                        class="news-toggle"
                        aria-expanded="false"
                        aria-controls="${panelId}"
                    >
                        <span class="news-item-title">
                            <span class="link-row-icon" aria-hidden="true">${link.icon}</span>
                            ${escapeHtml(link.title)}
                        </span>
                        <span class="news-chevron" aria-hidden="true"></span>
                    </button>
                    <div class="news-panel" id="${panelId}" hidden>
                        <div class="news-meta">
                            <span class="news-source">${escapeHtml(link.categoryName)}</span>
                            ${escapeHtml(domain)}
                        </div>
                        <p class="news-blurb">${escapeHtml(link.desc)}</p>
                        <div class="link-panel-actions">
                            <button type="button" class="link-fav-btn ${isFav ? "is-favorite" : ""}" data-link-id="${escapeHtml(link.id)}" title="${isFav ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}">
                                ${isFav ? "★ Favoriet" : "☆ Favoriet"}
                            </button>
                            <a class="news-open" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">Open site →</a>
                        </div>
                    </div>
                </article>
            `;
        }).join("");

        linksList.innerHTML = `<div class="news-rows">${rows}</div>`;
        bindLinkToggles();

        linksList.querySelectorAll(".link-fav-btn").forEach((favBtn) => {
            favBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = favBtn.dataset.linkId;
                const newFavs = toggleFavorite(id);
                const nowFav = newFavs.includes(id);
                favBtn.classList.toggle("is-favorite", nowFav);
                favBtn.innerHTML = nowFav ? "★ Favoriet" : "☆ Favoriet";
                favBtn.title = nowFav ? "Verwijder uit favorieten" : "Voeg toe aan favorieten";

                const favBadge = document.getElementById("count-favorites");
                if (favBadge) favBadge.textContent = newFavs.length;

                if (activeCategory === "favorites") {
                    renderCards();
                }
            });
        });
    }

    async function openLappendag() {
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
    }

    function setPromoIndex(index, { restart = true } = {}) {
        if (!promoTrack || !PROMO_SLIDES.length) return;
        promoIndex = ((index % PROMO_SLIDES.length) + PROMO_SLIDES.length) % PROMO_SLIDES.length;
        promoTrack.style.transform = `translateX(-${promoIndex * 100}%)`;

        if (promoDots) {
            promoDots.querySelectorAll(".promo-dot").forEach((dot, i) => {
                const on = i === promoIndex;
                dot.classList.toggle("is-active", on);
                dot.setAttribute("aria-selected", on ? "true" : "false");
            });
        }

        if (restart) restartPromoTimer();
    }

    function restartPromoTimer() {
        if (promoTimer) clearInterval(promoTimer);
        promoTimer = setInterval(() => {
            setPromoIndex(promoIndex + 1, { restart: false });
        }, 5000);
    }

    function initPromoSlideshow() {
        if (!promoTrack || !promoDots) return;

        promoTrack.innerHTML = PROMO_SLIDES.map((slide, index) => {
            const theme = escapeHtml(slide.theme || "default");
            const cta = escapeHtml(slide.cta || "Open");

            return `
                <div class="promo-slide" data-slide-index="${index}">
                    <button
                        type="button"
                        class="promo-card promo-theme-${theme}"
                        data-slide-id="${escapeHtml(slide.id)}"
                        aria-label="${escapeHtml(slide.title)} — ${cta}"
                    >
                        <span class="promo-card-icon" aria-hidden="true">${slide.icon}</span>
                        <span class="promo-card-text">
                            <span class="promo-card-title">${escapeHtml(slide.title)}</span>
                            <span class="promo-card-sub">${escapeHtml(slide.subtitle)}</span>
                        </span>
                        <span class="promo-card-cta">
                            <span>${cta}</span>
                            <span class="promo-card-arrow" aria-hidden="true">→</span>
                        </span>
                    </button>
                </div>
            `;
        }).join("");

        promoDots.innerHTML = PROMO_SLIDES.map((slide, i) => `
            <button
                type="button"
                class="promo-dot ${i === 0 ? "is-active" : ""}"
                role="tab"
                aria-label="Slide ${i + 1}: ${escapeHtml(slide.title)}"
                aria-selected="${i === 0 ? "true" : "false"}"
                data-index="${i}"
            ></button>
        `).join("");

        promoTrack.querySelectorAll(".promo-card").forEach((card) => {
            card.addEventListener("click", () => {
                const slide = PROMO_SLIDES.find((s) => s.id === card.dataset.slideId);
                if (!slide) return;
                if (slide.action === "lappendag") {
                    openLappendag();
                    return;
                }
                if (slide.url) {
                    window.open(slide.url, "_blank", "noopener,noreferrer");
                }
            });
        });

        promoDots.querySelectorAll(".promo-dot").forEach((dot) => {
            dot.addEventListener("click", () => {
                setPromoIndex(Number(dot.dataset.index));
            });
        });

        if (promoSlideshow) {
            promoSlideshow.addEventListener("mouseenter", () => {
                if (promoTimer) clearInterval(promoTimer);
                promoTimer = null;
            });
            promoSlideshow.addEventListener("mouseleave", () => restartPromoTimer());
            promoSlideshow.addEventListener("focusin", () => {
                if (promoTimer) clearInterval(promoTimer);
                promoTimer = null;
            });
            promoSlideshow.addEventListener("focusout", (e) => {
                if (!promoSlideshow.contains(e.relatedTarget)) restartPromoTimer();
            });
        }

        setPromoIndex(0);
    }

    viewTabs.forEach((btn) => {
        btn.addEventListener("click", () => setView(btn.dataset.view));
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            clearSearchBtn.hidden = searchQuery.length === 0;
            renderCards();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            searchInput.value = "";
            searchQuery = "";
            clearSearchBtn.hidden = true;
            searchInput.focus();
            renderCards();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", () => {
            activeCategory = "all";
            searchQuery = "";
            if (searchInput) searchInput.value = "";
            if (clearSearchBtn) clearSearchBtn.hidden = true;
            renderCategoryButtons();
            renderCards();
        });
    }

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            appContainer.hidden = true;
            document.title = "Voorhoorn - Startportaal Hoorn";
        });
    }

    initPromoSlideshow();
    renderCategoryButtons();
    setView("nieuws");
});
