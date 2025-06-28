interface ChatbotAnalysis {
  intent: string;
  subIntent?: string;
  confidence: number;
}

interface ChatbotResponse {
  response: string;
  intent: string;
  confidence: number;
}

interface ServiceResponses {
  web: string[];
  mobile: string[];
  ecommerce: string[];
  design: string[];
  sistema: string[];
}

interface AllResponses {
  greeting: string[];
  services: ServiceResponses;
  pricing: string[];
  time: string[];
  contact: string[];
  portfolio: string[];
  technology: string[];
  default: string[];
  goodbye: string[];
}

interface ServicePatterns {
  web: RegExp;
  mobile: RegExp;
  ecommerce: RegExp;
  design: RegExp;
  sistema: RegExp;
}

interface AllPatterns {
  greeting: RegExp;
  services: ServicePatterns;
  pricing: RegExp;
  time: RegExp;
  contact: RegExp;
  portfolio: RegExp;
  technology: RegExp;
  goodbye: RegExp;
}

// Chatbot inteligente para Planix
export class PlanixChatbot {
  private responses: AllResponses;
  private patterns: AllPatterns;
  constructor() {
    this.responses = {
      greeting: [
        "¡Hola! 👋 Gracias por contactarte con Planix. ¿En qué puedo ayudarte hoy?",
        "¡Bienvenido/a! 🌟 Soy el asistente virtual de Planix. ¿Cómo puedo asistirte?",
        "¡Hola! Estoy aquí para ayudarte con cualquier consulta sobre nuestros servicios."
      ],
      
      services: {
        web: [
          "¡Excelente! 🚀 Nos especializamos en desarrollo web moderno. Creamos sitios responsive, e-commerce, aplicaciones web y sistemas personalizados. ¿Te interesa algún tipo específico de proyecto web?",
          "Perfecto, el desarrollo web es una de nuestras especialidades. Trabajamos con React, Node.js, y las últimas tecnologías. ¿Qué tipo de sitio web tienes en mente?",
          "¡Genial elección! Desarrollamos desde landing pages hasta plataformas complejas. ¿Podrías contarme más sobre tu proyecto?"
        ],
        
        mobile: [
          "¡Fantástico! 📱 Desarrollamos apps nativas y multiplataforma con Flutter y React Native. ¿Tu app sería para Android, iOS, o ambas plataformas?",
          "Excelente, las apps móviles son el futuro. Creamos aplicaciones intuitivas y potentes. ¿Qué funcionalidades principales necesitarías?",
          "¡Me encanta! El desarrollo móvil es una de nuestras pasiones. ¿Tienes ya una idea clara de la app o necesitas ayuda con el concepto?"
        ],
        
        ecommerce: [
          "¡Perfecto! 🛒 Somos expertos en e-commerce. Creamos tiendas online completas con pagos integrados, gestión de inventario y analytics. ¿Qué tipo de productos venderías?",
          "¡Excelente decisión! El e-commerce es clave hoy en día. Desarrollamos desde tiendas simples hasta marketplaces complejos. ¿Cuántos productos aproximadamente tendrías?",
          "¡Genial! Nuestras tiendas online incluyen todo: pagos con Stripe, panel de administración, SEO optimizado. ¿Ya tienes los productos definidos?"
        ],
        
        design: [
          "¡Increíble! 🎨 Nuestro equipo de diseño crea experiencias visuales impactantes. Trabajamos con Figma y Adobe para branding, UI/UX y diseño web. ¿Qué tipo de diseño necesitas?",
          "¡Excelente! El diseño es fundamental para el éxito. Creamos desde logos hasta interfaces completas. ¿Es para un nuevo proyecto o rediseño?",
          "¡Perfecto! Nos encanta crear diseños que 'wow'. ¿Buscas branding completo, diseño web, o algo específico?"
        ],
        
        sistema: [
          "¡Fantástico! 💼 Desarrollamos sistemas web personalizados para optimizar procesos empresariales. CRM, ERP, gestión de inventarios, y más. ¿Qué procesos necesitas automatizar?",
          "¡Excelente! Los sistemas personalizados pueden transformar tu negocio. ¿Qué tipo de gestión necesitas: clientes, inventario, facturación?",
          "¡Genial elección! Creamos sistemas que se adaptan 100% a tus necesidades. ¿Cuál es el principal problema que quieres resolver?"
        ]
      },
      
      pricing: [
        "💰 Nuestros precios son muy competitivos y se adaptan a cada proyecto. Para darte un presupuesto preciso, me gustaría conocer más detalles. ¿Podrías contarme sobre tu proyecto? Un especialista te contactará con una cotización personalizada.",
        "Los costos varían según la complejidad del proyecto. 📊 Para una cotización exacta, un especialista analizará tus necesidades específicas. ¿Podrías describir brevemente qué tienes en mente?",
        "¡Excelente pregunta! 💡 Trabajamos con presupuestos flexibles adaptados a cada cliente. Para darte números precisos, necesitaríamos entender mejor tu proyecto. ¿Te parece si agendamos una consulta gratuita?"
      ],
      
      time: [
        "⏱️ Los tiempos dependen del alcance del proyecto. Un sitio web simple puede estar listo en 2-3 semanas, mientras que sistemas complejos pueden tomar 2-3 meses. ¿Qué tipo de proyecto tienes en mente?",
        "¡Buena pregunta! 🕐 Trabajamos con cronogramas realistas. Sitios web: 2-4 semanas, Apps móviles: 1-3 meses, Sistemas complejos: 2-4 meses. ¿Tienes algún deadline específico?",
        "Los plazos varían según la complejidad. 📅 Te damos estimaciones realistas desde el inicio. ¿Es urgente tu proyecto o podemos planificarlo bien?"
      ],
      
      contact: [
        "¡Perfecto! 📞 Puedes contactarnos por email a hola@planix.com.ar o seguir chateando aquí. Un especialista revisará tu consulta y te responderá pronto. ¿Prefieres que te llamemos o te escribamos?",
        "¡Excelente! 📧 Estás en el lugar correcto. Puedes escribir aquí tus dudas o enviar un email a hola@planix.com.ar. ¿Qué información específica necesitas?",
        "¡Genial! 🎯 Este chat es directo con nuestro equipo. También puedes escribirnos a hola@planix.com.ar. ¿Cómo prefieres que te contactemos?"
      ],
      
      portfolio: [
        "¡Claro! 🌟 Puedes ver nuestros trabajos en la sección Portfolio de esta misma página. Tenemos proyectos de e-commerce, sistemas web, apps móviles y más. ¿Te interesa algún tipo específico?",
        "¡Por supuesto! 💼 En nuestro portfolio encontrarás casos como Ona Saez (e-commerce), Ferresys (sistema de gestión), y más. ¿Qué tipo de proyecto te gustaría ver?",
        "¡Excelente! 🚀 Scroll hacia arriba para ver nuestros trabajos destacados. Cada proyecto tiene detalles de las tecnologías usadas. ¿Alguno te llamó la atención?"
      ],
      
      technology: [
        "🛠️ Trabajamos con tecnologías de vanguardia: React, Node.js, Flutter, Python, .NET, y más. Elegimos la mejor tech stack para cada proyecto. ¿Tienes alguna preferencia tecnológica?",
        "¡Excelente pregunta! 💻 Usamos React para frontend, Node.js y Python para backend, Flutter para móviles, y bases de datos como PostgreSQL y MongoDB. ¿Hay alguna tecnología específica que te interese?",
        "🚀 Nos mantenemos actualizados con las últimas tecnologías. React, Vue, Angular, Flutter, .NET Core, y más. ¿Tu proyecto tiene algún requerimiento técnico específico?"
      ],
      
      default: [
        "Interesante consulta. 🤔 Un especialista de nuestro equipo revisará tu mensaje y te dará una respuesta detallada pronto. Mientras tanto, ¿hay algo más en lo que pueda ayudarte?",
        "Gracias por tu consulta. 📝 Nuestro equipo técnico te responderá con información específica pronto. ¿Te gustaría conocer más sobre alguno de nuestros servicios mientras tanto?",
        "¡Perfecto! Un experto analizará tu consulta y te contactará pronto con una respuesta personalizada. ¿Hay algo más sobre Planix que te gustaría saber?"
      ],
      
      goodbye: [
        "¡Gracias por contactarnos! 👋 Un especialista revisará tu consulta y te responderá pronto. ¡Que tengas un excelente día!",
        "¡Fue un placer ayudarte! 🌟 Nuestro equipo estará en contacto contigo pronto. ¡Hasta luego!",
        "¡Excelente! 🚀 Un experto de Planix te contactará pronto. ¡Gracias por elegirnos!"
      ]
    };
    
    this.patterns = {
      greeting: /\b(hola|hello|hi|buenos?|buenas|saludos|hey)\b/i,
      
      services: {
        web: /\b(sitio web|página web|website|web|landing|portal|blog)\b/i,
        mobile: /\b(app|aplicación|móvil|mobile|android|ios|celular|smartphone)\b/i,
        ecommerce: /\b(tienda|ecommerce|e-commerce|venta|vender|productos|carrito|pago)\b/i,
        design: /\b(diseño|design|logo|branding|ui|ux|gráfico|visual)\b/i,
        sistema: /\b(sistema|crm|erp|gestión|administración|inventario|facturación)\b/i
      },
      
      pricing: /\b(precio|costo|cuanto|cotización|presupuesto|tarifa|valor|€|\$)\b/i,
      time: /\b(tiempo|cuanto.*tard|plazo|deadline|urgente|rápido|cuando)\b/i,
      contact: /\b(contacto|teléfono|email|llamar|escribir|comunicar)\b/i,
      portfolio: /\b(portfolio|trabajos|proyectos|ejemplos|casos|referencias)\b/i,
      technology: /\b(tecnología|tech|lenguaje|framework|react|node|flutter|python)\b/i,
      goodbye: /\b(gracias|bye|adiós|hasta|chau|nos vemos)\b/i
    };
  }
  
