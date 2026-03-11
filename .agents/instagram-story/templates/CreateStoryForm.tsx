import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MediaUploader } from './MediaUploader';
import { AudioRecorder } from './AudioRecorder';
import { Button } from '../ui/Button';
import { Toast } from '../ui/Toast';
import { ProgressBar } from '../ui/ProgressBar';
import { uploadStory } from '@/lib/firebase/firestore';
import { uploadFiles } from '@/lib/firebase/storage';

interface StoryForm {
  content: string;
  media: FileList;
  audio?: Blob;
}

export const CreateStoryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<StoryForm>();

  const onSubmit = async (data: StoryForm) => {
    try {
      setIsSubmitting(true);
      
      const mediaFiles = Array.from(data.media);
      const mediaUrls = await uploadFiles(mediaFiles, setProgress);
      
      let audioUrl = '';
      if (data.audio) {
        const audioFiles = await uploadFiles([data.audio], setProgress);
        audioUrl = audioFiles[0];
      }

      await uploadStory({
        content: data.content,
        mediaUrls,
        audioUrl,
        authorId: 'current-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setToast({
        type: 'success',
        message: 'Story created successfully!'
      });
      reset();
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to create story'
      });
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <textarea
          {...register('content', { required: 'Content is required' })}
          className="w-full p-4 border rounded-lg"
          placeholder="Write your story..."
          rows={5}
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
      </div>

      <MediaUploader register={register} />
      <AudioRecorder register={register} />

      {isSubmitting && <ProgressBar progress={progress} />}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Creating...' : 'Create Story'}
      </Button>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
};