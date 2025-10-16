import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ImageIcon, SendIcon, XIcon, Loader2 } from 'lucide-react';

// 1. IMPORT FIX: Import the specific useSendMessage hook
import { useSendMessage } from '../hooks/useChat';
// 2. IMPORT FIX: Import the Zustand store for client-side state
import { useChatStore } from '../store/useChatStore';
import useKeyboardSound from '../hooks/useKeyboardSound';

function MessageInput() {
  // 3. ZUSTAND STATE ACCESS: Get state/actions from useChatStore
  const { isSoundEnabled, selectedUser } = useChatStore((state) => ({
    isSoundEnabled: state.isSoundEnabled,
    selectedUser: state.selectedUser,
  }));

  // 4. HOOK USAGE FIX: Call useSendMessage with the receiverId
  const receiverId = selectedUser?._id;
  const {
    mutate: sendMessage,
    isPending: isSendingMessage,
    isError: isSendError,
  } = useSendMessage(receiverId);

  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  // 5. Check if the component is ready to send messages
  const isReady = !!selectedUser;

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Prevent action if not ready, no content, or already pending
    if (!isReady || (!text.trim() && !imagePreview) || isSendingMessage) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();

    // 6. MUTATION CALL FIX: Call the destructured 'sendMessage' function
    sendMessage(
      {
        text: text.trim(),
        image: imagePreview,
      },
      {
        // Success handler for cleaning up UI state ONLY
        onSuccess: () => {
          setText('');
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        // The onError is handled inside the useSendMessage hook itself
      }
    );
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
  };

  // The form is disabled if no user is selected OR if a message is currently sending.
  const isDisabled =
    !isReady || isSendingMessage || (!text.trim() && !imagePreview);

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
            // Only play sound if sound is enabled
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className={`flex-1 bg-slate-800/50 border rounded-lg py-2 px-4 ${
            isSendError ? 'border-red-500' : 'border-slate-700/50'
          }`}
          placeholder={
            isReady ? 'Type your message...' : 'Select a chat to begin...'
          }
          disabled={!isReady || isSendingMessage}
        />

        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          onChange={handleImageChange}
          className='hidden'
          disabled={!isReady || isSendingMessage}
        />

        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors 
                        ${imagePreview ? 'text-cyan-500' : ''}
                        ${
                          !isReady || isSendingMessage
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }
                    `}
          disabled={!isReady || isSendingMessage}
        >
          <ImageIcon className='w-5 h-5' />
        </button>

        <button
          type='submit'
          disabled={isDisabled}
          className='bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSendingMessage ? (
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
