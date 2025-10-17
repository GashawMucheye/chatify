import { useState, useRef } from 'react';
import { LogOutIcon, VolumeOffIcon, Volume2Icon, Loader2 } from 'lucide-react';

// ✅ FIX 1: Import the useAuthQueries hooks we built together
// import { useLogout, useUpdateProfile } from '../hooks/useAuthQueries';
// ✅ FIX 2: Ensure useAuthStore is imported from the correct path (assuming '../hooks/')
import { useAuthStore } from '../hooks/useAuthStore';
import { useChatStore } from '../hooks/useChatStore';
import { useLogout, useUpdateProfile } from '../hooks/useAuth';
const mouseClickSound = new Audio('/sounds/mouse-click.mp3');

function ProfileHeader() {
  // ZUSTAND STATE
  const { authUser } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image); // Update local state with selected image
      updateProfile({ profilePic: base64Image }); // Call mutation to update the profile picture
    };
  };

  // Handle sound toggle
  const handleSoundToggle = () => {
    // Play sound if enabled before toggling sound state
    if (isSoundEnabled) {
      mouseClickSound.currentTime = 0;
      mouseClickSound
        .play()
        .catch((error) => console.log('Audio play failed:', error));
    }
    toggleSound(); // Toggle sound state in chat store
  };

  const isDisabled = isLoggingOut || isUpdatingProfile; // Disable buttons if mutation is pending

  return (
    <div className='p-6 border-b border-slate-700/50'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {/* AVATAR */}
          <div className='avatar online'>
            <button
              className='size-14 rounded-full overflow-hidden relative group'
              onClick={() => fileInputRef.current?.click()} // Open file input on click
              disabled={isDisabled} // Disable button when loading
            >
              <span className='sr-only'>Change profile picture</span>
              <img
                src={selectedImg || authUser.profilePic || '/avatar.png'}
                alt='User avatar'
                className={`size-full object-cover ${
                  isUpdatingProfile ? 'opacity-50' : ''
                }`}
              />
              {/* Show spinner when updating profile */}
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                {isUpdatingProfile ? (
                  <Loader2 className='size-5 animate-spin text-white' />
                ) : (
                  <span className='text-white text-xs'>Change</span>
                )}
              </div>
            </button>
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageUpload}
              className='hidden'
              disabled={isDisabled} // Disable file input during loading
            />
          </div>
          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className='text-slate-200 font-medium text-base max-w-[180px] truncate'>
              {authUser.fullName}
            </h3>
            <p className='text-slate-400 text-xs'>Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className='flex gap-4 items-center'>
          {/* LOGOUT BTN */}
          <button
            className='text-slate-400 hover:text-slate-200 transition-colors'
            onClick={() => logout()} // Call mutation for logout
            disabled={isDisabled} // Disable button during logout
          >
            {isLoggingOut ? (
              <Loader2 className='size-5 animate-spin' />
            ) : (
              <LogOutIcon className='size-5' />
            )}
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className='text-slate-400 hover:text-slate-200 transition-colors'
            onClick={handleSoundToggle} // Handle sound toggle
            disabled={isDisabled} // Disable button during loading
          >
            {isSoundEnabled ? (
              <Volume2Icon className='size-5' />
            ) : (
              <VolumeOffIcon className='size-5' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
