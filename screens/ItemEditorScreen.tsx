import React, { useState } from 'react';
import { Screen, Header, Input, Button, Card } from '../components/ui';
import { ItemService } from '../services/api';
import { User, Item, ScreenName, Priority, Category } from '../types';
import { ChevronLeft, Save, FileText, Type, Tag, Flag } from 'lucide-react';

interface Props {
  user: User;
  navigate: (s: ScreenName) => void;
  mode: 'create' | 'edit';
  initialItem?: Item;
}

const CATEGORIES: Category[] = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Other'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export const ItemEditorScreen: React.FC<Props> = ({ user, navigate, mode, initialItem }) => {
  const [title, setTitle] = useState(initialItem?.title || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [category, setCategory] = useState<Category>(initialItem?.category || 'Personal');
  const [priority, setPriority] = useState<Priority>(initialItem?.priority || 'medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
          title,
          description,
          category,
          priority,
          status: initialItem?.status || 'active',
      };

      if (mode === 'create') {
        await ItemService.create({
          ...payload,
          userId: user.uid,
          createdAt: new Date().toISOString()
        } as any);
      } else if (mode === 'edit' && initialItem) {
        await ItemService.update(initialItem.id, payload as any);
      }
      navigate('Home');
    } catch (err) {
      setError('Failed to save item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Header 
        title={mode === 'create' ? "New Task" : "Edit Task"}
        leftIcon={<ChevronLeft className="w-6 h-6 text-slate-800 dark:text-white" />}
        onLeftPress={() => navigate('Home')}
      />
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto animate-slide-up">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <Input 
          label="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="What needs to be done?"
          icon={<Type className="w-5 h-5" />}
        />

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wide">Category</label>
          <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                        category === cat 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wide">Priority</label>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl capitalize transition-all ${
                  priority === p 
                  ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wide">Notes</label>
          <div className="relative group">
            <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <textarea 
              className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 pl-12 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[120px] resize-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details here..."
            />
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" isLoading={isLoading}>
            {mode === 'create' ? 'Create Task' : 'Save Changes'} <Save className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Screen>
  );
};
