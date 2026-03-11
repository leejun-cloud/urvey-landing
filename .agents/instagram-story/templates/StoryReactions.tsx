import { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

interface ReactionButtonProps {
  storyId: string;
  count: number;
  type: keyof Story['reactions'];
  icon: string;
  label: string;
}

const ReactionButton = ({ storyId, count, type, icon, label }: ReactionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const storyRef = doc(db, 'stories', storyId);
      await updateDoc(storyRef, {
        [`reactions.${type}`]: increment(1)
      });
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="reaction-button flex items-center gap-2 px-4 py-2 rounded-full 
                 bg-gray-100 hover:bg-gray-200 transition-colors"
      aria-label={`${label} 버튼`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
      <span className="text-xs text-gray-500">({count})</span>
    </button>
  );
};

interface StoryReactionsProps {
  storyId: string;
  reactions: Story['reactions'];
}

const StoryReactions = ({ storyId, reactions }: StoryReactionsProps) => {
  const REACTION_TYPES = [
    { type: 'remember', icon: '💛', label: '기억해요' },
    { type: 'grateful', icon: '🙏', label: '감사해요' },
    { type: 'legacy', icon: '✊', label: '이어갈게요' },
    { type: 'love', icon: '🥰', label: '사랑해요' },
    { type: 'support', icon: '🙌', label: '응원해요' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {REACTION_TYPES.map(({ type, icon, label }) => (
        <ReactionButton
          key={type}
          storyId={storyId}
          count={reactions[type]}
          type={type}
          icon={icon}
          label={label}
        />
      ))}
    </div>
  );
};

export default StoryReactions;