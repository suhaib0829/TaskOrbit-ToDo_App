import React, { useEffect, useState } from 'react';
import { Screen, Header, FAB, Card, Input } from '../components/ui';
import { ItemService } from '../services/api';
import { User, Item, ScreenName, Priority, Category } from '../types';
import { Plus, Search, Filter, Menu, Trash2, Edit2, Archive, Calendar, CheckCircle, Tag } from 'lucide-react';
import { DashboardCharts } from '../components/Charts';
import { SideMenu } from '../components/SideMenu';
import { getPriorityColor } from '../utils/helpers';

export const HomeScreen = ({ user, navigate }: { user: User, navigate: (s: ScreenName, p?: any) => void }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch Items
  const fetchItems = async () => {
    try {
      const data = await ItemService.getAll(user.uid);
      setItems(data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this task permanently?")) {
      try {
        await ItemService.delete(id);
        setItems(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        alert("Failed to delete item");
      }
    }
  };

  const handleToggleStatus = async (item: Item, e: React.MouseEvent) => {
      e.stopPropagation();
      const newStatus = item.status === 'completed' ? 'active' : 'completed';
      // Optimistic update
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i));
      try {
          await ItemService.update(item.id, { status: newStatus });
      } catch (err) {
          // Revert if fail
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: item.status } : i));
      }
  };

  // Filter Logic
  const filteredItems = items.filter(item => {
      const matchesTab = activeTab === 'all' ? true : item.status === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
  });

  return (
    <Screen className="relative bg-transparent">
      <SideMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        user={user} 
        navigate={navigate} 
      />

      <Header 
        title="Dashboard" 
        transparent
        leftIcon={<Menu className="w-6 h-6 text-slate-800 dark:text-white" />}
        onLeftPress={() => setMenuOpen(true)}
        rightIcon={<div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="User" /></div>}
      />

      <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <div className="p-6 space-y-6">
            {/* Greeting */}
            <div className="animate-slide-up">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">
                    Hello, <br/>
                    <span className="text-primary-500">{user.email?.split('@')[0]}</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your daily overview</p>
            </div>

            {/* Analytics */}
            <div className="animate-fade-in delay-100">
                <DashboardCharts items={items} />
            </div>

            {/* Search & Filter */}
            <div className="sticky top-0 z-10 pt-2 pb-2 bg-transparent backdrop-blur-sm space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {(['all', 'active', 'completed'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap ${
                                activeTab === tab 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Recent Tasks</h3>
                    <span className="text-xs font-bold text-slate-400">{filteredItems.length} found</span>
                </div>

                {filteredItems.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-10 text-slate-400 opacity-60">
                        <Archive className="w-12 h-12 mb-3" />
                        <p>No tasks found.</p>
                     </div>
                ) : (
                    filteredItems.map((item, index) => (
                        <TaskCard 
                            key={item.id} 
                            item={item} 
                            index={index} 
                            onToggle={(e) => handleToggleStatus(item, e)}
                            onDelete={(e) => handleDelete(item.id, e)}
                            onClick={() => navigate('EditItem', { item })}
                        />
                    ))
                )}
            </div>
        </div>
      </div>

      <FAB icon={<Plus className="w-6 h-6" />} onClick={() => navigate('AddItem')} />
    </Screen>
  );
};

const TaskCard = ({ item, index, onToggle, onDelete, onClick }: { 
    item: Item, index: number, onToggle: (e: any) => void, onDelete: (e: any) => void, onClick: () => void 
}) => (
    <div 
        onClick={onClick}
        className="group relative overflow-hidden glass-card rounded-2xl p-4 active:scale-[0.98] transition-all duration-300 animate-slide-up hover:border-primary-500/30"
        style={{ animationDelay: `${index * 0.05}s` }}
    >
        {/* Priority Stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
            item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
        }`} />

        <div className="flex items-start gap-4 pl-2">
            <button 
                onClick={onToggle}
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.status === 'completed' 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'
                }`}
            >
                {item.status === 'completed' && <CheckCircle className="w-4 h-4" />}
            </button>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-slate-800 dark:text-white leading-tight ${item.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                        {item.title}
                    </h4>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                
                <div className="flex items-center gap-2 mt-3">
                    {item.category && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {item.category}
                        </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 ${getPriorityColor(item.priority)}`}>
                        {item.priority || 'normal'}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt || '').toLocaleDateString()}
                    </span>
                </div>
            </div>
            
            <button 
                onClick={onDelete}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);