  analyzeMessage(message: string): ChatbotAnalysis {
    const text = message.toLowerCase();
    
    // Análisis de intención principal
    if (this.patterns.greeting.test(text)) {
      return { intent: 'greeting', confidence: 0.9 };
    }
    
    // Servicios específicos
    for (const [service, pattern] of Object.entries(this.patterns.services)) {
      if ((pattern as RegExp).test(text)) {
        return { intent: 'services', subIntent: service, confidence: 0.8 };
      }
    }
    
    // Otras intenciones
    for (const [intent, pattern] of Object.entries(this.patterns)) {
      if (intent !== 'greeting' && intent !== 'services' && (pattern as RegExp).test(text)) {
        return { intent, confidence: 0.7 };
      }
    }
    
    return { intent: 'default', confidence: 0.3 };
  }
  
  generateResponse(analysis: ChatbotAnalysis, userName: string = ''): string {
    const greeting = userName ? `${userName}, ` : '';
    
    if (analysis.intent === 'services' && analysis.subIntent) {
      const responses = this.responses.services[analysis.subIntent as keyof ServiceResponses];
      return greeting + this.getRandomResponse(responses);
    }
    
    // Para otras intenciones que no sean services
    let responses: string[];
    
    switch (analysis.intent) {
      case 'greeting':
        responses = this.responses.greeting;
        break;
      case 'pricing':
        responses = this.responses.pricing;
        break;
      case 'time':
        responses = this.responses.time;
        break;
      case 'contact':
        responses = this.responses.contact;
        break;
      case 'portfolio':
        responses = this.responses.portfolio;
        break;
      case 'technology':
        responses = this.responses.technology;
        break;
      case 'goodbye':
        responses = this.responses.goodbye;
        break;
      default:
        responses = this.responses.default;
        break;
    }
    
    return greeting + this.getRandomResponse(responses);
  }
  
  getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Método principal para obtener respuesta
  getResponse(message: string, userName: string = ''): ChatbotResponse {
    const analysis = this.analyzeMessage(message);
    return {
      response: this.generateResponse(analysis, userName),
      intent: analysis.intent,
      confidence: analysis.confidence
    };
  }
}