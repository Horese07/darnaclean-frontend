import { useState, useCallback } from 'react';
import { ChatMessage, Product, KnowledgeBase } from '@/types';
import { useProducts, useKnowledgeBase } from './useData';

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Bonjour ! Je suis votre assistant beauté IA. Comment puis-je vous aider aujourd\'hui ? Je peux vous conseiller sur les produits, vérifier les compatibilités avec vos allergies, ou vous recommander une routine adaptée à votre type de peau.',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const { products } = useProducts();
  const { knowledgeBase } = useKnowledgeBase();

  const analyzeMessage = useCallback((message: string): {
    intent: string;
    entities: Record<string, string>;
    confidence: number;
  } => {
    const lowerMessage = message.toLowerCase();
    
    // Intent detection
    let intent = 'general';
    let confidence = 0.5;
    const entities: Record<string, string> = {};

    // Product search intent
    if (lowerMessage.includes('cherche') || lowerMessage.includes('trouve') || lowerMessage.includes('recommande')) {
      intent = 'product_search';
      confidence = 0.8;
    }

    // Allergy/compatibility intent
    if (lowerMessage.includes('allergie') || lowerMessage.includes('sensible') || lowerMessage.includes('compatible')) {
      intent = 'compatibility_check';
      confidence = 0.9;
    }

    // Routine intent
    if (lowerMessage.includes('routine') || lowerMessage.includes('étapes') || lowerMessage.includes('utilise')) {
      intent = 'routine_advice';
      confidence = 0.8;
    }

    // Price/budget intent
    if (lowerMessage.includes('prix') || lowerMessage.includes('budget') || lowerMessage.includes('économique')) {
      intent = 'price_inquiry';
      confidence = 0.8;
    }

    // Extract entities
    const skinTypes = ['grasse', 'sèche', 'mixte', 'sensible'];
    const foundSkinType = skinTypes.find(type => lowerMessage.includes(type));
    if (foundSkinType) entities.skinType = foundSkinType;

    const categories = ['visage', 'corps', 'cheveux', 'maquillage', 'parfum'];
    const foundCategory = categories.find(cat => lowerMessage.includes(cat));
    if (foundCategory) entities.category = foundCategory;

    return { intent, entities, confidence };
  }, []);

  const generateResponse = useCallback((userMessage: string): {
    response: string;
    recommendations?: Product[];
  } => {
    const analysis = analyzeMessage(userMessage);
    let response = '';
    let recommendations: Product[] = [];

    switch (analysis.intent) {
      case 'product_search':
        if (analysis.entities.category) {
          const categoryMap: Record<string, string> = {
            'visage': 'face-care',
            'corps': 'body-care', 
            'cheveux': 'hair-care',
            'maquillage': 'makeup',
            'parfum': 'fragrances'
          };
          
          const categoryId = categoryMap[analysis.entities.category];
          recommendations = products.filter(p => p.categoryId === categoryId).slice(0, 3);
          
          response = `Voici mes recommandations pour les soins ${analysis.entities.category} :`;
        } else {
          recommendations = products.filter(p => p.isBestSeller).slice(0, 3);
          response = 'Voici nos meilleures ventes que je vous recommande :';
        }
        break;

      case 'compatibility_check':
        response = `Pour vérifier la compatibilité des produits, j'ai besoin de plus d'informations. Avez-vous des allergies spécifiques ? (parfum, parabens, sulfates, etc.) 
        
        En général, pour les peaux sensibles, je recommande des produits hypoallergéniques sans parfum comme nos crèmes à base d'aloe vera et d'acide hyaluronique.`;
        
        recommendations = products.filter(p => 
          p.description.toLowerCase().includes('hypoallergénique') ||
          p.description.toLowerCase().includes('sensible') ||
          p.ingredients.some(ing => ['glycérine', 'aloe vera', 'acide hyaluronique'].includes(ing.toLowerCase()))
        ).slice(0, 2);
        break;

      case 'routine_advice':
        if (analysis.entities.skinType && knowledgeBase) {
          const skinTypeData = knowledgeBase.skin_types[analysis.entities.skinType];
          if (skinTypeData) {
            response = `Pour une peau ${analysis.entities.skinType}, voici mes conseils :
            
            ✅ Recommandé : ${skinTypeData.recommended.join(', ')}
            ❌ À éviter : ${skinTypeData.avoid.join(', ')}
            
            Routine conseillée :
            🌅 Matin : ${knowledgeBase.usage_recommendations.morning_routine.join(' → ')}
            🌙 Soir : ${knowledgeBase.usage_recommendations.evening_routine.join(' → ')}`;
          }
        } else {
          response = `Voici une routine de base que je recommande :
          
          🌅 **Routine Matin** : Nettoyant doux → Sérum vitamine C → Crème hydratante → Protection solaire
          🌙 **Routine Soir** : Démaquillant → Nettoyant → Sérum réparateur → Crème de nuit
          
          Dites-moi votre type de peau pour des conseils plus personnalisés !`;
        }
        break;

      case 'price_inquiry':
        const budgetProducts = products.filter(p => p.price < 15).slice(0, 3);
        recommendations = budgetProducts;
        response = `Voici nos meilleurs produits à prix accessible (moins de 15€) :`;
        break;

      default:
        // Check for common questions
        if (knowledgeBase) {
          const commonQuestion = knowledgeBase.common_questions.find(q => 
            userMessage.toLowerCase().includes(q.question.toLowerCase().split(' ')[0])
          );
          
          if (commonQuestion) {
            response = commonQuestion.answer;
          } else {
            response = `Je suis là pour vous aider avec vos questions sur les produits de beauté et soins ! Je peux vous conseiller sur :
            
            🔍 Recherche de produits par catégorie
            🌿 Vérification de compatibilité et allergies  
            📋 Routines personnalisées selon votre type de peau
            💰 Produits selon votre budget
            ⭐ Recommandations basées sur les avis clients
            
            Que souhaitez-vous savoir ?`;
          }
        }
    }

    return { response, recommendations };
  }, [analyzeMessage, products, knowledgeBase]);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const { response, recommendations } = generateResponse(message);

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      message: response,
      isUser: false,
      timestamp: new Date(),
      recommendations,
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  }, [generateResponse]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        message: 'Bonjour ! Je suis votre assistant beauté IA. Comment puis-je vous aider aujourd\'hui ?',
        isUser: false,
        timestamp: new Date(),
      }
    ]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  };
};
