import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import BottomNav from '../components/BottomNav';
import { MessageCircle, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Categorias principais (4 no grid)
const MAIN_CATEGORIES = [
  { value: 'social', label: 'Social', icon: '🤝' },
  { value: 'clothes', label: 'Roupas', icon: '👕' },
  { value: 'furniture', label: 'Móveis', icon: '🪑' },
  { value: 'transport', label: 'Transporte', icon: '🚗' }
];

// Todas as categorias
const ALL_CATEGORIES = [
  { value: 'social', label: 'Social', icon: '🤝' },
  { value: 'clothes', label: 'Roupas', icon: '👕' },
  { value: 'furniture', label: 'Móveis', icon: '🪑' },
  { value: 'transport', label: 'Transporte', icon: '🚗' },
  { value: 'food', label: 'Alimentação', icon: '🍽️' },
  { value: 'legal', label: 'Jurídico', icon: '⚖️' },
  { value: 'health', label: 'Saúde', icon: '🏥' },
  { value: 'housing', label: 'Moradia', icon: '🏠' },
  { value: 'work', label: 'Trabalho', icon: '💼' },
  { value: 'education', label: 'Educação', icon: '📚' }
];

export default function VolunteersPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchHelpRequests();
    } else {
      setHelpRequests([]);
    }
  }, [selectedCategories]);

  const fetchHelpRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts?type=need`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Filtrar posts que correspondem às categorias selecionadas
        const filtered = data.filter(post => {
          const postCategories = post.categories || [post.category];
          return postCategories.some(cat => selectedCategories.includes(cat));
        });
        setHelpRequests(filtered);
      }
    } catch (error) {
      console.error('Error fetching help requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const getCategoryInfo = (categoryValue) => {
    return ALL_CATEGORIES.find(c => c.value === categoryValue) || { icon: '📝', label: categoryValue };
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20" data-testid="volunteers-page">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl font-heading font-bold mb-1">🤝 Quero Ajudar</h1>
          <p className="text-sm text-white/90">Encontre pessoas que precisam da sua ajuda</p>
        </div>
      </div>

      {/* Modal Quero Ajudar - Idêntico à imagem */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-3xl max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-white p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              🤝 Quero Ajudar
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Selecione as categorias em que você pode ajudar e veja as solicitações disponíveis.
            </p>
          </DialogHeader>

          {/* Grid de 4 Categorias Principais */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {MAIN_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedCategories.includes(cat.value)
                    ? 'bg-amber-100 border-amber-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-medium text-gray-800">{cat.label}</div>
              </button>
            ))}
          </div>

          {/* Indicador de categorias selecionadas */}
          {selectedCategories.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-xl">
              <Check size={16} className="text-blue-600" />
              <span className="text-sm text-blue-700">
                {selectedCategories.length} {selectedCategories.length === 1 ? 'categoria selecionada' : 'categorias selecionadas'}:
              </span>
              <div className="flex gap-1 ml-1">
                {selectedCategories.map(cat => (
                  <span key={cat} className="text-lg">{getCategoryInfo(cat).icon}</span>
                ))}
              </div>
            </div>
          )}

          {/* Seção de Solicitações de Ajuda Disponíveis */}
          {selectedCategories.length > 0 && (
            <div className="mt-4 bg-green-50 rounded-2xl p-4 border border-green-200">
              <h3 className="font-bold text-green-800 mb-1 flex items-center gap-2">
                📋 Solicitações de Ajuda Disponíveis
              </h3>
              <p className="text-xs text-green-700 mb-4">
                Pessoas que precisam de ajuda nas categorias que você selecionou.
              </p>

              {loading ? (
                <div className="text-center py-4 text-gray-500">Carregando...</div>
              ) : helpRequests.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Nenhuma solicitação encontrada para as categorias selecionadas.
                </div>
              ) : (
                <div className="space-y-3">
                  {helpRequests.map(request => (
                    <div 
                      key={request.id}
                      onClick={() => navigate(`/direct-chat/${request.user_id}`)}
                      className="bg-white rounded-xl p-4 border border-green-200 cursor-pointer hover:shadow-md transition-all"
                    >
                      {/* Header com avatar e nome */}
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">
                            {request.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-gray-800">
                              {request.user?.name || 'Usuário'}
                            </p>
                            <MessageCircle size={18} className="text-gray-400" />
                          </div>
                          <span className="text-xs text-green-600">Precisa de ajuda</span>
                        </div>
                      </div>

                      {/* Título e Descrição */}
                      <p className="font-medium text-gray-800 mb-1">{request.title}</p>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {request.description}
                      </p>

                      {/* Categoria */}
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {getCategoryInfo(request.category).icon} {getCategoryInfo(request.category).label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Instrução */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Clique em uma solicitação para iniciar uma conversa e oferecer ajuda
              </p>
            </div>
          )}

          {/* Opção de criar oferta pública */}
          <div 
            onClick={() => {
              setShowModal(false);
              navigate('/home');
            }}
            className="mt-4 p-4 border-2 border-dashed border-blue-300 rounded-xl text-center cursor-pointer hover:bg-blue-50 transition-all"
          >
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Plus size={18} />
              <span className="font-medium">Prefiro criar uma oferta de ajuda pública</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Uma oferta fica visível para todos que precisam de ajuda
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conteúdo quando modal fechado */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {!showModal && (
          <>
            {/* Botão para reabrir modal */}
            <Button
              onClick={() => setShowModal(true)}
              className="w-full mb-6 rounded-full bg-primary text-white font-bold py-6"
            >
              🤝 Quero Ajudar - Selecionar Categorias
            </Button>

            {/* Lista de solicitações fora do modal */}
            {selectedCategories.length > 0 && helpRequests.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white mb-4">
                  Solicitações de Ajuda ({helpRequests.length})
                </h2>
                {helpRequests.map(request => (
                  <div 
                    key={request.id}
                    className="bg-white rounded-2xl p-5 shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {request.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{request.user?.name}</p>
                        <span className="text-xs text-green-600">Precisa de ajuda</span>
                      </div>
                    </div>
                    <p className="font-medium text-gray-800 mb-1">{request.title}</p>
                    <p className="text-gray-600 mb-4">{request.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {getCategoryInfo(request.category).icon} {getCategoryInfo(request.category).label}
                      </span>
                      <Button
                        onClick={() => navigate(`/direct-chat/${request.user_id}`)}
                        className="rounded-full bg-primary"
                      >
                        <MessageCircle size={16} className="mr-2" />
                        Conversar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
