import React, { useState } from 'react';
import { SendHorizonal, Image, Loader2 } from 'lucide-react';
import { useSendMessage } from '../hooks/useChat'; // Assuming this exists

function MessageInput({ receiverId }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const { mutate: sendMessage, isPending } = useSendMessage(receiverId);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    sendMessage({ text, image });

    // Clear input after sending
    setText('');
    setImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  return (
    <form
      onSubmit={handleSend}
      className='p-4 border-t border-slate-700/50 flex gap-3 items-center'
    >
      {/* Image Preview and Clear Button */}
      {image && (
        <div className='relative size-12 rounded-lg overflow-hidden'>
          <img src={image} alt='Preview' className='size-full object-cover' />
          <button
            type='button'
            onClick={() => setImage(null)}
            className='absolute top-0 right-0 bg-red-500/80 text-white size-4 flex items-center justify-center text-xs font-bold rounded-bl'
          >
            &times;
          </button>
        </div>
      )}

      {/* File Input */}
      <input
        type='file'
        accept='image/*'
        onChange={handleImageUpload}
        className='hidden'
        id='image-upload'
      />

      {/* Image Upload Button */}
      <label
        htmlFor='image-upload'
        className='cursor-pointer text-slate-400 hover:text-cyan-400 transition-colors'
      >
        <Image className='size-6' />
      </label>

      {/* Text Input */}
      <input
        type='text'
        placeholder='Type a message...'
        className='flex-1 p-3 bg-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-shadow'
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isPending}
      />

      {/* Send Button */}
      <button
        type='submit'
        className={`p-3 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors ${
          isPending ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className='size-6 animate-spin' />
        ) : (
          <SendHorizonal className='size-6' />
        )}
      </button>
    </form>
  );
}

export default MessageInput;
