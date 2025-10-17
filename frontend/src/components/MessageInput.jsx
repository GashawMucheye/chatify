import { useRef, useState } from 'react';
import useKeyboardSound from '../hooks/useKeyboardSound';
import { useChatStore } from '../hooks/useChatStore'; // Fixed path
import { useSendMessage } from '../hooks/useChatQueries'; // 1. Import the mutation hook
import toast from 'react-hot-toast';
import { ImageIcon, SendIcon, XIcon, Loader2 } from 'lucide-react'; // Import Loader2 for loading state

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null); // Get local state/actions from Zustand

  const { isSoundEnabled, selectedUser } = useChatStore(); // 2. Use the React Query mutation hook
  const { mutate: sendMessageMutation, isPending } = useSendMessage();

  const handleSendMessage = (e) => {
    e.preventDefault(); // Safety check for selected user
    if (!selectedUser) {
      toast.error('Please select a user to send a message.');
      return;
    }

    const trimmedText = text.trim();

    if (!trimmedText && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound(); // 3. Call the mutation hook with the required parameters

    sendMessageMutation({
      receiverId: selectedUser._id,
      messageData: {
        text: trimmedText,
        image: imagePreview,
      },
    }); // Clear local input state immediately for the optimistic update

    setText('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }; // Determine if the send button should be disabled

  const isInputEmpty = !text.trim() && !imagePreview;
  const isDisabled = isInputEmpty || isPending;

  return (
    <div className='p-4 border-t border-slate-700/50'>
      {imagePreview && (
        <div className='max-w-3xl mx-auto mb-3 flex items-center'>
          <div className='relative'>
            <img
              src={imagePreview}
              alt='Preview'
              className='w-20 h-20 object-cover rounded-lg border border-slate-700'
            />

            <button
              onClick={removeImage}
              className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700'
              type='button'
            >
              <XIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className='max-w-3xl mx-auto flex space-x-4'
      >
        <input
          type='text'
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className='flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4'
          placeholder='Type your message...'
          disabled={isPending} // Disable text input while sending
        />

        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          onChange={handleImageChange}
          className='hidden'
          disabled={isPending} // Disable file input while sending
        />
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? 'text-cyan-500' : ''
          }`}
          disabled={isPending} // Disable image upload button while sending
        >
          <ImageIcon className='w-5 h-5' />
        </button>
        <button
          type='submit'
          disabled={isDisabled} // Use the combined disabled state
          className='bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {/* 4. Display spinner if pending */}
          {isPending ? (
            <Loader2 className='w-5 h-5 animate-spin' />
          ) : (
            <SendIcon className='w-5 h-5' />
          )}
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
