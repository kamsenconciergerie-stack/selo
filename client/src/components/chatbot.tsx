import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, MessageCircle, Send, Check, Phone } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
}

interface QuoteData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryCity: string;
  startDate: string;
  endDate: string;
  equipmentCategories: string[];
  specificNeeds: string;
  projectDescription: string;
}

const EQUIPMENT_CATEGORIES = [
  "Camions et Transport",
  "BTP et Construction", 
  "Électricité et Énergie",
  "Pompage et Irrigation",
  "Équipement Agricole",
  "Équipement Spécialisé",
  "Manutention"
];

const SENEGALESE_CITIES = [
  "Dakar", "Thiès", "Kaolack", "Saint-Louis", "Ziguinchor", "Diourbel", 
  "Touba", "Tambacounda", "Mbour", "Rufisque", "Kolda", "Fatick",
  "Louga", "Sédhiou", "Kédougou", "Matam", "Kaffrine"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [quoteData, setQuoteData] = useState<Partial<QuoteData>>({});
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial welcome message
      addBotMessage("Hello ! C'est Awa, ton assistant bot Kamsen 👋\n\nVeux-tu nous en dire plus sur ton besoin ? Je vais t'aider à créer un devis personnalisé pour tes équipements !");
    }
  }, [isOpen]);

  const addBotMessage = (text: string, options?: string[]) => {
    const message: ChatMessage = {
      id: `bot_${Date.now()}`,
      text,
      isBot: true,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: ChatMessage = {
      id: `user_${Date.now()}`,
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const saveChatbotQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/chatbot-quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to save quote');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chatbot-quotes'] });
    },
  });

  const handleStepFlow = (userInput: string) => {
    addUserMessage(userInput);
    
    switch (currentStep) {
      case 'welcome':
        setQuoteData(prev => ({ ...prev, specificNeeds: userInput }));
        addBotMessage("Parfait ! Pour commencer, peux-tu me dire ton nom ?");
        setCurrentStep('name');
        break;
        
      case 'name':
        setQuoteData(prev => ({ ...prev, customerName: userInput }));
        addBotMessage("Enchanté " + userInput + " ! 😊\n\nPeux-tu me donner ton numéro de téléphone ?");
        setCurrentStep('phone');
        break;
        
      case 'phone':
        setQuoteData(prev => ({ ...prev, customerPhone: userInput }));
        addBotMessage("Merci ! Ton email (optionnel) ?");
        setCurrentStep('email');
        break;
        
      case 'email':
        if (userInput.toLowerCase() !== 'passer' && userInput.trim() !== '') {
          setQuoteData(prev => ({ ...prev, customerEmail: userInput }));
        }
        addBotMessage("Dans quelle ville souhaites-tu la livraison ?", SENEGALESE_CITIES);
        setCurrentStep('city');
        break;
        
      case 'city':
        setQuoteData(prev => ({ ...prev, deliveryCity: userInput }));
        addBotMessage("Quand souhaites-tu commencer la location ? (format: jj/mm/aaaa)");
        setCurrentStep('startDate');
        break;
        
      case 'startDate':
        setQuoteData(prev => ({ ...prev, startDate: userInput }));
        addBotMessage("Jusqu'à quand ? (format: jj/mm/aaaa)");
        setCurrentStep('endDate');
        break;
        
      case 'endDate':
        setQuoteData(prev => ({ ...prev, endDate: userInput }));
        addBotMessage("Quels types d'équipements te faut-il ?", EQUIPMENT_CATEGORIES);
        setCurrentStep('categories');
        break;
        
      case 'categories':
        const selectedCategories = userInput.split(',').map(cat => cat.trim());
        setQuoteData(prev => ({ 
          ...prev, 
          equipmentCategories: selectedCategories 
        }));
        addBotMessage("Peux-tu décrire ton projet en quelques mots ?");
        setCurrentStep('project');
        break;
        
      case 'project':
        setQuoteData(prev => ({ ...prev, projectDescription: userInput }));
        generateQuoteSummary();
        setCurrentStep('summary');
        break;
        
      default:
        break;
    }
  };

  const generateQuoteSummary = () => {
    const summary = `
🎯 **Résumé de ton devis**

👤 **Client :** ${quoteData.customerName}
📞 **Téléphone :** ${quoteData.customerPhone}
${quoteData.customerEmail ? `📧 **Email :** ${quoteData.customerEmail}` : ''}
📍 **Livraison :** ${quoteData.deliveryCity}
📅 **Période :** ${quoteData.startDate} → ${quoteData.endDate}
🚛 **Équipements :** ${quoteData.equipmentCategories?.join(', ')}
📝 **Projet :** ${quoteData.projectDescription}

Veux-tu confirmer ce devis pour qu'on te recontacte ?
    `;
    
    addBotMessage(summary, ['✅ Confirmer le devis', '✏️ Modifier', '❌ Annuler']);
  };

  const handleOptionClick = (option: string) => {
    if (currentStep === 'city' && SENEGALESE_CITIES.includes(option)) {
      handleStepFlow(option);
    } else if (currentStep === 'categories' && EQUIPMENT_CATEGORIES.includes(option)) {
      const currentCategories = quoteData.equipmentCategories || [];
      const newCategories = currentCategories.includes(option) 
        ? currentCategories.filter(cat => cat !== option)
        : [...currentCategories, option];
      
      setQuoteData(prev => ({ ...prev, equipmentCategories: newCategories }));
      addUserMessage(`Sélectionné: ${option}`);
      
      if (newCategories.length > 0) {
        addBotMessage("Parfait ! Tu peux sélectionner d'autres catégories ou taper 'fini' pour continuer.", EQUIPMENT_CATEGORIES);
      }
    } else if (currentStep === 'summary') {
      if (option === '✅ Confirmer le devis') {
        confirmQuote();
      } else if (option === '✏️ Modifier') {
        addBotMessage("Quel élément veux-tu modifier ?", ['Nom', 'Téléphone', 'Email', 'Ville', 'Dates', 'Équipements', 'Projet']);
      } else if (option === '❌ Annuler') {
        addBotMessage("Pas de problème ! N'hésite pas à revenir si tu changes d'avis. 😊");
        setTimeout(() => setIsOpen(false), 2000);
      }
    }
  };

  const confirmQuote = () => {
    const fullQuoteData = {
      sessionId,
      customerName: quoteData.customerName!,
      customerPhone: quoteData.customerPhone!,
      customerEmail: quoteData.customerEmail,
      deliveryCity: quoteData.deliveryCity!,
      startDate: quoteData.startDate!,
      endDate: quoteData.endDate!,
      equipmentCategories: quoteData.equipmentCategories!,
      specificNeeds: quoteData.specificNeeds!,
      projectDescription: quoteData.projectDescription!,
      conversationData: { messages, timestamp: new Date().toISOString() },
      status: 'confirmed',
      isConfirmed: true
    };

    saveChatbotQuoteMutation.mutate(fullQuoteData);
    
    addBotMessage(`
🎉 **Devis confirmé !**

Merci ${quoteData.customerName} ! Ton devis a été enregistré dans notre système.

📞 **Notre équipe va te contacter au ${quoteData.customerPhone} dans les plus brefs délais.**

Tu peux également nous appeler directement au **+221 71 018 89 89** pour toute question urgente.

À bientôt ! 👋
    `);
    
    setCurrentStep('completed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;
    
    if (currentStep === 'categories' && currentInput.toLowerCase() === 'fini') {
      if (quoteData.equipmentCategories && quoteData.equipmentCategories.length > 0) {
        addUserMessage('Fini');
        addBotMessage("Peux-tu décrire ton projet en quelques mots ?");
        setCurrentStep('project');
      } else {
        addBotMessage("Merci de sélectionner au moins une catégorie d'équipement !");
        return;
      }
    } else {
      handleStepFlow(currentInput);
    }
    
    setCurrentInput('');
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after close animation
    setTimeout(() => {
      setMessages([]);
      setCurrentStep('welcome');
      setQuoteData({});
    }, 300);
  };

  return (
    <>
      {/* Chatbot Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 rounded-full w-16 h-16 bg-kamsen-orange hover:bg-orange-600 shadow-2xl transform hover:scale-110 transition-all duration-300"
          data-testid="button-open-chatbot"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-6 left-6 z-50 w-96 h-[600px] shadow-2xl border-kamsen-orange/30 transform transition-all duration-300">
          <CardHeader className="bg-kamsen-orange text-white rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Awa - Assistant Kamsen</CardTitle>
                  <p className="text-sm text-white/80">En ligne</p>
                </div>
              </div>
              <Button
                onClick={handleClose}
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20 p-1"
                data-testid="button-close-chatbot"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[500px] p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-kamsen-blue-light text-kamsen-blue border border-kamsen-blue/20'
                        : 'bg-kamsen-orange text-white'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                    
                    {/* Options */}
                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start text-xs h-8 border-kamsen-blue/30 hover:bg-kamsen-blue/10"
                            data-testid={`button-option-${index}`}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Selected categories display */}
              {currentStep === 'categories' && quoteData.equipmentCategories && quoteData.equipmentCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-kamsen-blue-light rounded-lg">
                  <span className="text-sm text-kamsen-blue font-medium">Sélectionnés:</span>
                  {quoteData.equipmentCategories.map((cat, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-kamsen-orange/10 border-kamsen-orange/30">
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {currentStep !== 'completed' && (
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder={
                      currentStep === 'email' ? "Ton email ou 'passer'" :
                      currentStep === 'categories' ? "Ou tape 'fini' pour continuer" :
                      "Tape ta réponse..."
                    }
                    className="flex-1"
                    data-testid="input-chatbot-message"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="bg-kamsen-orange hover:bg-orange-600"
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
            
            {/* Contact info for completed step */}
            {currentStep === 'completed' && (
              <div className="border-t border-gray-200 p-4 bg-kamsen-blue-light text-center">
                <a href="tel:+221710188989" className="flex items-center justify-center gap-2 text-kamsen-blue hover:text-kamsen-orange transition-colors">
                  <Phone className="h-4 w-4" />
                  <span className="font-bold">+221 71 018 89 89</span>
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}