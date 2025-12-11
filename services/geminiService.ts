import { HealthMetric } from "../types";

/*
  -------------------------------------------------------------------------
  TODO: INTEGRACIÓ FUTURA AMB IA REIAL (Google Gemini API)
  -------------------------------------------------------------------------
  
  Actualment aquest servei utilitza lògica local per simular respostes.
  Per connectar-ho amb l'API real de Google Gemini, segueix aquests passos:

  1. Assegura't de tenir el paquet instal·lat: npm install @google/genai
  2. Configura la teva API KEY a les variables d'entorn o al build (process.env.API_KEY).
  3. Descomenta i adapta el codi dins de les funcions següents.

  Importació necessària:
  import { GoogleGenAI } from "@google/genai";
*/

// Simulated AI service (Local Logic Engine)
// Generates responses based on data values since API tokens are exhausted.

export const generateHealthSummary = async (metrics: HealthMetric[], age: number): Promise<string> => {
  
  /* 
    --- CODI PER A LA INTEGRACIÓ REAL ---

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construïm un prompt amb totes les dades
      const prompt = `
        Ets un expert metge i nutricionista especialitzat en metabolisme.
        Analitza el següent perfil de salut d'un pacient de ${age} anys:
        ${JSON.stringify(metrics, null, 2)}
        
        Dona'm un resum global de salut de 3 frases. Sigui empàtic però rigorós.
        Si hi ha alertes, prioritza-les. Parla directament al pacient ("tens", "has de").
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "No s'ha pogut generar el resum.";
    } catch (error) {
      console.error("Error cridant a Gemini:", error);
      // Fallback a la lògica local en cas d'error
    }
  */

  // Simulate "thinking" delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));

  const alerts = metrics.filter(m => m.status === 'alert');
  const goods = metrics.filter(m => m.status === 'good');
  const totalMetrics = metrics.length;

  // Scenario 1: Perfect Health
  if (alerts.length === 0) {
    return `Als ${age} anys, estàs en un estat de forma fantàstic! Tots els biomarcadors analitzats (${totalMetrics} àrees) mostren valors òptims. El teu metabolisme i sistema cardiovascular responen perfectament. Continua amb el teu estil de vida actual!`;
  }

  // Scenario 2: One specific issue
  if (alerts.length === 1) {
    const issueMetric = alerts[0];
    const issueName = issueMetric.title.toLowerCase();
    return `En general tens una salut molt sòlida per als ${age} anys, amb la majoria d'àrees en verd. No obstant això, hem de vigilar ${issueName}. Amb petits ajustos en la dieta o l'exercici podries revertir aquesta alerta ràpidament.`;
  }

  // Scenario 3: Multiple issues
  const issueNames = alerts.map(a => a.title).join(', ').replace(/, ([^,]*)$/, ' i $1');
  return `Als ${age} anys és crucial cuidar-se. Hem detectat desequilibris en: ${issueNames}. No t'alarmis, però el teu cos et demana atenció. Seria recomanable prioritzar el descans, revisar la dieta i reduir l'estrès per millorar aquests marcadors.`;
};

export const generateCategorySummary = async (metric: HealthMetric, age: number): Promise<string> => {
  
  /* 
    --- CODI PER A LA INTEGRACIÓ REAL ---

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Analitza específicament la mètrica "${metric.title}" per a un home de ${age} anys.
        Dades detallades: ${JSON.stringify(metric.details)}
        Estat general: ${metric.status}
        
        Explica què signifiquen aquests valors específics i dona una recomanació accionable molt breu (màxim 2 frases).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "Sense informació disponible.";
    } catch (error) {
      console.error("Error cridant a Gemini:", error);
    }
  */

  // Simulate "thinking" delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const { id, status, details } = metric;

  // LOGIC ENGINE: Invent answers based on real data values

  if (id === 'cardio') {
    if (status === 'alert') {
        const highLdl = (details?.ldlCholesterol || 0) > 116;
        const highParts = (details?.ldlParticles || 0) > 1150;
        const smallSize = (details?.ldlSize || 99) < 20.91;
        
        if (highLdl && highParts) return "Tens el colesterol i les partícules LDL elevades. Això augmenta el risc aterogènic. Et recomano reduir dràsticament els greixos saturats i augmentar la ingesta de fibra i omega-3.";
        if (smallSize) return "La mida de les teves partícules LDL és massa petita, la qual cosa és un factor de risc. L'exercici aeròbic regular t'ajudarà a millorar aquest perfil.";
        return "Hi ha cert risc cardiovascular. Vigila la ingesta de sal i greixos. És un bon moment per començar a caminar 30 minuts al dia.";
    }
    return "El teu perfil lipídic és excel·lent. El cor funciona sense sobrecàrregues i les artèries es mantenen netes de colesterol nociu.";
  }

  if (id === 'inflammation') {
    if (status === 'alert') {
        const highGlycA = (details?.glycA || 0) > 650;
        if (highGlycA) return "El marcador Glyc-A està alt, indicant inflamació sistèmica crònica. Pot ser degut a l'estrès o una infecció recent. Prioritza dormir 8 hores i menjar aliments antioxidants.";
        return "Detectem signes d'inflamació. El teu cos està lluitant contra algun estrès. Intenta reduir els processats i el sucre de la teva dieta.";
    }
    return "Tens nivells d'inflamació molt baixos (Glyc-A i Glyc-B correctes). Això és clau per a la longevitat i per prevenir malalties cròniques.";
  }

  if (id === 'energy') {
    if (status === 'alert') {
        const highLactate = (details?.lactate || 0) > 550;
        const glucoseIssue = (details?.glucose || 0) > 100 || (details?.glucose || 0) < 67;

        if (glucoseIssue) return "La teva glucosa no és estable. Evita els pics de sucre i intenta menjar hidrats de carboni complexos per mantenir l'energia constant.";
        if (highLactate) return "El lactat està elevat, indicant possible fatiga metabòlica o falta d'oxigenació cel·lular. Assegura't de recuperar bé entre esforços.";
        return "El teu metabolisme energètic mostra inestabilitat. Revisa els teus horaris d'àpats.";
    }
    return "Tens una flexibilitat metabòlica molt bona. El teu cos gestiona eficientment la glucosa i les cetones per tenir energia durant tot el dia.";
  }

  if (id === 'muscle') {
    if (status === 'alert') {
        const lowBcaa = (details?.leucine || 0) < 72;
        if (lowBcaa) return "Tens nivells baixos de Leucina, clau per al múscul. Necessites augmentar la ingesta de proteïna de qualitat (ous, peix, llegums) per evitar la pèrdua muscular.";
        return "Els marcadors musculars indiquen cert desgast o falta de recuperació. Descansa més i assegura't de nodrir el múscul després de l'exercici.";
    }
    return "La teva massa muscular està ben nodrida i forta. Els nivells d'aminoàcids (BCAAs) i creatina indiquen una bona estructura i potència funcional.";
  }

  if (id === 'renal') {
    if (status === 'alert') return "La creatinina està fora dels rangs òptims. És fonamental que beguis molta més aigua i evitis l'excés de sal o suplements proteics innecessaris.";
    return "Funció renal impecable. Els teus ronyons filtren i depuren la sang a la perfecció. Mantén aquesta bona hidratació!";
  }

  return "Dades analitzades. Mantén els bons hàbits i consulta amb un especialista si tens dubtes.";
};